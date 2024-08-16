import {
  Appointment,
  AppointmentStatus,
  PaymentStatus,
  Prisma,
  UserRole,
} from "@prisma/client";
import { add } from "date-fns";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dbClient from "../../../prisma";
import AppError from "../../error/AppError";
import { IPaginationOptions } from "../../utils/getPaginationOption";
import { IAppointmentPayload } from "./appointment.interface";

/* ------------------->> Get All Appointment Service <<----------------- */
const getAppointments = async (
  query: IAppointmentPayload,
  options: IPaginationOptions
) => {
  const { limit, page, skip, sortBy, sortOrder } = options;
  const andCondition: Prisma.AppointmentWhereInput[] = [];

  // filtering
  if (query && Object.keys(query).length > 0) {
    // start date and time
    if (query.startDate) {
      if (query.startTime) {
        andCondition.push({
          schedule: {
            startDateTime: {
              gte: add(new Date(query.startDate), {
                hours: parseInt(query.startTime.split(":")[0]),
                minutes: parseInt(query.startTime.split(":")[1]),
              }),
            },
          },
        });
      } else {
        andCondition.push({
          schedule: {
            startDateTime: { gte: new Date(query.startDate) },
          },
        });
      }
    }

    // end date and time
    if (query.endDate) {
      if (query.endTime) {
        andCondition.push({
          schedule: {
            endDateTime: {
              lte: add(new Date(query.endDate), {
                hours: parseInt(query.endTime.split(":")[0]),
                minutes: parseInt(query.endTime.split(":")[1]),
              }),
            },
          },
        });
      } else {
        andCondition.push({
          schedule: {
            endDateTime: { lte: new Date(query.endDate) },
          },
        });
      }
    }

    // filter by status
    if (query.status) {
      andCondition.push({
        status: query.status,
      });
    }

    // filter by pay status
    if (query.paymentStatus) {
      andCondition.push({
        paymentStatus: query.paymentStatus,
      });
    }
  }

  // out data from db
  const result = await dbClient.appointment.findMany({
    where: {
      AND: andCondition,
    },
    include: {
      doctor: true,
      patient: true,
      schedule: true,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip: skip,
    take: limit,
  });

  // count total
  const total = await dbClient.appointment.count({
    where: {
      AND: andCondition,
    },
  });

  return {
    data: result,
    meta: {
      page,
      limit,
      total: total,
    },
  };
};

/* ------------------->> Create Appointment Service <<----------------- */
const createAppointment = async (user: JwtPayload, payload: Appointment) => {
  // check doctor exist
  const doctor = await dbClient.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });

  // check doctor schedule exist
  await dbClient.doctorSchedule.findFirstOrThrow({
    where: {
      doctorId: payload.doctorId,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  // patient exist
  const patient = await dbClient.patient.findUniqueOrThrow({
    where: {
      email: user.email,
      isDeleted: false,
    },
  });

  payload.patientId = patient.id;
  payload.videoCallingId = uuidv4();
  const transactionId = uuidv4();

  const appointment = await dbClient.$transaction(async (txClient) => {
    // create appointment
    const appointment = await txClient.appointment.create({
      data: payload,
    });

    // create payment
    await txClient.payment.create({
      data: {
        appointmentId: appointment.id,
        amount: doctor.appointmentFee,
        transactionId: transactionId,
      },
    });

    // update schedule status
    await dbClient.doctorSchedule.updateMany({
      where: {
        doctorId: payload.doctorId,
        scheduleId: payload.scheduleId,
      },
      data: {
        isBooked: true,
      },
    });

    return appointment;
  });

  const result = await dbClient.appointment.findUnique({
    where: {
      id: appointment.id,
    },
    include: {
      doctor: true,
      payment: true,
      schedule: true,
    },
  });

  return result;
};

/* ------------------->> Get My Appointment Service <<----------------- */
const getMyAppointments = async (
  user: JwtPayload,
  query: IAppointmentPayload,
  options: IPaginationOptions
) => {
  const { limit, page, skip, sortBy, sortOrder } = options;
  const andCondition: Prisma.AppointmentWhereInput[] = [];

  if (user && user.role === UserRole.DOCTOR) {
    const doctor = await dbClient.doctor.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    });
    andCondition.push({
      doctorId: doctor.id,
    });
  } else if (user && user.role === UserRole.PATIENT) {
    const patient = await dbClient.patient.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    });
    andCondition.push({
      patientId: patient.id,
    });
  }

  // filtering
  if (query && Object.keys(query).length > 0) {
    // start date and time
    if (query.startDate) {
      if (query.startTime) {
        andCondition.push({
          schedule: {
            startDateTime: {
              gte: add(new Date(query.startDate), {
                hours: parseInt(query.startTime.split(":")[0]),
                minutes: parseInt(query.startTime.split(":")[1]),
              }),
            },
          },
        });
      } else {
        andCondition.push({
          schedule: {
            startDateTime: { gte: new Date(query.startDate) },
          },
        });
      }
    }

    // end date and time
    if (query.endDate) {
      if (query.endTime) {
        andCondition.push({
          schedule: {
            endDateTime: {
              lte: add(new Date(query.endDate), {
                hours: parseInt(query.endTime.split(":")[0]),
                minutes: parseInt(query.endTime.split(":")[1]),
              }),
            },
          },
        });
      } else {
        andCondition.push({
          schedule: {
            endDateTime: { lte: new Date(query.endDate) },
          },
        });
      }
    }

    // filter by status
    if (query.status) {
      andCondition.push({
        status: query.status,
      });
    }

    // filter by pay status
    if (query.paymentStatus) {
      andCondition.push({
        paymentStatus: query.paymentStatus,
      });
    }
  }

  // out data from db
  const result = await dbClient.appointment.findMany({
    where: {
      AND: andCondition,
    },
    include:
      user.role === UserRole.DOCTOR
        ? {
            schedule: true,
            patient: {
              include: {
                patientHealthData: true,
                medicalReport: true,
              },
            },
          }
        : {
            schedule: true,
            doctor: {
              include: {
                doctorSpecialty: true,
              },
            },
          },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip: skip,
    take: limit,
  });

  // count total
  const total = await dbClient.appointment.count({
    where: {
      AND: andCondition,
    },
  });

  return {
    data: result,
    meta: {
      page,
      limit,
      total: total,
    },
  };
};

/* ------------------->> Update Appointment Service <<----------------- */
const updateAppointmentStatus = async (
  user: JwtPayload,
  id: string,
  payload: { status: AppointmentStatus }
) => {
  // check appointment exist
  const appointment = await dbClient.appointment.findUniqueOrThrow({
    where: { id },
    include: {
      doctor: true,
    },
  });

  // check doctor role
  if (!user || appointment.doctor.email !== user.email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot update status of appointment"
    );
  }

  // update appointment status
  const updatedAppointment = await dbClient.appointment.update({
    where: { id },
    data: {
      status: payload.status,
    },
  });

  return updatedAppointment;
};

/* ------------------->> Cancel Unpaid Appointment Service <<----------------- */
const cancelUnpaidAppointments = async () => {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  // collect unpaid appointment ids
  const unpaidAppointments = await dbClient.appointment.findMany({
    where: {
      paymentStatus: PaymentStatus.UNPAID,
      createdAt: {
        lte: thirtyMinutesAgo,
      },
    },
  });

  const appointmentIdsToCancel = unpaidAppointments.map(
    (appointment) => appointment.id
  );

  await dbClient.$transaction(async (txClient) => {
    // delete payment information
    await txClient.payment.deleteMany({
      where: {
        appointmentId: {
          in: appointmentIdsToCancel,
        },
      },
    });

    // update doctor  schedule
    for (const appointment of unpaidAppointments) {
      await txClient.doctorSchedule.updateMany({
        where: {
          doctorId: appointment.doctorId,
          scheduleId: appointment.scheduleId,
        },
        data: {
          isBooked: false,
        },
      });
    }

    console.log(appointmentIdsToCancel);
    // delete appointment information
    await txClient.appointment.deleteMany({
      where: {
        id: {
          in: appointmentIdsToCancel,
        },
      },
    });
  });
};

export const AppointmentServices = {
  getAppointments,
  createAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  cancelUnpaidAppointments,
};

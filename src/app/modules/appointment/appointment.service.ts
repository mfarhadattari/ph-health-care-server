import { Appointment, Prisma, UserRole } from "@prisma/client";
import { add } from "date-fns";
import { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dbClient from "../../../prisma";
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
  console.log({ user, payload });
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

export const AppointmentServices = {
  getAppointments,
  createAppointment,
  getMyAppointments,
};

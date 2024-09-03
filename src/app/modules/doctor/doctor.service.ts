/* eslint-disable @typescript-eslint/no-explicit-any */
import { Doctor, DoctorSchedule, Prisma, UserStatus } from '@prisma/client';
import { add } from 'date-fns';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import dbClient from '../../../prisma';
import AppError from '../../error/AppError';
import { IFile } from '../../interface/file';
import { uploadToCloud } from '../../utils/fileUpload';
import { IPaginationOptions } from '../../utils/getPaginationOption';
import peakObject from '../../utils/peakObject';
import {
  generateFilterCondition,
  generateSearchCondition,
} from '../../utils/queryHelper';
import { ISchedulerPayload } from '../schedule/schedule.interface';
import { doctorSearchableFields, doctorUpdateAbleFields } from './doctor.const';

/* ---------------->> Get, Search & Filter Doctor Service <<------------- */
const getDoctor = async (query: any, options: IPaginationOptions) => {
  const { searchTerm, specialties, ...filterQuery } = query;
  const { limit, page, skip, sortBy, sortOrder } = options;
  const andCondition: Prisma.DoctorWhereInput[] = [
    {
      isDeleted: false,
    },
  ];

  // searching
  if (searchTerm) {
    const searchCondition = generateSearchCondition(
      searchTerm,
      doctorSearchableFields,
    );
    andCondition.push({
      OR: searchCondition,
    });
  }

  // filtering
  if (filterQuery && Object.keys(filterQuery).length > 0) {
    const filterCondition = generateFilterCondition(filterQuery);
    andCondition.push({
      AND: filterCondition,
    });
  }

  // filter by specialties
  if (specialties) {
    andCondition.push({
      doctorSpecialty: {
        some: {
          specialty: {
            title: {
              contains: specialties,
              mode: 'insensitive',
            },
          },
        },
      },
    });
  }

  // out data from db
  const result = await dbClient.doctor.findMany({
    where: {
      AND: andCondition,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip: skip,
    take: limit,
    include: {
      doctorSpecialty: {
        include: {
          specialty: true,
        },
      },
    },
  });

  // count total
  const total = await dbClient.doctor.count({
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

/* ------------------>> Get Doctor Details Service <<--------------- */
const getDoctorDetails = async (id: string) => {
  const result = await dbClient.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      doctorSpecialty: {
        include: {
          specialty: true,
        },
      },
    },
  });

  return result;
};

/* ------------------>> Update Doctor Details Service <<--------------- */
const updateDoctorDetails = async (
  id: string,
  payload: Doctor & { specialties: { id: string; isDeleted: boolean }[] },
  file: IFile | null,
) => {
  const doctor = await dbClient.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const { specialties, ...doctorData } = payload;
  const updateData = peakObject(doctorData as any, doctorUpdateAbleFields);

  if (file) {
    const { secure_url } = await uploadToCloud(file, `avatar-${doctor.email}`);
    updateData.profilePhoto = secure_url;
  }

  await dbClient.$transaction(async (txClient) => {
    if (updateData && Object.keys(updateData).length > 0) {
      // update doctor data
      await txClient.doctor.update({
        where: {
          id,
        },
        data: updateData,
      });
    }

    // update specialties data
    if (specialties) {
      //delete specialties
      const deleteSpecialtyIds = specialties
        .filter((specialty) => specialty.isDeleted)
        .map((specialty) => specialty.id);

      if (deleteSpecialtyIds && deleteSpecialtyIds.length > 0) {
        await txClient.doctorSpecialty.deleteMany({
          where: {
            doctorId: id,
            specialtiesId: {
              in: deleteSpecialtyIds,
            },
          },
        });
      }

      // add specialties
      const addSpecialties = specialties
        .filter((specialty) => !specialty.isDeleted)
        .map((specialty) => ({
          doctorId: doctor.id,
          specialtiesId: specialty.id,
        }));

      if (addSpecialties && addSpecialties.length > 0) {
        await txClient.doctorSpecialty.createMany({
          data: addSpecialties,
        });
      }
    }
  });

  const result = await dbClient.doctor.findUnique({
    where: {
      id,
    },
    include: {
      doctorSpecialty: {
        include: {
          specialty: true,
        },
      },
    },
  });

  return result;
};

/* ------------------>> Delete Doctor Service <<--------------- */
const deleteDoctor = async (id: string) => {
  const doctor = await dbClient.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  await dbClient.$transaction(async (txClient) => {
    await txClient.doctor.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await txClient.user.update({
      where: {
        email: doctor.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
  });
};

/* ------------------->> Create Doctor Schedule Service <<----------------- */
const createDoctorSchedule = async (
  payload: { schedules: string[] },
  user: JwtPayload,
) => {
  // check doctor exist
  const doctor = await dbClient.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const doctorSchedules: DoctorSchedule[] = [];

  if (!payload.schedules || payload.schedules.length <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Schedules ids missing');
  }

  // filter exist schedule
  const existScheduleIds: string[] = [];
  for (const id of payload.schedules) {
    const isExist = await dbClient.schedule.findUnique({
      where: {
        id,
      },
    });
    if (isExist) {
      existScheduleIds.push(id);
    }
  }

  if (!existScheduleIds || existScheduleIds.length <= 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'Schedules not found');
  }

  for (const scheduleId of existScheduleIds) {
    // check already exists
    const isExist = await dbClient.doctorSchedule.findFirst({
      where: {
        scheduleId,
        doctorId: doctor.id,
      } as Prisma.DoctorScheduleWhereUniqueInput,
    });

    // create is not exist
    if (!isExist) {
      const doctorSchedule = await dbClient.doctorSchedule.create({
        data: {
          doctorId: doctor.id,
          scheduleId: scheduleId,
        },
      });
      doctorSchedules.push(doctorSchedule);
    }
  }

  if (!doctorSchedules || doctorSchedules.length <= 0) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error creating doctor schedule',
    );
  }

  return doctorSchedules;
};

/* ------------------->> Get Doctor Schedule Service <<----------------- */
const getDoctorSchedule = async (user: JwtPayload, query: ISchedulerPayload) => {
  const doctor = await dbClient.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const andCondition: Prisma.DoctorScheduleWhereInput[] = [
    {
      doctorId: doctor.id,
    },
  ];

  // filtering
  if (query && Object.keys(query).length > 0) {
    // start date and time
    if (query.startDate) {
      if (query.startTime) {
        andCondition.push({
          schedule: {
            startDateTime: {
              gte: add(new Date(query.startDate), {
                hours: parseInt(query.startTime.split(':')[0]),
                minutes: parseInt(query.startTime.split(':')[1]),
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
                hours: parseInt(query.endTime.split(':')[0]),
                minutes: parseInt(query.endTime.split(':')[1]),
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
  }

  // out data from db
  const result = await dbClient.doctorSchedule.findMany({
    where: {
      AND: andCondition,
    },
    include: {
      schedule: true,
    },
  });

  // count total
  const total = await dbClient.doctorSchedule.count({
    where: {
      AND: andCondition,
    },
  });

  return {
    data: result,
    meta: {
      total: total,
    },
  };
};

/* ------------------->> Delete Doctor Schedule Service <<----------------- */
const deleteDoctorSchedule = async (id: string, user: JwtPayload) => {
  const doctor = await dbClient.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const schedule = await dbClient.schedule.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await dbClient.doctorSchedule.findFirstOrThrow({
    where: {
      doctorId: doctor.id,
      scheduleId: schedule.id,
    } as Prisma.DoctorScheduleWhereUniqueInput,
  });

  await dbClient.doctorSchedule.deleteMany({
    where: {
      doctorId: doctor.id,
      scheduleId: schedule.id,
    } as Prisma.DoctorScheduleWhereUniqueInput,
  });
};

export const DoctorServices = {
  getDoctor,
  getDoctorDetails,
  updateDoctorDetails,
  deleteDoctor,
  createDoctorSchedule,
  getDoctorSchedule,
  deleteDoctorSchedule,
};

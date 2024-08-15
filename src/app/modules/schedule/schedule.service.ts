import { Prisma, Schedule } from "@prisma/client";
import { add } from "date-fns";
import httpStatus from "http-status";
import dbClient from "../../../prisma";
import AppError from "../../error/AppError";
import { IPaginationOptions } from "../../utils/getPaginationOption";
import { ISchedulerPayload } from "./schedule.interface";

/* ------------------->> Create Schedule Service <<----------------- */
const createSchedule = async (payload: ISchedulerPayload) => {
  const schedules: Schedule[] = [];
  let startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);
  while (startDate <= endDate) {
    const dayStartTime = add(startDate, {
      hours: parseInt(payload.startTime.split(":")[0]),
      minutes: parseInt(payload.startTime.split(":")[1]),
    });
    const dayEndTime = add(startDate, {
      hours: parseInt(payload.endTime.split(":")[0]),
      minutes: parseInt(payload.endTime.split(":")[1]),
    });
    let scheduleStart = dayStartTime;
    while (scheduleStart < dayEndTime) {
      const scheduleEnd = add(scheduleStart, {
        minutes: 30,
      });

      const isScheduleExist = await dbClient.schedule.findFirst({
        where: {
          startDateTime: scheduleStart,
          endDateTime: scheduleEnd,
        },
      });
      if (!isScheduleExist) {
        const schedule = await dbClient.schedule.create({
          data: {
            startDateTime: scheduleStart,
            endDateTime: scheduleEnd,
          },
        });
        schedules.push(schedule);
      }
      scheduleStart = scheduleEnd;
    }
    startDate = add(startDate, {
      days: 1,
    });
  }

  if (schedules.length <= 0) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }

  return schedules;
};

/* ------------------->> Get Schedule Service <<----------------- */
const getSchedule = async (
  query: ISchedulerPayload,
  options: IPaginationOptions
) => {
  const { limit, page, skip, sortBy, sortOrder } = options;
  const andCondition: Prisma.ScheduleWhereInput[] = [];

  // filtering
  if (query && Object.keys(query).length > 0) {
    // start date and time
    if (query.startDate) {
      if (query.startTime) {
        andCondition.push({
          startDateTime: {
            gte: add(new Date(query.startDate), {
              hours: parseInt(query.startTime.split(":")[0]),
              minutes: parseInt(query.startTime.split(":")[1]),
            }),
          },
        });
      } else {
        andCondition.push({
          startDateTime: { gte: new Date(query.startDate) },
        });
      }
    }

    // end date and time
    if (query.endDate) {
      if (query.endTime) {
        andCondition.push({
          endDateTime: {
            lte: add(new Date(query.endDate), {
              hours: parseInt(query.endTime.split(":")[0]),
              minutes: parseInt(query.endTime.split(":")[1]),
            }),
          },
        });
      } else {
        andCondition.push({
          endDateTime: { lte: new Date(query.endDate) },
        });
      }
    }
  }

  // out data from db
  const result = await dbClient.schedule.findMany({
    where: {
      AND: andCondition,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip: skip,
    take: limit,
  });

  // count total
  const total = await dbClient.schedule.count({
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

/* ------------------->> Delete Schedule Service <<----------------- */
const deleteSchedule = async (id: string) => {
  await dbClient.schedule.delete({
    where: {
      id,
    },
  });
};

export const ScheduleServices = {
  createSchedule,
  getSchedule,
  deleteSchedule,
};

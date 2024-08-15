import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import getPaginationOptions from "../../utils/getPaginationOption";
import peakObject from "../../utils/peakObject";
import sendResponse from "../../utils/sendResponse";
import { ScheduleFilterableFields } from "./schedule.conts";
import { ScheduleServices } from "./schedule.service";

/* ------------------->> Create Schedule Controller <<----------------- */
const createSchedule = catchAsync(async (req, res) => {
  const result = await ScheduleServices.createSchedule(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Schedule created successfully",
    data: result,
  });
});

/* ------------------->> Get Schedule Controller <<----------------- */
const getSchedule = catchAsync(async (req, res) => {
  const filterQuery = peakObject(req.query, ScheduleFilterableFields);
  const options = getPaginationOptions(req.query);
  const result = await ScheduleServices.getSchedule(
    filterQuery as any,
    options
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Schedule deleted successfully",
    meta: result.meta,
    data: result.data,
  });
});

/* ------------------->> Delete Schedule Controller <<----------------- */
const deleteSchedule = catchAsync(async (req, res) => {
  const { id } = req.params;
  await ScheduleServices.deleteSchedule(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Schedule deleted successfully",
  });
});

export const ScheduleControllers = {
  createSchedule,
  getSchedule,
  deleteSchedule,
};

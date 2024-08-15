import httpStatus from "http-status";
import { IFile } from "../../interface/file";
import catchAsync from "../../utils/catchAsync";
import getPaginationOptions from "../../utils/getPaginationOption";
import peakObject from "../../utils/peakObject";
import sendResponse from "../../utils/sendResponse";
import { ScheduleFilterableFields } from "../schedule/schedule.conts";
import { doctorFilterableFields } from "./doctor.const";
import { DoctorServices } from "./doctor.service";

/* ---------------->> Get, Search & Filter Doctor Controller <<------------- */
const getDoctor = catchAsync(async (req, res) => {
  const filterQuery = peakObject(req.query, doctorFilterableFields);
  const options = getPaginationOptions(req.query);
  const result = await DoctorServices.getDoctor(filterQuery, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Doctors retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

/* ------------------>> Get Doctor Details Controller <<--------------- */
const getDoctorDetails = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DoctorServices.getDoctorDetails(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Doctor detail retrieve",
    data: result,
  });
});

/* ------------------>> Update Doctor Details Controller <<--------------- */
const updateDoctorDetails = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await DoctorServices.updateDoctorDetails(
    id,
    req.body,
    req.file as IFile
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Doctor detail updated",
    data: result,
  });
});

/* ------------------>> Delete Doctor Controller <<--------------- */
const deleteDoctor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DoctorServices.deleteDoctor(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Doctor deleted successfully",
    data: result,
  });
});

/* ------------------->> Create Doctor Schedule Controller <<----------------- */
const createDoctorSchedule = catchAsync(async (req, res) => {
  const result = await DoctorServices.createDoctorSchedule(req.body, req.user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Doctor Schedule created successfully",
    data: result,
  });
});

/* ------------------->> Get Doctor Schedule Controller <<----------------- */
const getDoctorSchedule = catchAsync(async (req, res) => {
  const filterQuery = peakObject(req.query, ScheduleFilterableFields);
  const { id } = req.params;
  const result = await DoctorServices.getDoctorSchedule(id, filterQuery as any);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Doctor Schedule retrieve successfully",
    meta: result.meta,
    data: result.data,
  });
});

/* ------------------->> Delete Doctor Schedule Controller <<----------------- */
const deleteDoctorSchedule = catchAsync(async (req, res) => {
  const { id } = req.params;
  await DoctorServices.deleteDoctorSchedule(id, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Doctor Schedule deleted successfully",
  });
});

export const DoctorControllers = {
  getDoctor,
  getDoctorDetails,
  updateDoctorDetails,
  deleteDoctor,
  createDoctorSchedule,
  getDoctorSchedule,
  deleteDoctorSchedule,
};

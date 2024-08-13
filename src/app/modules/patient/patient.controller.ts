import httpStatus from "http-status";
import { IFile } from "../../interface/file";
import catchAsync from "../../utils/catchAsync";
import getPaginationOptions from "../../utils/getPaginationOption";
import peakObject from "../../utils/peakObject";
import sendResponse from "../../utils/sendResponse";
import { patientFilterableFields } from "./patient.const";
import { PatientServices } from "./patient.service";

/* ---------------->> Get, Search & Filter Patient Controller <<------------- */
const getPatients = catchAsync(async (req, res) => {
  const filterQuery = peakObject(req.query, patientFilterableFields);
  const options = getPaginationOptions(req.query);
  const result = await PatientServices.getPatients(filterQuery, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Patients retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

/* ------------------>> Get Patient Details Controller <<--------------- */
const getPatientDetails = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PatientServices.getPatientDetails(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Patient detail retrieve",
    data: result,
  });
});

/* ------------------>> Update Patient Details Controller <<--------------- */
const updatePatientDetails = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await PatientServices.updatePatientDetails(
    id,
    req.body,
    req.file as IFile
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Patient detail updated",
    data: result,
  });
});

/* ------------------>> Delete Patient Controller <<--------------- */
const deletePatient = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PatientServices.deletePatient(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Patient deleted successfully",
    data: result,
  });
});

export const PatientControllers = {
  getPatients,
  getPatientDetails,
  updatePatientDetails,
  deletePatient,
};

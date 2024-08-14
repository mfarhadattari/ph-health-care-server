import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MedicalReportServices } from "./medicalReport.service";

/* ------------------->> Create Medical Report Controller <<----------------- */
const createMedicalReport = catchAsync(async (req, res) => {
  const result = await MedicalReportServices.createMedicalReport(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Medical report created successfully",
    data: result,
  });
});

/* ------------------->> Delete Medical Report Controller <<----------------- */
const deleteMedicalReport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MedicalReportServices.deleteMedicalReport(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Medical report updated successfully",
    data: result,
  });
});

export const MedicalReportControllers = {
  createMedicalReport,
  deleteMedicalReport,
};

import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PrescriptionServices } from "./prescription.service";

/* --------------->> Create Prescription <<------------- */
const createPrescription = catchAsync(async (req, res) => {
  const result = await PrescriptionServices.createPrescription(
    req.user,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Prescription created successfully",
    data: result,
  });
});

/* --------------->> Get My Prescription <<------------- */
const getMyPrescription = catchAsync(async (req, res) => {
  const result = await PrescriptionServices.getMyPrescription(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Prescription retrieve successfully",
    data: result,
  });
});

export const PrescriptionControllers = {
  createPrescription,
  getMyPrescription,
};

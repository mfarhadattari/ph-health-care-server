import httpStatus from "http-status";
import { IFile } from "../../interface/file";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const createAdmin = catchAsync(async (req, res) => {
  const result = await UserServices.createAdmin(
    req.body,
    req.file as IFile | null
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Admin created successfully",
    data: result,
  });
});

const createDoctor = catchAsync(async (req, res) => {
  const result = await UserServices.createDoctor(req.body, req.file as IFile);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Doctor created successfully",
    data: result,
  });
});

const createPatient = catchAsync(async (req, res) => {
  const result = await UserServices.createPatient(req.body, req.file as IFile);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Patient created successfully",
    data: result,
  });
});

export const UserControllers = { createAdmin, createDoctor, createPatient };

import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const createAdmin = catchAsync(async (req, res) => {
  const result = await UserServices.createAdmin(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Admin created successfully",
    data: result,
  });
});

export const UserControllers = { createAdmin };

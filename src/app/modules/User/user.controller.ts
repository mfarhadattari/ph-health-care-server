import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.createAdmin(req.body);

    sendResponse(res, {
      message: "Admin created successfully",
      data: result,
      status: httpStatus.CREATED,
    });
  } catch (error: any) {
    next(error);
  }
};

export const UserControllers = { createAdmin };

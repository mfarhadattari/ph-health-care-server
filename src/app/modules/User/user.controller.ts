import { Request, Response } from "express";
import { UserServices } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  const result = await UserServices.createAdmin(req.body);

  res.status(200).json({
    success: true,
    message: "Admin created successfully",
    data: result,
  });
};

export const UserControllers = { createAdmin };

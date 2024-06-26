import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Route not found",
    data: null,
  });

  next();
};

export default notFoundHandler;

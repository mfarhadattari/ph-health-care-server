import { RequestHandler } from "express";
import httpStatus from "http-status";

const notFoundHandler: RequestHandler = (req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Routes not found",
  });
};

export default notFoundHandler;

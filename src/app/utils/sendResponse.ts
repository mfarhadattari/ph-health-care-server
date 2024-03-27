import { Response } from "express";
import httpStatus from "http-status";

interface IResponseData<T> {
  status?: number;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data?: T;
}

const sendResponse = <T>(res: Response, resData: IResponseData<T>) => {
  const { status, message, meta, data } = resData;
  res.status(status || httpStatus.OK).json({
    success: true,
    message: message || "Success",
    meta,
    data: data || null,
  });
};

export default sendResponse;

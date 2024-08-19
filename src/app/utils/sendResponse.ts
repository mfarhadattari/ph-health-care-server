import { Response } from 'express';

interface IMetaData {
  page?: number;
  limit?: number;
  total?: number;
}

interface IResponseData<T> {
  statusCode?: number;
  message?: string;
  data?: T | null | undefined;
  meta?: IMetaData | null | undefined;
}

const sendResponse = <T>(res: Response, payload: IResponseData<T>) => {
  res.status(payload.statusCode || 200).json({
    success: true,
    message: payload.message || 'Success',
    meta: payload.meta,
    data: payload.data,
  });
};

export default sendResponse;

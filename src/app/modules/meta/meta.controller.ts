import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MetaServices } from "./meta.service";

const getMetaData = catchAsync(async (req, res) => {
  const result = await MetaServices.getMetaData(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Meta data fetched successfully",
    data: result,
  });
});

export const MetaControllers = { getMetaData };

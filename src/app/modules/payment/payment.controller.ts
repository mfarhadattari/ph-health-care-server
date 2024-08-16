import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";

/* --------------->> Init Payment <<------------- */
const initPayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.initPayment(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Payment initialized successfully",
    data: result,
  });
});

/* --------------->> Validate Payment <<------------- */
const validatePayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.validatePayment(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Payment success",
    data: result,
  });
});

export const PaymentControllers = { initPayment, validatePayment };

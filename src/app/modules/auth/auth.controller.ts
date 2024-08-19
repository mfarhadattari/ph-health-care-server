import httpStatus from 'http-status';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

/* -------------->> Login User <<------------ */
const loginUser = catchAsync(async (req, res) => {
  const { refreshToken, ...result } = await AuthServices.loginUser(req.body);

  res.cookie(`${config.app_name}-token`, refreshToken, {
    httpOnly: true,
    secure: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    data: result,
  });
});

/* -------------->> Refresh Token <<------------ */
const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies[`${config.app_name}-token`];
  const result = await AuthServices.refreshToken(token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Token refreshed',
    data: result,
  });
});

/* -------------->> Change Password <<------------ */
const changePassword = catchAsync(async (req, res) => {
  const result = await AuthServices.changePassword(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password changed successfully',
    data: result,
  });
});

/* -------------->> Forget Password <<------------ */
const forgetPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.forgetPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Please check your email',
    data: result,
  });
});

/* -------------->> Forget Password <<------------ */
const resetPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.resetPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password reset successfully',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};

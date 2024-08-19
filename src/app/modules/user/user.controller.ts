import httpStatus from 'http-status';
import { IFile } from '../../interface/file';
import catchAsync from '../../utils/catchAsync';
import getPaginationOptions from '../../utils/getPaginationOption';
import peakObject from '../../utils/peakObject';
import sendResponse from '../../utils/sendResponse';
import { userFilterableFields } from './user.const';
import { UserServices } from './user.service';

/* ---------------->> Create Admin Controller <<-------------------- */
const createAdmin = catchAsync(async (req, res) => {
  const result = await UserServices.createAdmin(
    req.body,
    req.file as IFile | null,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Admin created successfully',
    data: result,
  });
});

/* ---------------->> Create Doctor Controller <<-------------------- */
const createDoctor = catchAsync(async (req, res) => {
  const result = await UserServices.createDoctor(req.body, req.file as IFile);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Doctor created successfully',
    data: result,
  });
});

/* ---------------->> Create Patient Controller <<-------------------- */
const createPatient = catchAsync(async (req, res) => {
  const result = await UserServices.createPatient(req.body, req.file as IFile);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Patient created successfully',
    data: result,
  });
});

/* ---------------->> Get, Search & Filter User Controller <<-------------------- */
const getAllUser = catchAsync(async (req, res) => {
  const filterQuery = peakObject(req.query, userFilterableFields);
  const option = getPaginationOptions(req.query);
  const result = await UserServices.getAllUser(filterQuery, option);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User data fetched',
    data: result.data,
    meta: result.meta,
  });
});

/* ---------------->> User Status Update Controller <<-------------------- */
const updateStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  await UserServices.updateStatus(id, req.body.status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User status updated',
  });
});

/* ---------------->> Get Profile Controller <<-------------------- */
const getProfile = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await UserServices.getProfile(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User profile fetched',
    data: result,
  });
});

/* ---------------->> Update Profile Controller <<-------------------- */
const updateProfile = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await UserServices.updateProfile(
    user,
    req.body,
    req.file as IFile,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User profile updated',
    data: result,
  });
});

export const UserControllers = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUser,
  updateStatus,
  getProfile,
  updateProfile,
};

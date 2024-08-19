/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import getPaginationOptions from '../../utils/getPaginationOption';
import peakObject from '../../utils/peakObject';
import sendResponse from '../../utils/sendResponse';
import { appointmentFilterableFields } from './appointment.const';
import { AppointmentServices } from './appointment.service';

/* ------------------->> Get All Appointment Controller <<----------------- */
const getAppointments = catchAsync(async (req, res) => {
  const filterQuery = peakObject(req.query, appointmentFilterableFields);
  const options = getPaginationOptions(req.query);
  const result = await AppointmentServices.getAppointments(
    filterQuery as any,
    options,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Appointment retrieve successfully',
    meta: result.meta,
    data: result.data,
  });
});

/* ------------------->> Create Appointment Controller <<----------------- */
const createAppointment = catchAsync(async (req, res) => {
  const result = await AppointmentServices.createAppointment(
    req.user,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Appointment created successfully',
    data: result,
  });
});

/* ------------------->> Get My Appointment Controller <<----------------- */
const getMyAppointments = catchAsync(async (req, res) => {
  const filterQuery = peakObject(req.query, appointmentFilterableFields);
  const options = getPaginationOptions(req.query);
  const result = await AppointmentServices.getMyAppointments(
    req.user,
    filterQuery as any,
    options,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Appointment retrieve successfully',
    meta: result.meta,
    data: result.data,
  });
});

/* ------------------->> Update Appointment Controller <<----------------- */
const updateAppointmentStatus = catchAsync(async (req, res) => {
  const result = await AppointmentServices.updateAppointmentStatus(
    req.user,
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Appointment updated successfully',
    data: result,
  });
});

export const AppointmentControllers = {
  createAppointment,
  getAppointments,
  getMyAppointments,
  updateAppointmentStatus,
};

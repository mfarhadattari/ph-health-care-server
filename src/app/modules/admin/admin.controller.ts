import httpStatus from 'http-status';
import { IFile } from '../../interface/file';
import catchAsync from '../../utils/catchAsync';
import getPaginationOptions from '../../utils/getPaginationOption';
import peakObject from '../../utils/peakObject';
import sendResponse from '../../utils/sendResponse';
import { adminFilterableFields } from './admin.const';
import { AdminServices } from './admin.service';

/* --------------> Get, Search, Filter Admins <---------- */
const getAdmins = catchAsync(async (req, res) => {
  const filterQuery = peakObject(req.query, adminFilterableFields);
  const options = getPaginationOptions(req.query);
  const result = await AdminServices.getAdmins(filterQuery, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Admins retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

/* --------------> Get Admin Details <---------- */
const getAdminDetails = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.getAdminDetails(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Admin retrieved successfully',
    data: result,
  });
});

/* --------------> Update Admin Details <---------- */
const updateAdminDetails = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.updateAdminDetails(
    id,
    req.body,
    req.file as IFile,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Admin updated successfully',
    data: result,
  });
});

/* --------------> Delete Admin  <---------- */
const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.deleteAdmin(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Admin deleted successfully',
    data: result,
  });
});

export const AdminControllers = {
  getAdmins,
  getAdminDetails,
  updateAdminDetails,
  deleteAdmin,
};

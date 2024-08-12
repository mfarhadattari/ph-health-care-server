import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminServices } from "./admin.service";

/* --------------> Get, Search, Filter Admins <---------- */
const getAdmins = catchAsync(async (req, res) => {
  const result = await AdminServices.getAdmins();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Admins retrieved successfully",
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
    message: "Admin retrieved successfully",
    data: result,
  });
});

/* --------------> Update Admin Details <---------- */
const updateAdminDetails = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.updateAdminDetails(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Admin updated successfully",
    data: result,
  });
});

/* --------------> Delete Admin  <---------- */
const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.deleteAdmin(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Admin deleted successfully",
    data: result,
  });
});

export const AdminControllers = {
  getAdmins,
  getAdminDetails,
  updateAdminDetails,
  deleteAdmin,
};

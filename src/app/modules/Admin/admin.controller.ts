import { NextFunction, Request, Response } from "express";
import peekFields from "../../utils/peekFields";
import sendResponse from "../../utils/sendResponse";
import { adminFilterableFields } from "./admin.const";
import { AdminServices } from "./admin.service";

const getAdmins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query;
    const filters = peekFields(query, adminFilterableFields);
    const options = peekFields(req.query, [
      "limit",
      "page",
      "sortBy",
      "sortOrder",
    ]);

    const result = await AdminServices.getAdmins(filters, options);

    sendResponse(res, {
      message: "Admin retrieve successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

const getAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const result = await AdminServices.getAdminById(id);

    sendResponse(res, {
      message: "Admin retrieve successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const result = await AdminServices.updateAdminById(id, data);

    sendResponse(res, {
      message: "Admin updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await AdminServices.deleteAdminById(id);

    sendResponse(res, {
      message: "Admin Deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminControllers = {
  getAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
};

import { Request, Response } from "express";
import peekFields from "../../utils/peekFields";
import { adminFilterableFields } from "./admin.const";
import { AdminServices } from "./admin.service";

const getAdmins = async (req: Request, res: Response) => {
  const query = req.query;
  const filters = peekFields(query, adminFilterableFields);
  const options = peekFields(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);

  const result = await AdminServices.getAdmins(filters, options);

  res.status(200).json({
    success: true,
    message: "Admin retrieve successfully",
    meta: result.meta,
    data: result.data,
  });
};

export const AdminControllers = { getAdmins };

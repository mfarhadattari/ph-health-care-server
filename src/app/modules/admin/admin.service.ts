import { UserStatus } from "@prisma/client";
import dbClient from "../../../prisma";
import peakObject from "../../utils/peakObject";
import { adminUpdateAbleFields } from "./admin.const";
import { IUpdate } from "./admin.interface";

/* --------------> Get, Search, Filter Admins <---------- */
const getAdmins = async () => {
  const result = await dbClient.admin.findMany();
  return { data: result, meta: null };
};

/* --------------> Get Admin Details Admin <---------- */
const getAdminDetails = async (id: string) => {
  const result = await dbClient.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};

/* --------------> Update Admin Detail <---------- */
const updateAdminDetails = async (id: string, payload: IUpdate) => {
  const updateData = peakObject(payload as any, adminUpdateAbleFields);
  const result = await dbClient.admin.update({
    where: {
      id,
      isDeleted: false,
    },
    data: updateData,
  });

  return result;
};

/* --------------> Delete Admin <---------- */
const deleteAdmin = async (id: string) => {
  const admin = await dbClient.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await dbClient.$transaction(async (txClient) => {
    await txClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await txClient.user.update({
      where: {
        email: admin.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
  });

  return result;
};

export const AdminServices = {
  getAdmins,
  getAdminDetails,
  updateAdminDetails,
  deleteAdmin,
};

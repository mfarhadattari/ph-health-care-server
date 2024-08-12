import { UserRole } from "@prisma/client";
import dbClient from "../../../prisma";
import { hashPassword } from "../../utils/bcryptHelper";
import { ICreateAdmin } from "./user.interface";

const createAdmin = async (payload: ICreateAdmin) => {
  const admin = payload.admin;
  const password = await hashPassword(payload.password);
  const user = {
    email: admin.email,
    password: password,
    role: UserRole.ADMIN,
  };

  const result = await dbClient.$transaction(async (txClient) => {
    await txClient.user.create({ data: user });

    const adminCreate = await txClient.admin.create({
      data: admin,
    });

    return adminCreate;
  });

  return result;
};

export const UserServices = { createAdmin };

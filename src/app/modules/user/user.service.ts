import { UserRole } from "@prisma/client";
import dbClient from "../../../prisma";
import { IFile } from "../../interface/file";
import { hashPassword } from "../../utils/bcryptHelper";
import { uploadToCloud } from "../../utils/fileUpload";
import { ICreateAdmin } from "./user.interface";

const createAdmin = async (payload: ICreateAdmin, file: IFile | null) => {
  const admin = payload.admin;
  const password = await hashPassword(payload.password);
  const user = {
    email: admin.email,
    password: password,
    role: UserRole.ADMIN,
  };

  if (file) {
    // upload the file
    const { secure_url } = await uploadToCloud(file, `avatar-${admin.email}`);
    admin.profilePhoto = secure_url;
  }

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

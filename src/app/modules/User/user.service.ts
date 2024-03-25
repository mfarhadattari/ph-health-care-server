import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const createAdmin = async (payload: any) => {
  const password = await bcrypt.hash(payload.password, 12);
  const userData: any = {
    email: payload.admin.email,
    password: password,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: userData,
    });

    const createAdmin = await tnx.admin.create({
      data: payload.admin,
    });

    return createAdmin;
  });
  return result;
};

export const UserServices = { createAdmin };

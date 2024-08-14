import {
  Admin,
  Doctor,
  Patient,
  Prisma,
  UserRole,
  UserStatus,
} from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import dbClient from "../../../prisma";
import AppError from "../../error/AppError";
import { IFile } from "../../interface/file";
import { hashPassword } from "../../utils/bcryptHelper";
import { uploadToCloud } from "../../utils/fileUpload";
import { IPaginationOptions } from "../../utils/getPaginationOption";
import {
  generateFilterCondition,
  generateSearchCondition,
} from "../../utils/queryHelper";
import { userSearchableFields } from "./user.const";
import { ICreateAdmin, ICreateDoctor, ICreatePatient } from "./user.interface";

/* ---------------->> Create Admin Service <<-------------------- */
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

/* ---------------->> Create Doctor Service <<-------------------- */
const createDoctor = async (payload: ICreateDoctor, file: IFile | null) => {
  const doctor = payload.doctor;
  const password = await hashPassword(payload.password);
  const user = {
    email: doctor.email,
    password: password,
    role: UserRole.DOCTOR,
  };

  if (file) {
    // upload the file
    const { secure_url } = await uploadToCloud(file, `avatar-${doctor.email}`);
    doctor.profilePhoto = secure_url;
  }

  const result = await dbClient.$transaction(async (txClient) => {
    await txClient.user.create({ data: user });

    const doctorCreate = await txClient.doctor.create({
      data: doctor,
    });

    return doctorCreate;
  });

  return result;
};

/* ---------------->> Create Patient Service <<-------------------- */
const createPatient = async (payload: ICreatePatient, file: IFile | null) => {
  const patient = payload.patient;
  const password = await hashPassword(payload.password);
  const user = {
    email: patient.email,
    password: password,
    role: UserRole.PATIENT,
  };

  if (file) {
    // upload the file
    const { secure_url } = await uploadToCloud(file, `avatar-${patient.email}`);
    patient.profilePhoto = secure_url;
  }

  const result = await dbClient.$transaction(async (txClient) => {
    await txClient.user.create({ data: user });

    const patientCreate = await txClient.patient.create({
      data: patient,
    });

    return patientCreate;
  });

  return result;
};

/* ---------------->> Get, Search & Filter User Service <<-------------------- */
const getAllUser = async (query: any, option: IPaginationOptions) => {
  const { searchTerm, ...filterQuery } = query;

  const andCondition: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: generateSearchCondition(searchTerm, userSearchableFields),
    });
  }

  if (filterQuery) {
    andCondition.push({
      AND: generateFilterCondition(filterQuery),
    });
  }

  const whereCondition: Prisma.UserWhereInput = {
    AND: andCondition,
  };

  // generate data
  const result = await dbClient.user.findMany({
    where: whereCondition,
    skip: option.skip,
    take: option.limit,
    orderBy: {
      [option.sortBy]: option.sortOrder,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      doctor: true,
      patient: true,
    },
  });

  // count total
  const total = await dbClient.user.count({
    where: whereCondition,
  });

  return {
    data: result,
    meta: {
      limit: option.limit,
      page: option.page,
      total,
    },
  };
};

/* ---------------->> User Status Update Service <<-------------------- */
const updateStatus = async (id: string, status: UserStatus) => {
  await dbClient.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await dbClient.user.update({
    where: {
      id,
    },
    data: { status },
  });
};

/* ---------------->> Get Profile Service <<-------------------- */
const getProfile = async (user: JwtPayload) => {
  let result;
  if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
    result = await dbClient.admin.findUnique({
      where: {
        email: user.email,
      },
    });
  } else if (user.role === UserRole.DOCTOR) {
    result = await dbClient.doctor.findUnique({
      where: {
        email: user.email,
      },
    });
  } else if (user.role === UserRole.PATIENT) {
    result = await dbClient.patient.findUnique({
      where: {
        email: user.email,
      },
    });
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Bad request");
  }

  return result;
};

/* ---------------->> Update Profile Service <<-------------------- */
const updateProfile = async (
  user: JwtPayload,
  payload: Admin | Doctor | Patient,
  file: IFile | null
) => {
  if (file) {
    const { secure_url } = await uploadToCloud(file, `avatar-${user.email}`);
    payload.profilePhoto = secure_url;
  }
  let result;
  if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
    result = await dbClient.admin.update({
      where: {
        email: user.email,
      },
      data: payload,
    });
  } else if (user.role === UserRole.DOCTOR) {
    result = await dbClient.doctor.update({
      where: {
        email: user.email,
      },
      data: payload,
    });
  } else if (user.role === UserRole.PATIENT) {
    result = await dbClient.patient.update({
      where: {
        email: user.email,
      },
      data: payload,
    });
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Bad request");
  }

  return result;
};

export const UserServices = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUser,
  updateStatus,
  getProfile,
  updateProfile,
};

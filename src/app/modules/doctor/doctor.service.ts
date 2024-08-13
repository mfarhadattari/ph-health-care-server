import { Prisma, UserStatus } from "@prisma/client";
import dbClient from "../../../prisma";
import { IFile } from "../../interface/file";
import { uploadToCloud } from "../../utils/fileUpload";
import { IPaginationOptions } from "../../utils/getPaginationOption";
import peakObject from "../../utils/peakObject";
import {
  generateFilterCondition,
  generateSearchCondition,
} from "../../utils/queryHelper";
import { doctorSearchableFields, doctorUpdateAbleFields } from "./doctor.const";

/* ---------------->> Get, Search & Filter Doctor Service <<------------- */
const getDoctor = async (query: any, options: IPaginationOptions) => {
  const { searchTerm, ...filterQuery } = query;
  const { limit, page, skip, sortBy, sortOrder } = options;
  const andCondition: Prisma.DoctorWhereInput[] = [
    {
      isDeleted: false,
    },
  ];

  // searching
  if (searchTerm) {
    const searchCondition = generateSearchCondition(
      searchTerm,
      doctorSearchableFields
    );
    andCondition.push({
      OR: searchCondition,
    });
  }

  // filtering
  if (filterQuery && Object.keys(filterQuery).length > 0) {
    const filterCondition = generateFilterCondition(filterQuery);
    andCondition.push({
      AND: filterCondition,
    });
  }

  // out data from db
  const result = await dbClient.doctor.findMany({
    where: {
      AND: andCondition,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip: skip,
    take: limit,
  });

  // count total
  const total = await dbClient.doctor.count({
    where: {
      AND: andCondition,
    },
  });

  return {
    data: result,
    meta: {
      page,
      limit,
      total: total,
    },
  };
};

/* ------------------>> Get Doctor Details Service <<--------------- */
const getDoctorDetails = async (id: string) => {
  const result = await dbClient.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};

/* ------------------>> Update Doctor Details Service <<--------------- */
const updateDoctorDetails = async (
  id: string,
  payload: any,
  file: IFile | null
) => {
  const updateData = peakObject(payload, doctorUpdateAbleFields);

  const doctor = await dbClient.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (file) {
    const { secure_url } = await uploadToCloud(file, `avatar-${doctor.email}`);
    updateData.profilePhoto = secure_url;
  }

  const result = await dbClient.doctor.update({
    where: {
      id,
    },
    data: updateData,
  });

  return result;
};

/* ------------------>> Delete Doctor Service <<--------------- */
const deleteDoctor = async (id: string) => {
  const doctor = await dbClient.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await dbClient.$transaction(async (txClient) => {
    await txClient.doctor.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await txClient.user.update({
      where: {
        email: doctor.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
  });

  return result;
};

export const DoctorServices = {
  getDoctor,
  getDoctorDetails,
  updateDoctorDetails,
  deleteDoctor,
};

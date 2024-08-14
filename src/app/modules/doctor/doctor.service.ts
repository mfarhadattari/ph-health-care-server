import { Doctor, Prisma, UserStatus } from "@prisma/client";
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
  const { searchTerm, specialties, ...filterQuery } = query;
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

  // filter by specialties
  if (specialties) {
    andCondition.push({
      doctorSpecialty: {
        some: {
          specialty: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
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
    include: {
      doctorSpecialty: {
        include: {
          specialty: true,
        },
      },
    },
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
    include: {
      doctorSpecialty: {
        include: {
          specialty: true,
        },
      },
    },
  });

  return result;
};

/* ------------------>> Update Doctor Details Service <<--------------- */
const updateDoctorDetails = async (
  id: string,
  payload: Doctor & { specialties: { id: string; isDeleted: boolean }[] },
  file: IFile | null
) => {
  const doctor = await dbClient.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const { specialties, ...doctorData } = payload;
  const updateData = peakObject(doctorData as any, doctorUpdateAbleFields);

  if (file) {
    const { secure_url } = await uploadToCloud(file, `avatar-${doctor.email}`);
    updateData.profilePhoto = secure_url;
  }

  await dbClient.$transaction(async (txClient) => {
    if (updateData && Object.keys(updateData).length > 0) {
      // update doctor data
      await dbClient.doctor.update({
        where: {
          id,
        },
        data: updateData,
      });
    }

    // update specialties data
    if (specialties) {
      //delete specialties
      const deleteSpecialtyIds = specialties
        .filter((specialty) => specialty.isDeleted)
        .map((specialty) => specialty.id);

      if (deleteSpecialtyIds && deleteSpecialtyIds.length > 0) {
        await dbClient.doctorSpecialty.deleteMany({
          where: {
            doctorId: id,
            specialtiesId: {
              in: deleteSpecialtyIds,
            },
          },
        });
      }

      // add specialties
      const addSpecialties = specialties
        .filter((specialty) => !specialty.isDeleted)
        .map((specialty) => ({
          doctorId: doctor.id,
          specialtiesId: specialty.id,
        }));

      if (addSpecialties && addSpecialties.length > 0) {
        await dbClient.doctorSpecialty.createMany({
          data: addSpecialties,
        });
      }
    }
  });

  const result = await dbClient.doctor.findUnique({
    where: {
      id,
    },
    include: {
      doctorSpecialty: {
        include: {
          specialty: true,
        },
      },
    },
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
  await dbClient.$transaction(async (txClient) => {
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
};

export const DoctorServices = {
  getDoctor,
  getDoctorDetails,
  updateDoctorDetails,
  deleteDoctor,
};

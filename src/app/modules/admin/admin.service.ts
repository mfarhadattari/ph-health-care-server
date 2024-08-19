/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, UserStatus } from '@prisma/client';
import dbClient from '../../../prisma';
import { IFile } from '../../interface/file';
import { uploadToCloud } from '../../utils/fileUpload';
import { IPaginationOptions } from '../../utils/getPaginationOption';
import peakObject from '../../utils/peakObject';
import {
  generateFilterCondition,
  generateSearchCondition,
} from '../../utils/queryHelper';
import { adminSearchableFields, adminUpdateAbleFields } from './admin.const';
import { IAdminUpdate } from './admin.interface';

/* --------------> Get, Search, Filter Admins <---------- */
const getAdmins = async (query: any, options: IPaginationOptions) => {
  const { searchTerm, ...filterQuery } = query;
  const { limit, page, skip, sortBy, sortOrder } = options;
  const andCondition: Prisma.AdminWhereInput[] = [
    {
      isDeleted: false,
    },
  ];

  // searching
  if (searchTerm) {
    const searchCondition = generateSearchCondition(
      searchTerm,
      adminSearchableFields,
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
  const result = await dbClient.admin.findMany({
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
  const total = await dbClient.admin.count({
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
const updateAdminDetails = async (
  id: string,
  payload: IAdminUpdate,
  file: IFile | null,
) => {
  const updateData = peakObject(payload as any, adminUpdateAbleFields);
  const admin = await dbClient.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (file) {
    const { secure_url } = await uploadToCloud(file, `avatar-${admin.email}`);
    updateData.profilePhoto = secure_url;
  }

  const result = await dbClient.admin.update({
    where: {
      id,
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

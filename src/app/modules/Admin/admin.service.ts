import { Prisma, UserStatus } from "@prisma/client";
import { prisma } from "../../../app";
import calculatePaginationAndOrder from "../../utils/calculatePaginationAndOrder";
import { adminSearchAbleFields } from "./admin.const";

const getAdmins = async (query: any, options: any) => {
  const { page, limit, skip, sortOrder, sortBy } =
    calculatePaginationAndOrder(options);

  const addConditions: Prisma.AdminWhereInput[] = [];

  const { searchTerm, ...filterQuery } = query;

  if (query.searchTerm) {
    addConditions.push({
      OR: adminSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterQuery).length > 0) {
    addConditions.push({
      AND: Object.keys(filterQuery).map((key) => ({
        [key]: {
          equals: (filterQuery as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.AdminWhereInput = { AND: addConditions };

  const adminData = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.admin.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: adminData,
  };
};

const getAdminById = async (id: string) => {
  const result = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return result;
};

const updateAdminById = async (id: string, payload: any) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteAdminById = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (txClient) => {
    const adminDeletedInfo = await txClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await txClient.user.update({
      where: {
        email: adminDeletedInfo.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return adminDeletedInfo;
  });

  return result;
};

export const AdminServices = {
  getAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
};

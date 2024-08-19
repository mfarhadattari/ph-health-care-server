/* eslint-disable @typescript-eslint/no-explicit-any */
import { Patient, PatientHealthData, Prisma, UserStatus } from '@prisma/client';
import dbClient from '../../../prisma';
import { IFile } from '../../interface/file';
import { uploadToCloud } from '../../utils/fileUpload';
import { IPaginationOptions } from '../../utils/getPaginationOption';
import peakObject from '../../utils/peakObject';
import {
  generateFilterCondition,
  generateSearchCondition,
} from '../../utils/queryHelper';
import {
  patientSearchableFields,
  patientUpdateAbleFields,
} from './patient.const';

/* ---------------->> Get, Search & Filter Patient Service <<------------- */
const getPatients = async (query: any, options: IPaginationOptions) => {
  const { searchTerm, ...filterQuery } = query;
  const { limit, page, skip, sortBy, sortOrder } = options;
  const andCondition: Prisma.PatientWhereInput[] = [
    {
      isDeleted: false,
    },
  ];

  // searching
  if (searchTerm) {
    const searchCondition = generateSearchCondition(
      searchTerm,
      patientSearchableFields,
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
  const result = await dbClient.patient.findMany({
    where: {
      AND: andCondition,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip: skip,
    take: limit,
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });

  // count total
  const total = await dbClient.patient.count({
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

/* ------------------>> Get Patient Details Service <<--------------- */
const getPatientDetails = async (id: string) => {
  const result = await dbClient.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });

  return result;
};

/* ------------------>> Update Patient Details Service <<--------------- */
const updatePatientDetails = async (
  id: string,
  payload: Patient,
  file: IFile | null,
) => {
  const updateData = peakObject(payload as any, patientUpdateAbleFields);

  const patient = await dbClient.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (file) {
    const { secure_url } = await uploadToCloud(file, `avatar-${patient.email}`);
    updateData.profilePhoto = secure_url;
  }

  const result = await dbClient.patient.update({
    where: {
      id,
    },
    data: updateData,
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });

  return result;
};

/* ------------------>> Delete Patient Service <<--------------- */
const deletePatient = async (id: string) => {
  const patient = await dbClient.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  await dbClient.$transaction(async (txClient) => {
    await txClient.patient.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await txClient.user.update({
      where: {
        email: patient.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
  });
};

/* ----------------->> Update Patient Health Data <<---------------- */
const updatePatientHealthData = async (
  id: string,
  payload: PatientHealthData,
) => {
  const patient = await dbClient.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  payload.patientId = patient.id;

  await dbClient.patientHealthData.upsert({
    where: {
      patientId: patient.id,
    },
    create: payload,
    update: payload,
  });

  const result = await dbClient.patient.findUnique({
    where: {
      id,
    },
    include: {
      patientHealthData: true,
    },
  });

  return result;
};

export const PatientServices = {
  getPatients,
  getPatientDetails,
  updatePatientDetails,
  deletePatient,
  updatePatientHealthData,
};

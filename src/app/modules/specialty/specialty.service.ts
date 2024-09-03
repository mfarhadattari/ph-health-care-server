import { Specialty } from '@prisma/client';
import httpStatus from 'http-status';
import dbClient from '../../../prisma';
import AppError from '../../error/AppError';
import { IFile } from '../../interface/file';
import { uploadToCloud } from '../../utils/fileUpload';

/* ------------------->> Create Specialty Service <<----------------- */
const createSpecialty = async (payload: Specialty, file: IFile | null) => {
  if (!file) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Specialty icon is not found');
  }

  const { secure_url } = await uploadToCloud(
    file,
    `specialty-icon-${payload.title}`,
  );
  payload.icon = secure_url;

  const result = await dbClient.specialty.create({
    data: payload,
  });

  return result;
};

/* ------------------->> Get Specialty Service <<----------------- */
const getSpecialty = async () => {
  const result = await dbClient.specialty.findMany();
  return result;
};

/* ------------------->> Update Specialty Service <<----------------- */
const updateSpecialty = async (
  id: string,
  payload: Specialty,
  file: IFile | null,
) => {
  // check specialty exist
  const specialty = await dbClient.specialty.findUniqueOrThrow({
    where: {
      id,
    },
  });

  // if there any icon file then upload that
  if (file) {
    const { secure_url } = await uploadToCloud(
      file,
      `specialty-icon-${specialty.title}`,
    );
    payload.icon = secure_url;
  }

  // update specialty in database
  const result = await dbClient.specialty.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

/* ------------------->> Delete Specialty Service <<----------------- */
const deleteSpecialty = async (id: string) => {
  // check specialty exist
  await dbClient.specialty.findUniqueOrThrow({
    where: {
      id,
    },
  });

  // update specialty in database
  await dbClient.specialty.delete({
    where: {
      id,
    },
  });

  return null;
};

export const SpecialtyServices = {
  createSpecialty,
  getSpecialty,
  updateSpecialty,
  deleteSpecialty,
};

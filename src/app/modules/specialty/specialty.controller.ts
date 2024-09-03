import httpStatus from 'http-status';
import { IFile } from '../../interface/file';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SpecialtyServices } from './specialty.service';

/* ------------------->> Create Specialty Controller <<----------------- */
const createSpecialty = catchAsync(async (req, res) => {
  const result = await SpecialtyServices.createSpecialty(
    req.body,
    req.file as IFile,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Specialty created successfully',
    data: result,
  });
});

/* ------------------->> Get Specialty Controller <<----------------- */
const getSpecialty = catchAsync(async (req, res) => {
  const result = await SpecialtyServices.getSpecialty();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Specialties data fetched',
    data: result,
  });
});

/* ------------------->> Update Specialty Controller <<----------------- */
const updateSpecialty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SpecialtyServices.updateSpecialty(
    id,
    req.body,
    req.file as IFile,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Specialty updated successfully',
    data: result,
  });
});

/* ------------------->> Delete Specialty Controller <<----------------- */
const deleteSpecialty = catchAsync(async (req, res) => {
  const { id } = req.params;
  await SpecialtyServices.deleteSpecialty(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Specialty deleted successfully',
  });
});

export const SpecialtyControllers = {
  createSpecialty,
  getSpecialty,
  updateSpecialty,
  deleteSpecialty,
};

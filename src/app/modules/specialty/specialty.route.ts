import { UserRole } from '@prisma/client';
import express from 'express';
import authValidator from '../../middlewares/authValidator';
import bodyParser from '../../middlewares/bodyParser';
import reqValidator from '../../middlewares/reqValidator';
import { upload } from '../../utils/fileUpload';
import { SpecialtyControllers } from './specialty.controller';
import { SpecialtyValidationSchema } from './specialty.validation';

const router = express.Router();

/* ----------------->> Create Specialty Route <<----------- */
router.post(
  '/',
  authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  upload.single('file'),
  bodyParser,
  reqValidator(SpecialtyValidationSchema.createSpecialty),
  SpecialtyControllers.createSpecialty,
);

/* ----------------->> Get Specialties Route <<----------- */
router.get('/', SpecialtyControllers.getSpecialty);

/* ----------------->> Update Specialty Route <<----------- */
router.patch(
  '/:id',
  authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  upload.single('file'),
  bodyParser,
  reqValidator(SpecialtyValidationSchema.updateSpecialty),
  SpecialtyControllers.updateSpecialty,
);

export const SpecialtyRoutes = router;

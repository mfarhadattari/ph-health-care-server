import { UserRole } from '@prisma/client';
import express from 'express';
import authValidator from '../../middlewares/authValidator';
import bodyParser from '../../middlewares/bodyParser';
import reqValidator from '../../middlewares/reqValidator';
import { upload } from '../../utils/fileUpload';
import { DoctorControllers } from './doctor.controller';
import { DoctorValidationSchema } from './doctor.validation';

const router = express.Router();

/* ---------------->> Get, Search & Filter Doctor Route <<------------- */
router.get('/', DoctorControllers.getDoctor);

/* ------------------>> Get Doctor Details Route <<--------------- */
router.get('/:id', DoctorControllers.getDoctorDetails);

/* ------------------>> Update Doctor Details Route <<--------------- */
router.patch(
  '/:id',
  authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  upload.single('file'),
  bodyParser,
  reqValidator(DoctorValidationSchema.updateDoctor),
  DoctorControllers.updateDoctorDetails,
);

/* ------------------>> Delete Doctor Route <<--------------- */
router.delete(
  '/:id',
  authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorControllers.deleteDoctor,
);

/* ----------------->> Create Doctor Schedule Route <<----------- */
router.post(
  '/schedule',
  authValidator(UserRole.DOCTOR),
  reqValidator(DoctorValidationSchema.createDoctorSchedule),
  DoctorControllers.createDoctorSchedule,
);

/* ----------------->> Get Doctor Schedule Route <<----------- */
router.get('/:id/schedule', DoctorControllers.getDoctorSchedule);

/* ----------------->> Delete  Doctor Schedule Route <<----------- */
router.delete(
  '/schedule/:id',
  authValidator(UserRole.DOCTOR),
  DoctorControllers.deleteDoctorSchedule,
);

export const DoctorRoutes = router;

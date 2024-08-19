import { UserRole } from '@prisma/client';
import express from 'express';
import authValidator from '../../middlewares/authValidator';
import bodyParser from '../../middlewares/bodyParser';
import reqValidator from '../../middlewares/reqValidator';
import { upload } from '../../utils/fileUpload';
import { PatientControllers } from './patient.controller';
import { PatientValidationSchema } from './patient.validation';

const router = express.Router();

/* ---------------->> Get, Search & Filter Patient Route <<------------- */
router.get(
  '/',
  authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  PatientControllers.getPatients,
);

/* ------------------>> Get Patient Details Route <<--------------- */
router.get(
  '/:id',
  authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  PatientControllers.getPatientDetails,
);

/* ------------------>> Update Patient Details Route <<--------------- */
router.patch(
  '/:id',
  authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  upload.single('file'),
  bodyParser,
  reqValidator(PatientValidationSchema.updatePatient),
  PatientControllers.updatePatientDetails,
);

/* ------------------>> Delete Patient Route <<--------------- */

router.delete(
  '/:id',
  authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PatientControllers.deletePatient,
);

/* ------------------>> Update Patient Health Data Route <<--------------- */
router.put(
  '/:id/health-data',
  authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  reqValidator(PatientValidationSchema.updatePatientHealthData),
  PatientControllers.updatePatientHealthData,
);

export const PatientRoutes = router;

import { UserRole } from '@prisma/client';
import express from 'express';
import authValidator from '../../middlewares/authValidator';
import bodyParser from '../../middlewares/bodyParser';
import reqValidator from '../../middlewares/reqValidator';
import { upload } from '../../utils/fileUpload';
import { UserControllers } from './user.controller';
import { UserValidationSchema } from './user.validation';

const router = express.Router();

// get search and filter users
router.get(
  '/',
  authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserControllers.getAllUser,
);

// get user profile
router.get(
  '/profile',
  authValidator(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT,
  ),
  UserControllers.getProfile,
);

// update user profile
router.patch(
  '/update-profile',
  authValidator(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT,
  ),
  upload.single('file'),
  bodyParser,
  reqValidator(UserValidationSchema.updateUser),
  UserControllers.updateProfile,
);

// update user status
router.patch(
  '/:id/status',
  authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  reqValidator(UserValidationSchema.updateStatus),
  UserControllers.updateStatus,
);

// create admin route
router.post(
  '/create-admin',
  authValidator(UserRole.SUPER_ADMIN),
  upload.single('file'),
  bodyParser,
  reqValidator(UserValidationSchema.createAdmin),
  UserControllers.createAdmin,
);

// create doctor route
router.post(
  '/create-doctor',
  authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  upload.single('file'),
  bodyParser,
  reqValidator(UserValidationSchema.createDoctor),
  UserControllers.createDoctor,
);

// create patient route
router.post(
  '/create-user',
  upload.single('file'),
  bodyParser,
  reqValidator(UserValidationSchema.createPatient),
  UserControllers.createPatient,
);

export const UserRoutes = router;

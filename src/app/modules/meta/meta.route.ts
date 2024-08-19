import { UserRole } from '@prisma/client';
import express from 'express';
import authValidator from '../../middlewares/authValidator';
import { MetaControllers } from './meta.controller';

const router = express.Router();

router.get(
  '/',
  authValidator(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT,
  ),
  MetaControllers.getMetaData,
);

export const MetaRoutes = router;

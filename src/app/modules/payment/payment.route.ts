import { UserRole } from '@prisma/client';
import express from 'express';
import authValidator from '../../middlewares/authValidator';
import { PaymentControllers } from './payment.controller';

const route = express.Router();

/* --------------->> Init Payment <<------------- */
route.post(
  '/init/:id',
  authValidator(UserRole.PATIENT),
  PaymentControllers.initPayment,
);

/* --------------->> Valid Payment <<------------- */
route.get('/ipn', PaymentControllers.validatePayment);

export const PaymentRoutes = route;

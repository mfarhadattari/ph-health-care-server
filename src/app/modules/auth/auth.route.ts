import express from 'express';
import authValidator from '../../middlewares/authValidator';
import reqValidator from '../../middlewares/reqValidator';
import { AuthControllers } from './auth.controller';
import { AuthValidationSchema } from './auth.validation';

const router = express.Router();

// login route
router.post(
  '/login',
  reqValidator(AuthValidationSchema.loginUser),
  AuthControllers.loginUser,
);

// refresh token route
router.get('/refresh-token', AuthControllers.refreshToken);

// change password route
router.patch(
  '/change-password',
  authValidator('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'PATIENT'),
  reqValidator(AuthValidationSchema.changePassword),
  AuthControllers.changePassword,
);

// forget password route
router.post('/forget-password', AuthControllers.forgetPassword);

// reset password route
router.patch('/reset-password', AuthControllers.resetPassword);

export const AuthRoutes = router;

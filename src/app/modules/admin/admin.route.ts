import { UserRole } from '@prisma/client';
import express from 'express';
import authValidator from '../../middlewares/authValidator';
import bodyParser from '../../middlewares/bodyParser';
import reqValidator from '../../middlewares/reqValidator';
import { upload } from '../../utils/fileUpload';
import { AdminControllers } from './admin.controller';
import { AdminValidationSchema } from './admin.validation';

const router = express.Router();

// get admin route
router.get(
  '/',
  authValidator(UserRole.SUPER_ADMIN),
  AdminControllers.getAdmins,
);

// get admin details
router.get(
  '/:id',
  authValidator(UserRole.SUPER_ADMIN),
  AdminControllers.getAdminDetails,
);

// update admin details
router.patch(
  '/:id',
  authValidator(UserRole.SUPER_ADMIN),
  upload.single('file'),
  bodyParser,
  reqValidator(AdminValidationSchema.updateAdmin),
  AdminControllers.updateAdminDetails,
);

// delete admin
router.delete(
  '/:id',
  authValidator(UserRole.SUPER_ADMIN),
  AdminControllers.deleteAdmin,
);

export const AdminRoutes = router;

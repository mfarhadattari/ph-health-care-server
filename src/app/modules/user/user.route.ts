import { UserRole } from "@prisma/client";
import express from "express";
import authValidator from "../../middlewares/authValidator";
import bodyParser from "../../middlewares/bodyParser";
import reqValidator from "../../middlewares/reqValidator";
import { upload } from "../../utils/fileUpload";
import { UserControllers } from "./user.controller";
import { UserValidationSchema } from "./user.validation";

const router = express.Router();

// create admin route
router.post(
  "/create-admin",
  authValidator(UserRole.SUPER_ADMIN),
  upload.single("file"),
  bodyParser,
  reqValidator(UserValidationSchema.createAdmin),
  UserControllers.createAdmin
);

// create doctor route
router.post(
  "/create-doctor",
  authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  upload.single("file"),
  bodyParser,
  reqValidator(UserValidationSchema.createDoctor),
  UserControllers.createDoctor
);

// create patient route
router.post(
  "/create-user",
  upload.single("file"),
  bodyParser,
  reqValidator(UserValidationSchema.createPatient),
  UserControllers.createPatient
);

export const UserRoutes = router;

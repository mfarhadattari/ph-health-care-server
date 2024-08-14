import { UserRole } from "@prisma/client";
import express from "express";
import authValidator from "../../middlewares/authValidator";
import reqValidator from "../../middlewares/reqValidator";
import { MedicalReportControllers } from "./medicalReport.controller";
import { MedicalReportValidationSchema } from "./medicalReport.validation";

const router = express.Router();

/* ----------------->> Create Medical Report Route <<----------- */
router.post(
  "/",
  authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  reqValidator(MedicalReportValidationSchema.createMedicalReport),
  MedicalReportControllers.createMedicalReport
);

/* ----------------->> Delete Medical Report Route <<----------- */
router.delete(
  "/:id",
  authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  MedicalReportControllers.deleteMedicalReport
);

export const MedicalReportRoutes = router;

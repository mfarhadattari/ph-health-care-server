import { UserRole } from "@prisma/client";
import express from "express";
import authValidator from "../../middlewares/authValidator";
import { PrescriptionControllers } from "./precription.controller";

const route = express.Router();

/* --------------->> Create Prescription <<------------- */
route.post(
  "/",
  authValidator(UserRole.DOCTOR),
  PrescriptionControllers.createPrescription
);

/* --------------->> Get Prescription <<------------- */
route.get(
  "/my-prescription",
  authValidator(UserRole.DOCTOR, UserRole.PATIENT),
  PrescriptionControllers.getMyPrescription
);

export const PrescriptionRoutes = route;
import { UserRole } from "@prisma/client";
import express from "express";
import authValidator from "../../middlewares/authValidator";
import reqValidator from "../../middlewares/reqValidator";
import { AppointmentControllers } from "./appointment.controller";
import { AppointmentValidationSchema } from "./appointment.validation";

const router = express.Router();

/* ----------------->> Get Appointment Route <<----------- */
router.get(
  "/",
  authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AppointmentControllers.getAppointments
);

/* ----------------->> Create Appointment Route <<----------- */
router.post(
  "/",
  authValidator(UserRole.PATIENT),
  reqValidator(AppointmentValidationSchema.createAppointment),
  AppointmentControllers.createAppointment
);

/* ----------------->> Get My Appointment Route <<----------- */
router.get(
  "/my-appointment",
  authValidator(UserRole.DOCTOR, UserRole.PATIENT),
  AppointmentControllers.getMyAppointments
);

export const AppointmentRoutes = router;

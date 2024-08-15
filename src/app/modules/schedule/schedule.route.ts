import { UserRole } from "@prisma/client";
import express from "express";
import authValidator from "../../middlewares/authValidator";
import reqValidator from "../../middlewares/reqValidator";
import { ScheduleControllers } from "./schedule.controller";
import { ScheduleValidationSchema } from "./schedule.validation";

const router = express.Router();

/* ----------------->> Create Schedule Route <<----------- */
router.post(
  "/",
  authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  reqValidator(ScheduleValidationSchema.createSchedule),
  ScheduleControllers.createSchedule
);

/* ----------------->> Get Schedule Route <<----------- */
router.get(
  "/",
  authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  ScheduleControllers.getSchedule
);

/* ----------------->> Delete Schedule Route <<----------- */
router.delete(
  "/:id",
  authValidator(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ScheduleControllers.deleteSchedule
);

export const ScheduleRoutes = router;

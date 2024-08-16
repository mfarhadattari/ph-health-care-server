import express, { Router } from "express";
import { AdminRoutes } from "../modules/admin/admin.route";
import { AppointmentRoutes } from "../modules/appointment/appointment.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { DoctorRoutes } from "../modules/doctor/doctor.route";
import { MedicalReportRoutes } from "../modules/medicalReport/medicalReport.route";
import { PatientRoutes } from "../modules/patient/patient.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { ScheduleRoutes } from "../modules/schedule/schedule.route";
import { SpecialtyRoutes } from "../modules/specialty/specialty.route";
import { UserRoutes } from "../modules/user/user.route";

const router = express.Router();

const appRoutes: { path: string; router: Router }[] = [
  {
    path: "/user",
    router: UserRoutes,
  },
  {
    path: "/auth",
    router: AuthRoutes,
  },
  {
    path: "/admin",
    router: AdminRoutes,
  },
  {
    path: "/doctor",
    router: DoctorRoutes,
  },
  {
    path: "/patient",
    router: PatientRoutes,
  },
  {
    path: "/specialty",
    router: SpecialtyRoutes,
  },
  {
    path: "/report",
    router: MedicalReportRoutes,
  },
  {
    path: "/schedule",
    router: ScheduleRoutes,
  },
  {
    path: "/appointment",
    router: AppointmentRoutes,
  },
  {
    path: "/payment",
    router: PaymentRoutes,
  },
];

appRoutes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;

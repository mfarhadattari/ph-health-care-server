import express from "express";
import { AdminRoutes } from "../modules/Admin/admin.route";
import { UserRoutes } from "../modules/User/user.route";

const router = express.Router();

const applicationRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
];

applicationRoutes.forEach((route) => router.use(route.path, route.route));

export const AppRoutes = router;

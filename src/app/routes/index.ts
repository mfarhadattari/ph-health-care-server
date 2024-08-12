import express, { Router } from "express";
import { AdminRoutes } from "../modules/admin/admin.route";
import { UserRoutes } from "../modules/user/user.route";

const router = express.Router();

const appRoutes: { path: string; router: Router }[] = [
  {
    path: "/user",
    router: UserRoutes,
  },
  {
    path: "/admin",
    router: AdminRoutes,
  },
];

appRoutes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;

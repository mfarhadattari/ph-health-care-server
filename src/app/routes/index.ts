import express, { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";

const router = express.Router();

const appRoutes: { path: string; router: Router }[] = [
  {
    path: "/user",
    router: UserRoutes,
  },
];

appRoutes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;

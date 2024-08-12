import express from "express";
import { UserControllers } from "./user.controller";

const router = express.Router();

// create user route
router.post("/create-admin", UserControllers.createAdmin);

export const UserRoutes = router;

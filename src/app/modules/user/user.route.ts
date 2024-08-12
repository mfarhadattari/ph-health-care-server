import express from "express";
import reqValidator from "../../middlewares/reqValidator";
import { UserControllers } from "./user.controller";
import { UserValidationSchema } from "./user.validation";

const router = express.Router();

// create user route
router.post(
  "/create-admin",
  reqValidator(UserValidationSchema.createAdmin),
  UserControllers.createAdmin
);

export const UserRoutes = router;

import express from "express";
import reqValidator from "../../middlewares/reqValidator";
import { AuthControllers } from "./auth.controller";
import { AuthValidationSchema } from "./auth.validation";

const router = express.Router();

// login route
router.post(
  "/login",
  reqValidator(AuthValidationSchema.loginUser),
  AuthControllers.loginUser
);

export const AuthRoutes = router;

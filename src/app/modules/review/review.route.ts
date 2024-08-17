import { UserRole } from "@prisma/client";
import express from "express";
import authValidator from "../../middlewares/authValidator";
import reqValidator from "../../middlewares/reqValidator";
import { ReviewControllers } from "./review.controller";
import { ReviewValidationSchema } from "./review.validation";

const route = express.Router();

/* --------------->> Create Review <<------------- */
route.post(
  "/",
  authValidator(UserRole.PATIENT),
  reqValidator(ReviewValidationSchema.createReview),
  ReviewControllers.createReview
);

/* --------------->> Get Review <<------------- */
route.get(
  "/my-reviews",
  authValidator(UserRole.DOCTOR, UserRole.PATIENT),
  ReviewControllers.getMyReview
);

export const ReviewRoutes = route;

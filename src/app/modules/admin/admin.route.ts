import express from "express";
import reqValidator from "../../middlewares/reqValidator";
import { AdminControllers } from "./admin.controller";
import { AdminValidationSchema } from "./admin.validation";

const router = express.Router();

// get admin route
router.get("/", AdminControllers.getAdmins);

// get admin details
router.get("/:id", AdminControllers.getAdminDetails);

// update admin details
router.patch(
  "/:id",
  reqValidator(AdminValidationSchema.updateAdmin),
  AdminControllers.updateAdminDetails
);

// delete admin
router.delete("/:id", AdminControllers.deleteAdmin);

export const AdminRoutes = router;

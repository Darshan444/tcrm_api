// Routes/user/index.js
import express from "express";
import { validate } from "../../Middlewares/validation.js";
import { authenticate, authorize } from "../../Middlewares/auth.js";
import { UserController } from "../../Controllers/user.js";
import {
  loginValidation,
  registerValidation,
  forgotPasswordValidation,
  updateProfileValidation,
  changePasswordValidation,
  listUsersValidation,
  userIdValidation,
  updateUserValidation,
  bulkUpdateValidation,
  statusUpdateValidation,
} from "./userValidations.js";

const router = express.Router();
const userController = new UserController();

// Public routes
router.post("/login", validate(loginValidation), userController.login);
router.post("/register", validate(registerValidation), userController.register);
router.post("/forgot-password", validate(forgotPasswordValidation), (req, res) =>
  res.handler.success(undefined, "Password reset functionality coming soon")
);

// Protected routes
router.use(authenticate);

router.get("/profile", userController.getProfile);
router.put("/profile", validate(updateProfileValidation), userController.updateProfile);
router.post("/change-password", validate(changePasswordValidation), userController.changePassword);
router.post("/logout", userController.logout);
router.post("/refresh-token", userController.refreshToken);

// Admin/Manager
router.get("/all", authorize(["admin", "manager"]), validate(listUsersValidation), userController.getAllUsers);
router.get("/:id", authorize(["admin", "manager"]), validate(userIdValidation), userController.getUserById);

// Admin-only
router.put("/:id", authorize(["admin"]), validate(updateUserValidation), userController.updateUser);
router.delete("/:id", authorize(["admin"]), validate(userIdValidation), userController.deleteUser);
router.patch("/bulk/update", authorize(["admin"]), validate(bulkUpdateValidation), (req, res) =>
  res.handler.success(undefined, "Bulk update functionality coming soon")
);
router.patch("/:id/status", authorize(["admin"]), validate(statusUpdateValidation), (req, res) =>
  res.handler.success(undefined, "User status updated successfully")
);

// Utility
router.get("/permissions/check", (req, res) =>
  res.handler.success(
    {
      user_id: req.user.id,
      user_type: req.user.user_type,
      permissions: {
        can_create_inquiries: true,
        can_edit_inquiries: true,
        can_delete_inquiries: req.user.user_type === "admin",
        can_manage_users: ["admin", "manager"].includes(req.user.user_type),
        can_view_reports: true,
        can_manage_settings: req.user.user_type === "admin",
      },
    },
    "Permissions fetched successfully"
  )
);

router.get("/dropdown/agents", authorize(["admin", "manager"]), async (req, res) => {
  try {
    res.handler.success(
      [
        { id: 1, name: "Agent 1", user_type: "agent" },
        { id: 2, name: "Agent 2", user_type: "agent" },
      ],
      "Agents list fetched successfully"
    );
  } catch (error) {
    res.handler.serverError(error);
  }
});

export default router;

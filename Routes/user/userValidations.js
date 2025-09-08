// Routes/user/validations.js
import { body, param, query } from "express-validator";

// Login
export const loginValidation = [
  body("username")
    .notEmpty().withMessage("Username or email is required")
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

// Register
export const registerValidation = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2-100 characters"),
  body("email")
    .isEmail().withMessage("Valid email is required")
    .normalizeEmail(),
  body("username")
    .isLength({ min: 3, max: 50 }).withMessage("Username must be between 3-50 characters")
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers and underscore"),
  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  body("user_type")
    .optional()
    .isIn(["admin", "manager", "agent"])
    .withMessage("Invalid user type. Must be admin, manager, or agent"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number format"),
];

// Forgot password
export const forgotPasswordValidation = [
  body("email")
    .isEmail().withMessage("Valid email is required")
    .normalizeEmail(),
];

// Profile update
export const updateProfileValidation = [
  body("name")
    .optional().notEmpty().withMessage("Name cannot be empty")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2-100 characters"),
  body("phone")
    .optional().isMobilePhone().withMessage("Invalid phone number format"),
  body("profile_image")
    .optional().isURL().withMessage("Profile image must be a valid URL"),
];

// Change password
export const changePasswordValidation = [
  body("current_password").notEmpty().withMessage("Current password is required"),
  body("new_password")
    .isLength({ min: 6 }).withMessage("New password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("New password must contain at least one uppercase letter, one lowercase letter, and one number"),
];

// Admin/manager list query
export const listUsersValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1-100"),
  query("search").optional().isLength({ min: 2 }).withMessage("Search term must be at least 2 characters"),
  query("user_type").optional().isIn(["admin", "manager", "agent"]).withMessage("Invalid user type filter"),
  query("status").optional().isIn(["true", "false"]).withMessage("Status must be true or false"),
];

// By ID
export const userIdValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid user ID"),
];

// Update user (admin)
export const updateUserValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid user ID"),
  body("name").optional().notEmpty().isLength({ min: 2, max: 100 }),
  body("email").optional().isEmail().normalizeEmail(),
  body("username").optional().isLength({ min: 3, max: 50 }).matches(/^[a-zA-Z0-9_]+$/),
  body("user_type").optional().isIn(["admin", "manager", "agent"]),
  body("phone").optional().isMobilePhone(),
  body("status").optional().isBoolean(),
  body("password").optional().isLength({ min: 6 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
];

// Bulk update
export const bulkUpdateValidation = [
  body("user_ids").isArray({ min: 1 }).withMessage("User IDs array is required"),
  body("user_ids.*").isInt({ min: 1 }).withMessage("Invalid user ID"),
  body("updates").isObject().withMessage("Updates object is required"),
  body("updates.status").optional().isBoolean(),
  body("updates.user_type").optional().isIn(["admin", "manager", "agent"]),
];

// Status update
export const statusUpdateValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid user ID"),
  body("status").isBoolean().withMessage("Status must be boolean"),
];

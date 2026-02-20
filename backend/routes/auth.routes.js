const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { protect, authorize } = require("../middleware/authMiddleware");

/*
  ======================
  PUBLIC ROUTES
  ======================
*/

// User Registration (Public)
router.post("/register", authController.register);

// User Login (Public)
router.post("/login", authController.login);

/*
  ======================
  SECURE ROUTES
  ======================
*/

// Get Logged-in User Profile
router.get(
  "/me",
  protect,
  authController.getMyProfile
);

// Create Admin (Only Admin Can Do This)
router.post(
  "/create-admin",
  protect,
  authorize("admin"),
  authController.createAdmin
);

module.exports = router;
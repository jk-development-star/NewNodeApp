"use strict";

const express = require("express");
const router = express.Router();

const {
  forgotPasswordView,
  forgotPasswordEmail,
  resetNewPasswordView,
  resetNewPassword,
} = require("../controllers/users/forgotPassword/forgot.password.controller");

router.get("/forgot-password", forgotPasswordView);
router.post("/forgot-password-email", forgotPasswordEmail);
router.get("/reset-password/:id/:token", resetNewPasswordView);
router.post("/reset-new-password/:id/:token", resetNewPassword);

module.exports = router;

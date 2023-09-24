"use strict";

const express = require("express");
const router = express.Router();
const checkJWTAuth = require("../middlewares/jwtAuth");
const {
  loginView,
  login,
  dashboardView,
} = require("../controllers/authcontroller");

router.get("/", loginView);
router.post("/login", login);
router.get("/dashboard", checkJWTAuth, dashboardView);

module.exports = router;

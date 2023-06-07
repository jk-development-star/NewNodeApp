"use strict";

const express = require("express");
const router = express.Router();
const {
  loginView,
  dashboardView,
  login,
} = require("../controllers/authcontroller");
const checkJWTAuth = require("../middlewares/jwtAuth");

router.get("/", loginView);

router.get("/dashboard", checkJWTAuth, dashboardView);
router.post("/login", login);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(301, "/");
});

module.exports = router;

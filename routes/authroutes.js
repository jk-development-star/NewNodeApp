"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isAuthenticated } = require("../config/passport.config");
const { loginView, dashboardView } = require("../controllers/authcontroller");

router.get("/", loginView);

router.get("/dashboard", isAuthenticated, dashboardView);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    faliureRedirect: "/",
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(301, "/");
});

module.exports = router;

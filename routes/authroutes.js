"use strict";

require("dotenv").config();
const express = require("express");
const router = express.Router();
const passport = require("passport");
const { checkPassportAuth } = require("../middlewares/passportAuth");

const {
  loginView,
  login,
  dashboardView,
} = require("../controllers/authcontroller");

login(passport);
router.get("/", loginView);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
    failureFlash: true,
  })
);
router.get("/dashboard", checkPassportAuth, dashboardView);

// Logout the user
router.post("/logout", function (req, res, next) {
  try {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "You are logged out.");
      res.redirect("/");
    });
  } catch (error) {
    req.flash("error", error);
    return res.redirect("back");
  }
});

module.exports = router;

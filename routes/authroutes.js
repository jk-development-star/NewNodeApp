"use strict";

require("dotenv").config();
const express = require("express");
const router = express.Router();
let passport = require('passport');
const session = require('express-session');
router.use(session({
    secret: process.env.SESSION_KEY,
    resave: false ,
    saveUninitialized: false ,
}));

// const checkJWTAuth = require("../middlewares/jwtAuth");
const {checkPassportAuth} = require("../middlewares/passportAuth");

router.use(passport.initialize());
router.use(passport.session());
const {
  loginView,
  login,
  dashboardView,
} = require("../controllers/authcontroller");

login(passport);
router.get("/", loginView);
router.post("/login", passport.authenticate('local', {
  successRedirect : '/dashboard',
  failureRedirect : '/',
  failureFlash : true
}));
router.get("/dashboard", checkPassportAuth, dashboardView);


// Logout the user
router.post("/logout", checkPassportAuth, function (req, res) {
  try {
    console.log(req.session);
    if (req.session) {
      
      req.logout(function(err) {
        if (err) { return next(err); }
        req.session.destroy();
        res.clearCookie("auth"); // clean up!
        return res.redirect("/");
      });
    } else {
      return res.redirect("back");
    }
  } catch (error) {
    req.flash("error", error);
    return res.redirect("back");
  }
});



module.exports = router;

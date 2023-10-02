"use strict";

require("dotenv").config();
const express = require("express");
const router = express.Router();
let passport = require('passport');
const cookieSession = require('cookie-session');
router.use(cookieSession({
    name: 'google-auth-session',
    keys: ['profile']
}));
// const checkJWTAuth = require("../middlewares/jwtAuth");
const {checkPassportAuth} = require("../middlewares/passportAuth");

router.use(passport.initialize());
router.use(passport.session());
const {
  loginView,
  login,
  googleLogin,
  dashboardView,
} = require("../controllers/authcontroller");

login(passport);
googleLogin(passport);

router.get("/", loginView);
router.post("/login", passport.authenticate('local', {
  successRedirect : '/dashboard',
  failureRedirect : '/',
  failureFlash : true
}));


router.post("/login/google",passport.authenticate('google', { 
  scope:[ 'email', 'profile' ]
}));


router.get("/google/auth/callback",passport.authenticate( 'google', {
  successRedirect : '/dashboard',
  failureRedirect : '/',
  failureFlash : true
}));


router.get("/dashboard", checkPassportAuth, dashboardView);


// Logout the user
router.post("/logout", checkPassportAuth, function (req, res) {
  try {
    if (req.session) {
      req.session.passport = {};
      res.redirect("/");
    } else {
      return res.redirect("back");
    }
  } catch (error) {
    req.flash("error", error);
    return res.redirect("back");
  }
});



module.exports = router;

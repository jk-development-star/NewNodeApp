/* eslint-disable no-undef */
"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const corsOptions = {
  origin: "http://localhost:8081",
};
const app = express();
app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../public")));
// set the template engine
app.set("view engine", "ejs");
app.use(expressLayouts);

app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// Cookie, flash and session
app.use(cookieParser());

// Making logged in user details global
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function (req, res, next) {
  res.locals.user = req.user;
  res.locals.message = req.flash();
  next();
});
//Routes
app.use(require("../routes/authroutes"));
app.use(require("../routes/user.routes"));
app.use(require("../routes/lead.routes"));
app.use(require("../routes/calendar.routes"));
app.use(require("../routes/tasks.routes"));
app.use(require("../routes/actionitems.routes"));
app.use(require("../routes/actionItemsTasks.routes"));
app.use(require("../routes/estimate.routes"));
app.use(require("../routes/lead.estimate.routes"));
app.use(require("../routes/lead.activity.routes"));
app.use(require("../routes/forgot.password.routes"));
app.use(require("../routes/contact.us.routes"));

module.exports = app;

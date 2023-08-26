"use strict";

require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db.config");
const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT || 8082;
const path = require("path");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const checkJWTAuth = require("./middlewares/jwtAuth");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set the template engine
app.set("view engine", "ejs");
app.use(expressLayouts);

// set the public folder path
app.use(express.static(path.join(__dirname, "public")));
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// Cookie, flash and session
app.use(cookieParser());
app.use(flash());
app.use(
  session({
    secret: "secret string",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);

// Making logged in user details global
app.use(function (req, res, next) {
  res.locals.user = req.cookies.auth;
  next();
});

// Logout the user
app.post("/logout", checkJWTAuth, function (req, res) {
  try {
    if (req.session) {
      req.session.destroy();
      res.clearCookie("auth"); // clean up!
      return res.redirect("/");
    } else {
      return res.redirect("back");
    }
  } catch (error) {
    req.flash("error", error);
    return res.redirect("back");
  }
});

//Routes
app.use(require("./routes/authroutes"));
app.use(require("./routes/user.routes"));
app.use(require("./routes/lead.routes"));
app.use(require("./routes/calendar.routes"));
app.use(require("./routes/tasks.routes"));
app.use(require("./routes/actionitems.routes"));
app.use(require("./routes/actionItemsTasks.routes"));
app.use(require("./routes/estimate.routes"));
app.use(require("./routes/lead.estimate.routes"));

// connect database
connectDB(DATABASE_URL);

// server Connectivity
app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server is connected to http://localhost:${PORT}`);
  } else {
    console.log(error);
  }
});

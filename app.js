"use strict";

require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db.config");
const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT || 8082;
const path = require("path");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const expressSession = require("express-session");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
// set the template engine
app.set("view engine", "ejs");
app.use(expressLayouts);
// set the public path
app.use(express.static(path.join(__dirname, "public")));
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

app.use(flash());

app.use(
  expressSession({
    secret: "secret string",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);

app.use(function (req, res, next) {
  res.locals.user = req.cookies.auth;
  next();
});
app.use(require("./routes/authroutes"));
app.use(require("./routes/user.routes"));
app.use(require("./routes/lead.routes"));
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

"use strict";

const express = require("express");
const router = express.Router();
// const checkJWTAuth = require("../middlewares/jwtAuth");
const {checkPassportAuth} = require("../middlewares/passportAuth");
const calendarView = require("../controllers/calendar/calendar.controller");

router.get("/calendar", checkPassportAuth, calendarView);

module.exports = router;

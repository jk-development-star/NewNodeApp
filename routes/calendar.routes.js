'use strict'

const express = require('express')
const router = express.Router();
const checkJWTAuth = require('../middlewares/jwtAuth')
const { calendarView } = require('../controllers/calendar/calendar.controller')

router.get('/calendar', checkJWTAuth, calendarView);

module.exports = router;
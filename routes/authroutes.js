'use strict'

const express = require('express')
const router = express.Router();
const checkJWTAuth = require('../middlewares/jwtAuth')
const { loginView, login, dashboardView } = require('../controllers/authcontroller')


router.get('/', loginView);

router.get('/dashboard', checkJWTAuth, dashboardView)
router.post("/login", login);





module.exports = router;
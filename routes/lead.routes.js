'use strict'


const express = require('express')
const router = express.Router();
const checkJWTAuth = require('../middlewares/jwtAuth')
const { getAllLead, leadCreate, storeLead } = require('../controllers/leads/lead.controller')

router.get('/leads', checkJWTAuth, getAllLead);
router.get('/create/lead', checkJWTAuth, leadCreate);
router.post('/store/lead', checkJWTAuth, storeLead);

module.exports = router;
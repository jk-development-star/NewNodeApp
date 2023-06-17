'use strict'

const express = require('express')
const router = express.Router();
const checkJWTAuth = require('../middlewares/jwtAuth')
const { getAllLead, leadCreate, storeLead, leadDetails, leadEdit, leadUpdate } = require('../controllers/leads/lead.controller')

router.get('/leads/:status?', checkJWTAuth, getAllLead);
router.get('/create/lead', checkJWTAuth, leadCreate);
router.get('/edit/lead/:id', checkJWTAuth, leadEdit);
router.get('/track/lead/:id', checkJWTAuth, leadDetails);
router.post('/store/lead', checkJWTAuth, storeLead);
router.post('/update/lead/:id', checkJWTAuth, leadUpdate);

module.exports = router;
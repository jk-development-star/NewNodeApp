"use strict";

const express = require("express");
const router = express.Router();
// const checkJWTAuth = require("../middlewares/jwtAuth");
const {checkPassportAuth} = require("../middlewares/passportAuth");
const { estimateForm } = require("../controllers/leads/lead.controller");
router.get("/estimate/lead/:id", checkPassportAuth, estimateForm);

module.exports = router;

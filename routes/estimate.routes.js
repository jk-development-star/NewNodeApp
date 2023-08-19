"use strict";

const express = require("express");
const router = express.Router();
const checkJWTAuth = require("../middlewares/jwtAuth");
const { estimateForm } = require("../controllers/leads/lead.controller");
router.get("/estimate/lead/:id", checkJWTAuth, estimateForm);

module.exports = router;

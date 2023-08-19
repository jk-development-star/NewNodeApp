"use strict";

const express = require("express");
const router = express.Router();
const checkJWTAuth = require("../middlewares/jwtAuth");
const { createInvoice } = require("../controllers/estimate/createEstimate");
router.post("/estimate/lead/:id", checkJWTAuth, createInvoice);

module.exports = router;

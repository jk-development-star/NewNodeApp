"use strict";

const express = require("express");
const router = express.Router();
// const checkJWTAuth = require("../middlewares/jwtAuth");
const {checkPassportAuth} = require("../middlewares/passportAuth");
const { createInvoice } = require("../controllers/estimate/createEstimate");
router.post("/estimate/lead/:id", checkPassportAuth, createInvoice);

module.exports = router;

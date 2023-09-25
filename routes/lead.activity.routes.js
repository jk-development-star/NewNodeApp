"use strict";

const express = require("express");
const router = express.Router();
// const checkJWTAuth = require("../middlewares/jwtAuth");
const {checkPassportAuth} = require("../middlewares/passportAuth");
const upload = require("../middlewares/imageUpload");
const {
  storeLeadActivity,
  leadActivityDetails,
} = require("../controllers/leads/lead.activity.controller");

router.post(
  "/store/lead/activity/:id",
  checkPassportAuth,
  upload.array("lead_image", 10),
  storeLeadActivity
);

router.get("/activity/lead/:id", checkPassportAuth, leadActivityDetails);

module.exports = router;

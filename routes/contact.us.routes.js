"use strict";

const express = require("express");
const router = express.Router();
const {
  contactUsView,
  contactUs,
} = require("../controllers/contact/contact.us.controller");
router.get("/contact-us", contactUsView);
router.post("/receive-email", contactUs);

module.exports = router;

"use strict";

const express = require("express");
const router = express.Router();
// const checkJWTAuth = require("../middlewares/jwtAuth");
const {checkPassportAuth} = require("../middlewares/passportAuth");

const {
  getAllLead,
  leadCreate,
  storeLead,
  leadEdit,
  leadUpdate,
  estimateForm,
} = require("../controllers/leads/lead.controller");
const { leadGallery } = require("../controllers/leads/lead.images.controller");

router.get("/leads/:status?", checkPassportAuth, getAllLead);
router.get("/create/lead", checkPassportAuth, leadCreate);
router.get("/edit/lead/:id", checkPassportAuth, leadEdit);
router.get("/estimate/lead/:id", checkPassportAuth, estimateForm);
router.post("/store/lead", checkPassportAuth, storeLead);
router.post("/update/lead/:id", checkPassportAuth, leadUpdate);

router.get("/lead/gallery/:id", checkPassportAuth, leadGallery);

module.exports = router;

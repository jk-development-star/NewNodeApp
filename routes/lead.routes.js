"use strict";

const express = require("express");
const router = express.Router();
const checkJWTAuth = require("../middlewares/jwtAuth");

const {
  getAllLead,
  leadCreate,
  storeLead,
  leadEdit,
  leadUpdate,
  estimateForm,
} = require("../controllers/leads/lead.controller");
const { leadGallery } = require("../controllers/leads/lead.images.controller");

router.get("/leads/:status?", checkJWTAuth, getAllLead);
router.get("/create/lead", checkJWTAuth, leadCreate);
router.get("/edit/lead/:id", checkJWTAuth, leadEdit);
router.get("/estimate/lead/:id", checkJWTAuth, estimateForm);
router.post("/store/lead", checkJWTAuth, storeLead);
router.post("/update/lead/:id", checkJWTAuth, leadUpdate);

router.get("/lead/gallery/:id", checkJWTAuth, leadGallery);

module.exports = router;

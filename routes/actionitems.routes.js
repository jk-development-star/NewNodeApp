"use strict";

const express = require("express");
const router = express.Router();
// const checkJWTAuth = require("../middlewares/jwtAuth");
const {checkPassportAuth} = require("../middlewares/passportAuth");
const {
  actionItemsIndex,
  actionItemsCreate,
  storeActionItems,
  deleteActionItem,
} = require("../controllers/actionItems/actionItems.controller");

router.get("/actionItems", checkPassportAuth, actionItemsIndex);
router.get("/actionItems/create", checkPassportAuth, actionItemsCreate);
router.post("/actionItems/store", checkPassportAuth, storeActionItems);
router.post("/actionItems/delete/:id", checkPassportAuth, deleteActionItem);

module.exports = router;

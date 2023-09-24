"use strict";

const express = require("express");
const router = express.Router();
const checkJWTAuth = require("../middlewares/jwtAuth");
const {
  actionItemsIndex,
  actionItemsCreate,
  storeActionItems,
  deleteActionItem,
} = require("../controllers/actionItems/actionItems.controller");

router.get("/actionItems", checkJWTAuth, actionItemsIndex);
router.get("/actionItems/create", checkJWTAuth, actionItemsCreate);
router.post("/actionItems/store", checkJWTAuth, storeActionItems);
router.post("/actionItems/delete/:id", checkJWTAuth, deleteActionItem);

module.exports = router;

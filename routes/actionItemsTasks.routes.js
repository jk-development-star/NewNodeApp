"use strict";

const express = require("express");
const router = express.Router();
const checkJWTAuth = require("../middlewares/jwtAuth");
const {
  getActionItemTasksList,
} = require("../controllers/association/actionItemsTasks.controller");

router.get("/tasks/list/:id", checkJWTAuth, getActionItemTasksList);

module.exports = router;

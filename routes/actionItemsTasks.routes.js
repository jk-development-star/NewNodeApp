"use strict";

const express = require("express");
const router = express.Router();
// const checkJWTAuth = require("../middlewares/jwtAuth");
const {checkPassportAuth} = require("../middlewares/passportAuth");
const {
  getActionItemTasksList,
} = require("../controllers/association/actionItemsTasks.controller");

router.get("/tasks/list/:id", checkPassportAuth, getActionItemTasksList);

module.exports = router;

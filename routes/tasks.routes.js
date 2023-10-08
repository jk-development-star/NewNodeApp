"use strict";

const express = require("express");
const router = express.Router();
// const checkJWTAuth = require("../middlewares/jwtAuth");
const {checkPassportAuth} = require("../middlewares/passportAuth");
const {
  createTask,
  storeTasks,
  tasksList,
  editTask,
  updateTasks,
  deleteTask,
} = require("../controllers/tasks/tasks.controller");

router.get("/task/create", checkPassportAuth, createTask);
router.get("/tasks", checkPassportAuth, tasksList);
router.get("/tasks/:id", checkPassportAuth, editTask);
router.post("/store/task", checkPassportAuth, storeTasks);
router.post("/tasks/update/:id", checkPassportAuth, updateTasks);
router.post("/task/delete/:id", checkPassportAuth, deleteTask);
module.exports = router;

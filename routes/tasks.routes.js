"use strict";

const express = require("express");
const router = express.Router();
const checkJWTAuth = require("../middlewares/jwtAuth");
const {
  createTask,
  storeTasks,
  tasksList,
  editTask,
  updateTasks,
  deleteTask,
} = require("../controllers/tasks/tasks.controller");

router.get("/task/create", checkJWTAuth, createTask);
router.get("/tasks", checkJWTAuth, tasksList);
router.get("/tasks/:id", checkJWTAuth, editTask);
router.post("/store/task", checkJWTAuth, storeTasks);
router.post("/tasks/update/:id", checkJWTAuth, updateTasks);
router.post("/task/delete/:id", checkJWTAuth, deleteTask);
module.exports = router;

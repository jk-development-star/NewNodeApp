"use strict";

const taskSchema = require("../../models/tasks/tasks.model");

exports.createTasks = async (data) => {
  const newTask = await taskSchema.create(data);
  const { created_by, task_status, __v, ...result } = newTask._doc;
  return result;
};

exports.getAllTasks = async () => {
  const allTasks = await taskSchema.find();
  return allTasks;
};
exports.getTaskDetail = async (id) => {
  const task = await taskSchema.findById(id);
  return task;
};

exports.updateTask = async (id, data) => {
  const task = await taskSchema.findByIdAndUpdate(
    id,
    {
      $set: data,
    },
    { new: true }
  );
  const { created_by, __v, ...result } = task._doc;
  return result;
};

exports.getTaskDetails = async () => {
  const taskDetails = taskSchema.aggregate([
    {
      $lookup: {
        from: "tasksandactiongroups",
        localField: "_id",
        foreignField: "tasks_id",
        as: "taskDetails",
      },
    },
  ]);

  return taskDetails;
};

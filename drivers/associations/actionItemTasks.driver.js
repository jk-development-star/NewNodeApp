"use strict";

const taskAndActionGroupsSchema = require("../../models/associations/task_actionGroups.model");
exports.createTaskAndActionGroups = async (data) => {
  const taskAndActionGroups = await taskAndActionGroupsSchema.create(data);
  return taskAndActionGroups;
};

exports.getActionItemTasks = async (id) => {
  const tasks = taskAndActionGroupsSchema
    .findOne({ action_item_id: id })
    .populate("action_item_id")
    .populate("tasks_id")
    .exec();
  return tasks;
};

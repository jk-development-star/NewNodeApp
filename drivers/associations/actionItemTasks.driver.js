"use strict";

const taskAndActionGroupsSchema = require("../../models/associations/task_actionGroups.model");
exports.createTaskAndActionGroups = async (data) => {
  const taskAndActionGroups = await taskAndActionGroupsSchema.create(data);
  return taskAndActionGroups;
};

exports.getActionItemTasks = async (id) => {
  const tasks = await taskAndActionGroupsSchema
    .findOne({ action_item_id: id })
    .populate("action_item_id")
    .populate("tasks_id")
    .exec();
  return tasks;
};

exports.removeAssociationById = async (id) => {
  const tasksList = taskAndActionGroupsSchema.findOneAndDelete({
    action_item_id: id,
  });
  return tasksList;
};

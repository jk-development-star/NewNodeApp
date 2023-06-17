"use strict";

const actionItemTasksDriver = require("../../drivers/associations/actionItemTasks.driver");

const getActionItemTasksList = async (req, res) => {
  const { id } = req.params;
  const tasks = await actionItemTasksDriver.getActionItemTasks(id);
  if (tasks) {
    return res.status(200).json({
      status: 200,
      task: tasks,
    });
  } else {
    return res.status(404).json({
      status: 404,
    });
  }
};

module.exports = {
  getActionItemTasksList,
};

"use strict";

const tasksDriver = require("../../drivers/tasks/tasks.driver");
const { validateTask } = require("../../validations/tasks/tasks.validation");

const createTask = async (req, res) => {
  return res.render("newViews/tasks/create", {
    title: "Add New Task",
    layout: true,
  });
};

const storeTasks = async (req, res) => {
  var { error, value } = validateTask(req.body);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/task/create");
  }
  var { created_by, task_status, ...data } = value;
  ((data["created_by"] = req.userId), data["task_status"]),
    await tasksDriver
      .createTasks(data)
      .then((task) => {
        if (task) req.flash("success", "Task has been addedd succesfully.");
        return res.redirect(301, "/tasks");
      })
      .catch((error) => {
        req.flash("error", error);
        return res.redirect("/task/create");
      });
};

const tasksList = async (req, res) => {
  await tasksDriver
    .getAllTasks()
    .then((tasks) => {
      if (tasks)
        return res.render("newViews/tasks/index", {
          tasks,
          title: "Tasks List",
          layout: true,
        });
      else req.flash("error", "No tasks are available");
      return res.redirect("/tasks");
    })
    .catch((error) => {
      req.flash("error", error);
      return res.redirect("/tasks");
    });
};

const editTask = async (req, res) => {
  const { id } = req.params;
  await tasksDriver
    .getTaskDetail(id)
    .then((task) => {
      return res.render("newViews/tasks/edit", {
        task,
        title: "Edit Task",
        layout: true,
      });
    })
    .catch((error) => {
      req.flash("error", error);
      return res.redirect(`/tasks/${id}`);
    });
};

const updateTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const { updated_by, task_status, ...data } = req.body;
    data["updated_by"] = req.userId;
    data["task_status"] = req.body.task_status;
    await tasksDriver
      .updateTask(id, data)
      .then((task) => {
        if (!task) {
          req.flash("error", "No task found");
          return res.redirect("tasks");
        } else {
          req.flash("success", "Task updated successfully.");
          return res.redirect(301, "/tasks");
        }
      })
      .catch((error) => {
        req.flash("error", error);
        return res.redirect(`tasks/${id}`);
      });
  } catch (error) {
    req.flash("error", "Something went wrong");
    return res.redirect(`tasks/${id}`);
  }
};

const deleteTask = async (req, res) => {
  try {
    //Deleting the User
    const { id } = req.params;
    await tasksDriver.deleteTask(id).then((task) => {
      if (!task) {
        return res.status(404).json({
          status: 404,
          message: "Task can not be find",
        });
      }
      return res.status(200).json({
        status: 200,
        message: "Task has been deleted successfully!",
      });
    });
  } catch (error) {
    //Logging the error
    return res.status(500).json({
      status: 500,
      message: error,
    });
  }
};
module.exports = {
  createTask,
  storeTasks,
  tasksList,
  editTask,
  updateTasks,
  deleteTask,
};

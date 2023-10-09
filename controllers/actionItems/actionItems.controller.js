"use strict";

const actionItemDriver = require("../../drivers/actionItems/actionItems.driver");
const {
  validateActionItems,
} = require("../../validations/actionItems/action_items.validation");
const actionItemTasksDriver = require("../../drivers/associations/actionItemTasks.driver");
const taskDriver = require("../../drivers/tasks/tasks.driver");

const actionItemsIndex = async (req, res) => {
  const actionItems = await actionItemDriver.getActionItems();
  return res.render("newViews/actionItems/index", {
    title: "Action Items List",
    layout: true,
    actionItems,
  });
};

const actionItemsCreate = async (req, res) => {
  const tasksList = await taskDriver.getAllTasks();
  const actionItems = await actionItemDriver.getAllActionItems();
  return res.render("newViews/actionItems/create", {
    task: tasksList,
    actionItems: actionItems,
    title: "Create Action Item",
    layout: true,
  });
};

const storeActionItems = async (req, res) => {
  const { error, value } = validateActionItems(req.body);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/actionItems/create");
  }
  const { action_item_created_by, action_item_status, ...data } = value;
  data["action_item_created_by"] = req.userId;
  try {
    await actionItemDriver
      .createActionItem(data)
      .then((actionItem) => {
        if (actionItem) {
          let id = actionItem._id;
          if (id) {
            let tasks = data["action_item_tasks"];
            const taskData = { action_item_id: id, tasks_id: tasks };
            actionItemTasksDriver
              .createTaskAndActionGroups(taskData)
              .then((actionItemTasks) => {
                if (actionItemTasks) {
                  req.flash("success", "Action Item created successfully");
                  res.redirect(301, "/actionItems");
                }
              })
              .catch(() => {
                req.flash("error", "Something went wrong");
                return res.redirect("/actionItems/create");
              });
          }
        } else {
          req.flash("error", "Action Item not created");
          return res.redirect("/actionItems/create");
        }
      })
      .catch((error) => {
        req.flash("error", error.message);
        return res.redirect("/actionItems/create");
      });
  } catch (error) {
    req.flash("error", error);
    return res.redirect("/actionItems/create");
  }
};

const deleteActionItem = async (req, res) => {
  try {
    //Deleting the User
    const { id } = req.params;
    await actionItemDriver.deleteActionItem(id).then((actionItem) => {
      if (!actionItem) {
        return res.status(404).json({
          status: 404,
          message: "Action Item can not be find",
        });
      } else {
        actionItemTasksDriver.removeAssociationById(id);
        return res.status(200).json({
          status: 200,
          message: "Action Item has been deleted successfully!",
        });
      }
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
  actionItemsIndex,
  actionItemsCreate,
  storeActionItems,
  deleteActionItem,
};

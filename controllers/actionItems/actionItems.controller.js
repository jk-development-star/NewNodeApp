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
  return res.render("newViews/actionItems/create", {
    task: tasksList,
    title: "Create Action Item",
    layout: true,
  });
};

const storeActionItems = async (req, res) => {
  const { error, value } = validateActionItems(req.body);

  if (error) {
    req.flash("error", error.details[0].message);
    return res.render("newViews/actionItems/create", {
      title: "Create Action Item",
      layout: true,
    });
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
                return res.render("newViews/actionItems/create", {
                  title: "Create Action Item",
                  layout: true,
                });
              });
          }
        } else {
          req.flash("error", "Action Item not created");
          return res.render("newViews/actionItems/create", {
            title: "Create Action Item",
            layout: true,
          });
        }
      })
      .catch((error) => {
        req.flash("error", error.message);
        return res.render("newViews/actionItems/create", {
          title: "Create Action Item",
          layout: true,
        });
      });
  } catch (error) {
    req.flash("error", error);
    return res.render("newViews/actionItems/create", {
      title: "Create Action Item",
      layout: true,
    });
  }
};

module.exports = {
  actionItemsIndex,
  actionItemsCreate,
  storeActionItems,
};

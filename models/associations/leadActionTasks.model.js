"use strict";

const mongoose = require("mongoose");
const Schema = require("mongoose");

const leadActionTasksModel = new mongoose.Schema(
  {
    lead_id: {
      type: Schema.Types.ObjectId,
      ref: "Leads",
    },
    action_item_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "ActionItems",
      },
    ],
    tasks_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tasks",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeadActionTasks", leadActionTasksModel);

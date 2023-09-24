"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskAndActionGroupsSchema = new mongoose.Schema(
  {
    action_item_id: {
      type: Schema.Types.ObjectId,
      ref: "ActionItems",
    },
    tasks_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tasks",
      },
    ],

    lead_id: {
      type: Schema.Types.ObjectId,
      ref: "Leads",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "TasksAndActionGroups",
  taskAndActionGroupsSchema
);

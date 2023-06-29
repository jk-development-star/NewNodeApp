"use strict";

const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const actionItemSchema = new mongoose.Schema(
  {
    action_item_type: {
      type: String,
      required: true,
    },
    action_item_name: {
      type: String,
      required: true,
    },
    action_item_start_date: {
      type: Date,
      required: true,
    },
    action_item_end_date: {
      type: Date,
      required: true,
    },
    action_item_completion_days: {
      type: String,
      required: true,
    },
    action_item_type_of_work: {
      type: String,
      required: true,
    },
    action_item_description: {
      type: String,
      required: true,
    },

    action_item_status: {
      type: String,
      enum: ["Active", "Completed", "In-Progress", "Completed"],
      default: "Active",
    },
    action_item_created_by: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    action_item_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActionItems", actionItemSchema);

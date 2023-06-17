"use strict";

const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    task_name: {
      type: String,
      required: true,
    },
    task_description: {
      type: String,
      required: true,
    },
    task_type: {
      type: String,
      required: true,
    },
    task_status: {
      type: String,
      enum: ["Active", "In-Active"],
      default: "Active",
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tasks", taskSchema);

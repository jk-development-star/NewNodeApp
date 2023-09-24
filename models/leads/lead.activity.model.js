"use strict";

const mongoose = require("mongoose");
const leadActivitySchema = new mongoose.Schema(
  {
    lead_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leads",
    },
    activity_comment: {
      type: String,
      required: true,
    },
    activity_type: {
      type: String,
      required: true,
    },
    acitvity_added_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("LeadActivity", leadActivitySchema);

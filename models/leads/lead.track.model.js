"use strict";

const mongoose = require("mongoose");

const leadTrackSchema = new mongoose.Schema(
  {
    track_lead_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leads",
    },
    lead_assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    amount_spent: {
      type: Number,
      required: true,
    },
    amount_spent_duration: {
      type: Number,
      required: true,
    },
    estimated_duration: {
      type: Text,
      required: true,
    },
    action_item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ActionItems",
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tasks",
      },
    ],
    lead_duration_remaining_period: {
      type: Number,
    },
    comments_by_assignee: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("TrackLeads", leadTrackSchema);

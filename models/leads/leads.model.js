"use strict";

const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const leadSchema = new mongoose.Schema(
  {
    lead_id: {
      type: Number,
    },
    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    assignedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    description: {
      type: String,
      required: true,
    },
    covered_area: {
      type: String,
      required: true,
    },
    customer_name: {
      type: String,
      required: true,
    },
    customer_email: {
      type: String,
      required: true,
    },
    customer_phone: {
      required: true,
      type: String,
    },
    customer_address: {
      required: true,
      type: String,
    },
    customer_city: {
      required: true,
      type: String,
    },
    customer_state: {
      required: true,
      type: String,
    },
    customer_country: {
      required: true,
      type: String,
    },
    customer_zipcode: {
      required: true,
      type: String,
    },
    lead_budget: {
      required: false,
      type: String,
    },
    lead_remark_followup: {
      required: false,
      type: String,
    },
    work_category: [
      {
        type: String,
        required: true,
      },
    ],
    pdf_path: {
      type: String,
    },
    lead_status: {
      type: String,
      enum: [
        "Active",
        "Completed",
        "In-Progress",
        "Quality-Inspection",
        "Closed",
      ],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leads", leadSchema);

"use strict";

const momgoose = require("mongoose");
const Schema = momgoose.Schema;

const estimateSchema = new Schema(
  {
    lead_id: {
      type: Schema.Types.ObjectId,
      ref: "Leads",
    },
    pdf_path: {
      type: String,
      required: true,
    },
    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

module.exports = momgoose.model("LeadEstimates", estimateSchema);

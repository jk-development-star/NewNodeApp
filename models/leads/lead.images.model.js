"use strict";

const mongoose = require("mongoose");

const leadImagesSchema = new mongoose.Schema(
  {
    track_lead_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leads",
    },
    lead_image: {
      type: Array,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("LeadImages", leadImagesSchema);

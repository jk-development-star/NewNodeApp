"use strict";

const mongoose = require("mongoose");

const workCategoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    short_name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkCategories", workCategoriesSchema);

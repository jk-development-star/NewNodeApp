"use strict";

const mongoose = require("mongoose");
const Schema = require("mongoose");

const workSubCategoriesSchema = new mongoose.Schema(
  {
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "WorkCategories",
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkSubCategories", workSubCategoriesSchema);

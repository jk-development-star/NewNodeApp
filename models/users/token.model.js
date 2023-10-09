"use strict";

const mongoose = require("mongoose");
const tokenSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    token: {
      type: String,
      required: true,
    },
    token_expire: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);

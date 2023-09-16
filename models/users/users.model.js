"use strict";
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    verificationToken: {
      required: false,
      type: String,
    },
    verified_at: {
      required: false,
      type: Date,
    },
    profile_image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);

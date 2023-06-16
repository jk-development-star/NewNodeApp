const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "InActive"],
      default: "Active",
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      refs: "Users",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tasks", taskSchema);

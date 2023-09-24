"use strict";

const actionItemSchema = require("../../models/actionsItems/action.items.model");
const mongoose = require("mongoose");
exports.createActionItem = async (data) => {
  const actionItem = await actionItemSchema.create(data);
  const { action_item_created_by, action_item_status, __v, ...result } =
    actionItem._doc;
  return result;
};

exports.getActionItems = async () => {
  const actionItems = await actionItemSchema
    .find()
    .sort({ createdAt: -1 })
    .select(["-__v"])
    .populate("action_item_created_by")
    .exec();
  return actionItems;
};

exports.getAllActionItems = async () => {
  const actionItems = await actionItemSchema.find();
  return actionItems;
};
exports.getSingleActionItem = async (id) => {
  const actionItem = await actionItemSchema.find({ _id: id });
  return actionItem;
};

exports.deleteActionItem = async (id) => {
  const actionItem = await actionItemSchema.findOneAndDelete({ _id: id });
  return actionItem;
};

exports.getActionItemDetailById = async (id) => {
  const actionItemDetails = await actionItemSchema.findById({ _id: id });
  return actionItemDetails;
};

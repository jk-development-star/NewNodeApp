"use strict";

const LeadActivity = require("../../models/leads/lead.activity.model");

exports.leadActivityStore = async (data) => {
  const leadActivity = await LeadActivity.create(data);
  const { lead_id, acitvity_added_by, __v, ...result } = leadActivity._doc;
  return result;
};

exports.getLeadActivity = async (id) => {
  const leadActivity = await LeadActivity.find({ lead_id: id })
    .populate("acitvity_added_by")
    .exec();
  return leadActivity;
};

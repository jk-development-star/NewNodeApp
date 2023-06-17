"use strict";

const leadSchema = require("../../models/leads/leads.model");

exports.leadCreate = async (data) => {
  const newLead = await leadSchema.create(data);
  const { generatedBy, lead_id, __v, ...result } = newLead._doc;
  return result;
};

exports.getAllLeads = async (status) => {
  if (status) {
    const leads = await leadSchema
      .find({ lead_status: status })
      .sort({ createdAt: -1 })
      .select(["-__v"])
      .populate("generatedBy")
      .populate("assignedTo")
      .exec();
    return leads;
  } else {
    const leads = await leadSchema
      .find()
      .sort({ createdAt: -1 })
      .select(["-__v"])
      .populate("generatedBy")
      .populate("assignedTo")
      .exec();
    return leads;
  }
};
exports.getLead = async (id) => {
  const lead = await leadSchema
    .findById(id)
    .populate("generatedBy")
    .populate("assignedTo")
    .exec();
  return lead;
};
exports.getActiveLead = async () => {
  const ActiveLead = await leadSchema.find({ lead_status: "Active" }).count();
  return ActiveLead;
};
exports.getFollowUpLead = async () => {
  const FollowUpLead = await leadSchema
    .find({ lead_status: "Follow-Up" })
    .count();
  return FollowUpLead;
};
exports.getInProcessLead = async () => {
  const InProcessLead = await leadSchema
    .find({ lead_status: "In-Process" })
    .count();
  return InProcessLead;
};
exports.getCompletedLead = async () => {
  const CompletedLead = await leadSchema
    .find({ lead_status: "Completed" })
    .count();
  return CompletedLead;
};
exports.getClosedLead = async () => {
  const closedLead = await leadSchema
    .find({ lead_status: "Closed" })
    .count();
  return closedLead;
};

exports.getLatestLeads = async () => {
  const latestLeads = await leadSchema.aggregate([
    {
      $match: {
        lead_status: "Active",
        createdAt: {
          $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000),
        },
      },
    },
  ]);

  return latestLeads;
};

exports.updateLead = async(id, data) => {
 const lead = await leadSchema.findByIdAndUpdate( id,
  {
    $set: data,
  },
  { new: true });
   const { lead_id, generatedBy , __v, ...result } = lead._doc;
  return result;
}

"use strict";

const estimateModel = require("../../models/estimate/lead.estimate.model");

exports.createEstimate = async (data) => {
  const estimateData = await estimateModel.create(data);
  const { generatedBy, lead_id, ...result } = estimateData._doc;
  return result;
};

exports.getEstimateDetails = async (id) => {
  const details = await estimateModel.findById(id);
  return details;
};

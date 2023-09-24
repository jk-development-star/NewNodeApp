"use strict";

const LeadImagesSchema = require("../../models/leads/lead.images.model");

exports.uploadLeadImages = async (data) => {
  const images = await LeadImagesSchema.create(data);
  const { __v, ...result } = images._doc;
  return result;
};

exports.getAllUploadedImages = async (id) => {
  const images = await LeadImagesSchema.find({ track_lead_id: id });
  return images;
};

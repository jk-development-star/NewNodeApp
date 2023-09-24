"use strict";

const LeadActivity = require("../../drivers/leads/lead.activity.driver");
const leadDriver = require("../../drivers/leads/leads.driver");
const leadImages = require("../../drivers/leads/lead.images.driver");
const displayTime = require("../../helpers/common");
const { leadActivityLogger } = require("../../utils/loggers");
const {
  validateLeadActivity,
} = require("../../validations/leads/lead.activity");
const leadTrackDriver = require("../../drivers/leads/lead.images.driver");

const storeLeadActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = validateLeadActivity(req.body);
    if (error) {
      req.flash("error", error.details[0].message);
      return res.render("newViews/leads/lead_details", {
        title: "Lead Details",
        layout: true,
      });
    } else {
      const { lead_id, acitvity_added_by, ...data } = value;
      data["acitvity_added_by"] = req.userId;
      data["lead_id"] = id;
      await LeadActivity.leadActivityStore(data)
        .then((result) => {
          if (result) {
            req.files.map(async (file) => {
              const imageData = {
                track_lead_id: id,
                lead_image: file,
              };
              await leadTrackDriver.uploadLeadImages(imageData);
            });
            req.flash("success", "Lead Activity Added Successfully");
          }
          leadActivityLogger.info("Activity Added!", {
            status: "201",
            result: result,
          });
          return res.redirect(`/activity/lead/${id}`);
        })
        .catch((error) => {
          leadActivityLogger.error("Activity not added", {
            status: "500",
            error: error,
          });
          req.flash("error", error.message);
          return res.redirect(`/activity/lead/${id}`);
        });
    }
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect(`/activity/lead/${id}`);
  }
};

const leadActivityDetails = async (req, res) => {
  const lead = await leadDriver.getLead(req.params.id);
  const leadActivity = await LeadActivity.getLeadActivity(req.params.id);
  const leadImages = await leadTrackDriver.getAllUploadedImages(req.params.id);
  return res.render("newViews/leads/lead_activity", {
    lead,
    leadActivity,
    leadImages,
    displayTime: displayTime,
    title: "Lead Activity",
    layout: true,
  });
};

module.exports = { storeLeadActivity, leadActivityDetails };

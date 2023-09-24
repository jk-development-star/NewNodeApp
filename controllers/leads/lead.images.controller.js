"use strict";

const leadTrackDriver = require("../../drivers/leads/lead.images.driver");
const leadGallery = async (req, res) => {
  const { id } = req.params;
  const leadImages = await leadTrackDriver.getAllUploadedImages(id);
  res.render("newViews/leads/lead_gallery", {
    leadImages,
    id,
    title: "Lead Gallery",
    layout: true,
  });
};
const storeLeadImages = async (req, res) => {
  try {
    const { id } = req.params;

    req.files.map(async (file) => {
      const data = {
        track_lead_id: id,
        lead_image: file,
      };
      await leadTrackDriver
        .uploadLeadImages(data)
        .then((result) => {
          if (result) {
            req.flash("success", "Lead Images uploaded successfully.");
            res.redirect(301, `/track/lead/${id}`);
          } else {
            req.flash("error", "Something went wrong, Please try again later.");
            res.redirect(`/track/lead/${id}`);
          }
        })
        .catch((error) => {
          req.flash("error", error.message);
          res.redirect(`/track/lead/${id}`);
        });
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect(`/track/lead/${req.params.id}`);
  }
};

module.exports = { storeLeadImages, leadGallery };

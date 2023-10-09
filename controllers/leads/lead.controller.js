"use strict";

const leadDriver = require("../../drivers/leads/leads.driver");
const { leadMessage } = require("../../constants");
const { validateLead } = require("../../validations/leads/lead.validation");
const userDriver = require("../../drivers/users/user.driver");
const currencyFormat = require("../../helpers/common");
const actionItemsDriver = require("../../drivers/actionItems/actionItems.driver");
const { leadLogger } = require("../../utils/loggers");

/**
 *
 * @param {*} req
 * @param {*} res
 */
const leadCreate = async (req, res) => {
  const usersList = await userDriver.getAllUsersForAssignLeads();
  res.render("newViews/leads/create", {
    usersList,
    layout: true,
    title: "Add New Lead",
  });
};

/**
 *
 * @param {string} status lead status to get the lead based on the status
 * @return {object} array of object
 */
const getAllLead = async (req, res) => {
  try {
    let status = req.params.status ? req.params.status : "";
    await leadDriver
      .getAllLeads(status)
      .then((leads) => {
        if (!leads) {
          req.flash("error", leadMessage.MESSAGE_NO_LEAD_FOUND);
          return res.render("newViews/leads/index", {
            title: "Lead List",
            layout: true,
          });
        } else {
          return res.render("newViews/leads/index", {
            leads,
            currencyFormat: currencyFormat,
            title: "Lead List",
            layout: true,
          });
        }
      })
      .catch((error) => {
        leadLogger.error("Lead not found", { status: "500", error: error });
        req.flash("error", error);
        return res.render("newViews/leads/index", {
          title: "Lead List",
          layout: true,
        });
      });
  } catch (error) {
    leadLogger.error("Error", { status: "500", error: error });
    req.flash("error", error.message);
    return res.redirect("/leads");
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
const storeLead = async (req, res) => {
  //to check the validations
  const { error, value } = validateLead(req.body);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/create/lead");
  }
  const { generatedBy, lead_id, lead_status, ...data } = value;
  data["generatedBy"] = req.user._id;
  data["lead_id"] = Date.now();
  try {
    await leadDriver
      .leadCreate(data)
      .then((lead) => {
        if (lead) req.flash("success", leadMessage.MESSAGE_SUCCESS_CREATE_LEAD);
        return res.redirect(301, "/leads");
      })
      .catch((error) => {
        leadLogger.error("Error", { status: "500", error: error });
        req.flash("error", error.message);
        return res.redirect("/create/lead");
      });
  } catch (error) {
    leadLogger.error("Error", { status: "500", error: error });
    req.flash("error", error.message);
    return res.redirect("/create/lead");
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
const leadEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const usersList = await userDriver.getAllUsersForAssignLeads();
    const actionItems = await actionItemsDriver.getActionItems();
    await leadDriver
      .getLead(id)
      .then((lead) => {
        if (lead)
          return res.render("newViews/leads/edit", {
            lead,
            usersList,
            actionItems,
            title: "Edit Lead",
            layout: true,
          });
      })
      .catch((error) => {
        leadLogger.error("Error", { status: "500", error: error });
        req.flash("error", error.message);
        return res.redirect(`/edit/lead/${id}`);
      });
  } catch (error) {
    leadLogger.error("Error", { status: "500", error: error });
    req.flash("error", error.message);
    return res.redirect(`/edit/lead/${id}`);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
const leadUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    await leadDriver
      .updateLead(req.params.id, req.body)
      .then((lead) => {
        if (!lead) {
          req.flash("error", leadMessage.MESSAGE_NO_LEAD_FOUND);
          return res.render("newViews/leads/edit", {
            title: "Edit Lead",
            layout: true,
          });
        } else {
          req.flash("success", leadMessage.MESSAGE_SUCCESS_UPDATE_LEAD);
          return res.redirect(301, "/leads");
        }
      })
      .catch((error) => {
        leadLogger.error("Error", { status: "500", error: error });
        req.flash("error", error.message);
        return res.redirect(`/edit/lead/${id}`);
      });
  } catch (error) {
    leadLogger.error("Error", { status: "500", error: error });
    req.flash("error", error.message);
    return res.redirect(`/edit/lead/${id}`);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
const estimateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await leadDriver.getLead(id);
    const actionItems = await actionItemsDriver.getActionItems();
    return res.render("newViews/estimateLead/estimateForm", {
      lead,
      actionItems,
      id,
      layout: true,
      title: "Intital Estimate",
    });
  } catch (error) {
    leadLogger.error("Error", { status: "500", error: error });
    req.flash("error", "Something went wrong.");
    return res.redirect("back");
  }
};

module.exports = {
  getAllLead,
  leadCreate,
  storeLead,
  leadEdit,
  leadUpdate,
  estimateForm,
};

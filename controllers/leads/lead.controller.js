"use strict";

const leadDriver = require("../../drivers/leads/leads.driver");
const { leadMessage } = require("../../constants");
const { validateLead } = require("../../validations/leads/lead.validation");
const userDriver = require("../../drivers/users/user.driver");
const currencyFormat = require("../../helpers/common");
const actionItemsDriver = require("../../drivers/actionItems/actionItems.driver");

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
 * @param {*} req
 * @param {*} res
 */
const getAllLead = async (req, res) => {
  try {
    let status = req.params.status ? req.params.status : "";
    const actionItems = await actionItemsDriver.getActionItems();
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
          leads["action_items"] = actionItems;
          return res.render("newViews/leads/index", {
            leads,
            currencyFormat: currencyFormat,
            title: "Lead List",
            layout: true,
          });
        }
      })
      .catch((error) => {
        req.flash("error", error);
        return res.render("newViews/leads/index", {
          title: "Lead List",
          layout: true,
        });
      });
  } catch (error) {
    req.flash("error", error.message);
    return res.render("newViews/leads/index", {
      title: "Lead List",
      layout: true,
    });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
const leadDetails = async (req, res) => {
  try {
    await leadDriver
      .getLead(req.params.id)
      .then((lead) => {
        if (!lead) {
          req.flash("error", leadMessage.MESSAGE_NO_LEAD_FOUND);
          return res.render("newViews/leads/index", {
            title: "Lead List",
            layout: true,
          });
        } else {
          return res.render("newViews/leads/lead_details", {
            lead,
            currencyFormat: currencyFormat,
            title: "Lead Details",
            layout: true,
          });
        }
      })
      .catch((error) => {
        req.flash("error", error);
        return res.render("newViews/leads/index", {
          title: "Lead List",
          layout: true,
        });
      });
  } catch (error) {
    req.flash("error", error.message);
    return res.render("newViews/leads/index", {
      title: "Lead List",
      layout: true,
    });
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
    return res.render("newViews/leads/create", {
      title: "Add New Lead",
      layout: true,
    });
  }
  const { generatedBy, lead_id, lead_status, ...data } = value;
  data["generatedBy"] = req.userId;
  data["lead_id"] = Date.now();
  try {
    await leadDriver
      .leadCreate(data)
      .then((lead) => {
        if (lead) req.flash("success", leadMessage.MESSAGE_SUCCESS_CREATE_LEAD);
        return res.redirect(301, "/leads");
      })
      .catch((error) => {
        req.flash("error", error.message);
        return res.render("newViews/leads/create", {
          title: "Add New Lead",
          layout: true,
        });
      });
  } catch (error) {
    req.flash("error", error.message);
    return res.render("newViews/leads/create", {
      title: "Add New Lead",
      layout: true,
    });
  }
};

const leadEdit = async (req, res) => {
  try {
    const usersList = await userDriver.getAllUsersForAssignLeads();
    await leadDriver
      .getLead(req.params.id)
      .then((lead) => {
        if (lead)
          return res.render("newViews/leads/edit", {
            lead,
            usersList,
            title: "Edit Lead",
            layout: true,
          });
      })
      .catch((error) => {
        req.flash("error", error.message);
        res.render("newViews/leads/edit", {
          layout: true,
          title: "Edit Lead",
        });
      });
  } catch (error) {
    req.flash("error", error.message);
    res.render("newViews/leads/edit", {
      layout: true,
      title: "Edit Lead",
    });
  }
};

const leadUpdate = async (req, res) => {
  try {
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
        req.flash("error", error.message);
        return res.render("newView/leads/edit", {
          title: "Edit Lead",
          layout: true,
        });
      });
  } catch (error) {
    req.flash("error", error.message);
    return res.render("newView/leads/edit", {
      title: "Edit Lead",
      layout: true,
    });
  }
};

const estimateForm = async (req, res) => {
  let lead = await leadDriver.getLead(req.params.id);
  const actionItems = await actionItemsDriver.getAllActionItems();
  res.render("newViews/estimatelead/estimateForm", {
    lead,
    actionItems,
    layout: true,
    title: "Initial Estimate",
  });
};

module.exports = {
  getAllLead,
  leadCreate,
  storeLead,
  leadDetails,
  leadEdit,
  leadUpdate,
  estimateForm,
};

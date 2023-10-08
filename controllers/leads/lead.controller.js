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
    user : req.user,
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

    await leadDriver
      .getAllLeads(status)
      .then((leads) => {
        if (!leads) {
          req.flash("error", leadMessage.MESSAGE_NO_LEAD_FOUND);
          return res.render("newViews/leads/index", {
            title: "Lead List",
                layout: true,
    user : req.user,
          });
        } else {
          return res.render("newViews/leads/index", {
            leads,
            currencyFormat: currencyFormat,
            title: "Lead List",
                layout: true,
    user : req.user,
          });
        }
      })
      .catch((error) => {
        req.flash("error", error);
        return res.render("newViews/leads/index", {
          title: "Lead List",
              layout: true,
    user : req.user,
        });
      });
  } catch (error) {
    req.flash("error", error.message);
    return res.render("newViews/leads/index", {
      title: "Lead List",
          layout: true,
    user : req.user,
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
    user : req.user,
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
    user : req.user,
        });
      });
  } catch (error) {
    req.flash("error", error.message);
    return res.render("newViews/leads/create", {
      title: "Add New Lead",
          layout: true,
    user : req.user,
    });
  }
};

const leadEdit = async (req, res) => {
  try {
    const usersList = await userDriver.getAllUsersForAssignLeads();
    const actionItems = await actionItemsDriver.getActionItems();
    await leadDriver
      .getLead(req.params.id)
      .then((lead) => {
        if (lead)
          return res.render("newViews/leads/edit", {
            lead,
            usersList,
            actionItems,
            title: "Edit Lead",
                layout: true,
    user : req.user,
          });
      })
      .catch((error) => {
        req.flash("error", error.message);
        res.render("newViews/leads/edit", {
              layout: true,
    user : req.user,
          title: "Edit Lead",
        });
      });
  } catch (error) {
    req.flash("error", error.message);
    res.render("newViews/leads/edit", {
          layout: true,
    user : req.user,
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
    user : req.user,
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
    user : req.user,
        });
      });
  } catch (error) {
    req.flash("error", error.message);
    return res.render("newView/leads/edit", {
      title: "Edit Lead",
          layout: true,
    user : req.user,
    });
  }
};

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
    user : req.user,
      title: "Intital Estimate",
    });
  } catch (error) {
    console.log(error);
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

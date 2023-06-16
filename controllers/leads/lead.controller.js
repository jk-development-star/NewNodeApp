"use strict";

const leadDriver = require("../../drivers/leads/leads.driver");
const { leadMessage } = require("../../constants");
const { validateLead } = require("../../validations/leads/lead.validation");
const userDriver = require("../../drivers/users/user.driver");

const leadCreate = async (req, res) => {
  const usersList = await userDriver.getAllUsers();
  res.render("newViews/leads/create", {
    usersList,
    layout: true,
    title: "Add New Lead",
  });
};

const getAllLead = async (req, res) => {
  try {
    await leadDriver
      .getAllLeads()
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
    req.flash("error", leadMessage.MESSAGE_INTERNAL_SERVER_ERROR);
    return res.render("newViews/leads/index", {
      title: "Lead List",
      layout: true,
    });
  }
};

const storeLead = async (req, res) => {
  //to check the validations
  var { error, value } = validateLead(req.body);

  if (error) {
    req.flash("error", error.details[0].message);
    return res.render("newViews/leads/create", {
      title: "Add New Lead",
      layout: true,
    });
  }
  try {
    var { generatedBy, lead_id, ...data } = value;
    data["generatedBy"] = req.userId;
    data["lead_id"] = Date.now();
    await leadDriver
      .leadCreate(data)
      .then((lead) => {
        if (lead) req.flash("success", leadMessage.MESSAGE_SUCCESS_CREATE_LEAD);
        return res.redirect(301, "/leads");
      })
      .catch((error) => {
        req.flash("error", error);
        return res.render("newViews/leads/create", {
          title: "Add New Lead",
          layout: "layout",
        });
      });
  } catch (error) {
    req.flash("error", leadMessage.MESSAGE_INTERNAL_SERVER_ERROR);
    return res.render("newViews/leads/create", {
      title: "Add New Lead",
      layout: "layout",
    });
  }
};

module.exports = {
  getAllLead,
  leadCreate,
  storeLead,
};

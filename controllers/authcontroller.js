"use strict";

const {
  initiateLogin,
  googleInitiateLogin,
} = require("../helpers/passport.authenticate");
const userSchema = require("../models/users/users.model");
const leadSchema = require("../models/leads/leads.model");
const leadDriver = require("../drivers/leads/leads.driver");

/**
 *
 * @param {*} req
 * @param {*} res
 */
const loginView = (req, res) => {
  res.render("newViews/login", {
    layout: false,
    title: "Login",
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
const dashboardView = async (req, res) => {
  const allUsers = await userSchema.count();
  const allLeads = await leadSchema.count();
  const activeLeads = await leadDriver.getActiveLead();
  const completedLeads = await leadDriver.getCompletedLead();
  const inProcessLeads = await leadDriver.getInProcessLead();
  const followUpLeads = await leadDriver.getFollowUpLead();
  const latestAddedLeads = await leadDriver.getLatestLeads();
  const closedLead = await leadDriver.getClosedLead();
  res.render("newViews/dashboard", {
    allUsers,
    allLeads,
    activeLeads,
    completedLeads,
    inProcessLeads,
    followUpLeads,
    latestAddedLeads,
    closedLead,
    title: "Admin Dashboard",
    layout: "layout",
    user: req.user,
  });
};

const login = async (passport) => {
  await initiateLogin(passport);
};

async function googleLogin(passport) {
  await googleInitiateLogin(passport);
}

module.exports = {
  loginView,
  login,
  googleLogin,
  dashboardView,
};

"use strict";

const userDriver = require("../../drivers/users/user.driver");
const { message } = require("../../constants");
const { validateSignup } = require("../../validations/users/user.validation");
const bcryptPassword = require("../../helpers/bcrypt.password");
const { userLogger } = require("../../utils/loggers");

const userCreate = (req, res) => {
  res.render("newViews/users/create", {
    layout: true,
    title: "Create New User",
  });
};

/**
 * Register or Add new user
 * @param {text} full_name user full name
 * @param {text} email user email address
 * @param {number} phone phone number
 * @param {password} poassword password combination of Capital letter, small letter, numeric and special characters
 * @param {text} role role that define the user permission
 * @returns {object} added user details
 */

const storeUser = async (req, res) => {
  //to check the validations
  var { error, value } = validateSignup(req.body);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.render("newViews/users/create", {
      title: "Create New User",
      layout: "layout",
    });
  }
  //check the duplicate email
  const duplicateUser = await userDriver.findUserByEmail(value.email);
  if (duplicateUser) {
    req.flash("error", message.MESSAGE_DUPLICATE_EMAIL);
    return res.render("newViews/users/create", {
      title: "Create New User",
      layout: "layout",
    });
  }
  //convert password in to hashed
  const hasPass = await bcryptPassword.encrypt(value.password);
  var { password, ...data } = value;
  data["password"] = hasPass;
  //create new user
  await userDriver
    .createUser(data)
    .then((user) => {
      if (user) req.flash("success", message.MESSAGE_SUCCESS_CREATE_USER);
      return res.redirect(301, "/users");
    })
    .catch((error) => {
      userLogger.error("User not Created", { status: "500", error: error });
      req.flash("error", message.MESSAGE_INTERNAL_SERVER_ERROR);
      return res.render("newViews/users/create", {
        title: "Create New User",
        layout: "layout",
      });
    });
};

// Get All users
const userList = async (req, res) => {
  await userDriver
    .getAllUsers()
    .then((users) => {
      if (users)
        return res.render("newViews/users/index", {
          users,
          title: "Users List",
          layout: true,
        });
      else req.flash("error", message.MESSAGE_NO_USER_FOUND);
      return res.render("newViews/users/index", {
        title: "Users List",
        layout: true,
      });
    })
    .catch((err) => {
      userLogger.error("Error in Listing User", {
        status: "500",
        message: err,
      });
      req.flash("error", err);
      return res.render("newViews/users/index", {
        title: "Users List",
        layout: true,
      });
    });
};

// Delete user
const deleteAUser = async (req, res) => {
  try {
    //Deleting the User
    await userDriver.deleteUser(req.params.id).then((user) => {
      if (!user) {
        req.flash("error", message.MESSAGE_NO_USER_FOUND);
        return res.render("newViews/users/index", {
          title: "Users List",
          layout: true,
        });
      } else req.flash("success", message.MESSAGE_SUCCESS_DELETE_USER);
      return res.redirect(301, "/index");
    });
  } catch (error) {
    //Logging the error
    userLogger.error("Error in deleting User", {
      status: "500",
      message: error,
    });
    req.flash("error", message.MESSAGE_INTERNAL_SERVER_ERROR);
    return res.render("newViews/users/index", {
      title: "Users List",
      layout: true,
    });
  }
};

// Edit user
const userEditView = async (req, res) => {
  try {
    // Edit the User
    await userDriver.userEdit(req.params.id).then((user) => {
      if (user)
        return res.render("newViews/users/edit", {
          user,
          title: "Edit User",
          layout: true,
        });
    });
  } catch (error) {
    //Logging the error
    userLogger.error("Error in Edit User", { status: "500", message: error });
    req.flash("error", message.MESSAGE_INTERNAL_SERVER_ERROR);
    return res.render("newViews/users/index", {
      title: "Users List",
      layout: true,
    });
  }
};

// View user profile
const userView = async (req, res) => {
  try {
    // Edit the User
    await userDriver.userEdit(req.params.id).then((userProfile) => {
      if (userProfile)
        return res.render("newViews/users/view", {
          userProfile,
          title: "User Profile",
          layout: true,
        });
    });
  } catch (error) {
    //Logging the error
    userLogger.error("Error in Edit User", { status: "500", message: error });
    req.flash("error", message.MESSAGE_INTERNAL_SERVER_ERROR);
    return res.render("newViews/users/index", {
      title: "Users List",
      layout: true,
    });
  }
};

// Update existing user details
const updateUser = async (req, res) => {
  try {
    await userDriver
      .userUpdate(req.params.id, req.body)
      .then((user) => {
        if (!user) {
          req.flash("error", message.MESSAGE_NO_USER_FOUND);
          return res.render("newViews/users/edit", {
            title: "Edit User",
            layout: true,
          });
        } else {
          req.flash("success", message.MESSAGE_SUCCESS_UPDATE_USER);
          return res.redirect(301, "/index");
        }
      })
      .catch((error) => {
        userLogger.info("Error in update user", {
          status: "500",
          message: error,
        });
        req.flash("error", error);
        return res.render("newViews/users/edit", {
          title: "Edit User",
          layout: true,
        });
      });
  } catch (error) {
    userLogger.info("Error in update user", { status: "500", message: error });
    req.flash("error", message.MESSAGE_INTERNAL_SERVER_ERROR);
    return res.render("newViews/users/edit", {
      title: "Edit User",
      layout: true,
    });
  }
};

module.exports = {
  userList,
  userCreate,
  storeUser,
  deleteAUser,
  userEditView,
  userView,
  updateUser,
};

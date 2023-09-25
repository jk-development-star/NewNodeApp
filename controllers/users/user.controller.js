"use strict";

const userDriver = require("../../drivers/users/user.driver");
const { message } = require("../../constants");
const { validateSignup } = require("../../validations/users/user.validation");
const bcryptPassword = require("../../helpers/bcrypt.password");
const { userLogger } = require("../../utils/loggers");
const currencyFormat = require("../../helpers/common");

const userCreate = (req, res) => {
  res.render("newViews/users/create", {
        layout: true,
    user : req.user,
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
      user : req.user    });
  }
  //check the duplicate email
  const duplicateUser = await userDriver.findUserByEmail(value.email);
  if (duplicateUser) {
    req.flash("error", message.MESSAGE_DUPLICATE_EMAIL);
    return res.render("newViews/users/create", {
      title: "Create New User",
layout: "layout",
      user : req.user
    });
  }
  //convert password in to hashed
  const hasPass = await bcryptPassword.encrypt(value.password);
  var { password, profile_image, ...data } = value;
  data["password"] = hasPass;
  data["profile_image"] = req.file.filename;
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
      user : req.user      });
    });
};

/**
 *
 * @param {ObjectId} generatedBy User Document unique ID
 * @param {ObjectId} assignedTo Document unique ID
 * @returns {Array} To get all the added users details with their Generated and Assigned leads info
 */
const userList = async (req, res) => {
  await userDriver
    .getAllUsers(req.userId, req.userRole)
    .then((users) => {
      if (users)
        return res.render("newViews/users/index", {
          users,
          title: "Users List",
              layout: true,
    user : req.user,
        });
      else req.flash("error", message.MESSAGE_NO_USER_FOUND);
      return res.render("newViews/users/index", {
        users: "",
        title: "Users List",
            layout: true,
    user : req.user,
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
    user : req.user,
      });
    });
};

/**
 *
 * @param {Hexadecimal} _id Document object id to match the user
 * @returns {object} With success or Error message
 */
const deleteAUser = async (req, res) => {
  try {
    //Deleting the User
    await userDriver.deleteUser(req.params.id).then((user) => {
      if (!user) {
        req.flash("error", message.MESSAGE_NO_USER_FOUND);
        return res.render("newViews/users/index", {
          title: "Users List",
              layout: true,
    user : req.user,
        });
      } else req.flash("success", message.MESSAGE_SUCCESS_DELETE_USER);
      return res.redirect(301, "/users");
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
    user : req.user,
    });
  }
};

/**
 *
 * @param {id} _id pass the user object id
 * @param {text} full_name user full name
 * @param {text} email user email address
 * @param {number} phone phone number
 * @param {text} role role that define the user permission
 * @returns {object} updated user details
 */
const userEditView = async (req, res) => {
  try {
    // Edit the User
    await userDriver.userEdit(req.params.id).then((user) => {
      if (user)
        return res.render("newViews/users/edit", {
          user,
          title: "Edit User",
              layout: true,
    user : req.user,
        });
    });
  } catch (error) {
    //Logging the error
    userLogger.error("Error in Edit User", { status: "500", message: error });
    req.flash("error", message.MESSAGE_INTERNAL_SERVER_ERROR);
    return res.render("newViews/users/index", {
      title: "Users List",
          layout: true,
    user : req.user,
    });
  }
};

/**
 *
 * @param {id} _id to view the specific user details
 * @returns {object}  selected user details to view on view page
 */
const userView = async (req, res) => {
  try {
    // Edit the User
    await userDriver.userEdit(req.params.id).then((userProfile) => {
      if (userProfile)
        return res.render("newViews/users/view", {
          userProfile,
          currencyFormat: currencyFormat,
          title: "User Profile",
              layout: true,
    user : req.user,
        });
    });
  } catch (error) {
    //Logging the error
    userLogger.error("Error in Edit User", { status: "500", message: error });
    req.flash("error", message.MESSAGE_INTERNAL_SERVER_ERROR);
    return res.render("newViews/users/index", {
      title: "Users List",
          layout: true,
    user : req.user,
    });
  }
};

/**
 *
 * @param {id} _id pass the user object id
 * @param {text} full_name user full name
 * @param {text} email user email address
 * @param {number} phone phone number
 * @param {text} role role that define the user permission
 * @returns {object} updated user details
 */
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
    user : req.user,
          });
        } else {
          req.flash("success", message.MESSAGE_SUCCESS_UPDATE_USER);
          return res.redirect(301, "/users");
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
    user : req.user,
        });
      });
  } catch (error) {
    userLogger.info("Error in update user", { status: "500", message: error });
    req.flash("error", message.MESSAGE_INTERNAL_SERVER_ERROR);
    return res.render("newViews/users/edit", {
      title: "Edit User",
          layout: true,
    user : req.user,
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

"use strict";

const userDriver = require("../../drivers/users/user.driver");
const { message } = require("../../constants");
const { validateSignup } = require("../../validations/users/user.validation");
const bcryptPassword = require("../../helpers/bcrypt.password");
const { userLogger } = require("../../utils/loggers");
const currencyFormat = require("../../helpers/common");
const tokenDriver = require("../../drivers/users/token.driver");
const crypto = require("crypto");
const { addMinutes } = require("../../helpers/common");
const { sendEmail } = require("../../config/email.config");
const fs = require("fs");

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
    req.flash("error", error.details);
    return res.redirect("/create");
  }

  //check the duplicate email
  const duplicateUser = await userDriver.findUserByEmail(value.email);
  if (duplicateUser) {
    req.flash("error", message.MESSAGE_DUPLICATE_EMAIL);
    return res.redirect("/create");
  }
  //convert password in to hashed
  const hasPass = await bcryptPassword.encrypt(value.password);
  const { password, ...data } = value;
  data["password"] = hasPass;
  data["profile_image"] = req.file.filename;

  //create new user and send email verification link on entered email address
  await userDriver
    .createUser(data)
    .then((user) => {
      if (user) {
        let tokenData = {
          user_id: user._id,
          token: crypto.randomBytes(32).toString("hex"),
          token_expire: addMinutes(new Date(), 10),
        };
        tokenDriver.createToken(tokenData).then((token) => {
          const content = {
            message: `http://localhost:8081/verify/${user._id}/${token.token}`,
            name: user.full_name,
            team: "TechMRB",
            templatePath: "views/newViews/email/email.verification.ejs",
          };
          const subject = "Verify Email";
          sendEmail(user.email, subject, content);
        });
      }
      req.flash("success", message.MESSAGE_SUCCESS_CREATE_USER);
      return res.redirect(301, "/users");
    })
    .catch((error) => {
      userLogger.error("User not Created", { status: "500", error: error });
      req.flash("error", error.message);
      res.redirect("/create");
    });
};

/**
 * Verify the registered user email address
 * @param {string} user_id user id
 * @param {string} token generated token
 * @returns {object} verified user detail
 */
const verifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    // find user by the user id
    const user = await userDriver.findUserById(id);
    if (!user) return res.status(400).send("Invalid link");
    const token = await tokenDriver.findToken(user._id);
    // to check current time is greater than the allowed time for link expiration
    if (Date.now() > token.token_expire) {
      req.flash("error", message.MESSAGE_EMAIL_VERIFICATION_LINK_EXPIRED);
      return res.redirect("/contact-us");
    }
    // if verification is success change verified true to false
    const data = {
      verified: true,
    };
    // update user details
    await userDriver.userUpdate(id, data).then((user) => {
      if (user) {
        tokenDriver.removeToken(token._id);
        req.flash("success", "Email verified successfully");
        return res.redirect(301, "/");
      }
    });
  } catch (err) {
    userLogger.error("Error in verification", {
      status: "500",
      message: err.message,
    });
    req.flash("error", err.message);
    return res.redirect("/contact-us");
  }
};

/**
 *
 * @param {ObjectId} generatedBy User Document unique ID
 * @param {ObjectId} assignedTo Document unique ID
 * @returns {Array} To get all the added users details with their Generated and Assigned leads info
 */
const userList = async (req, res) => {
  await userDriver
    .getAllUsers(req.user.id, req.user.role)
    .then((users) => {
      if (users)
        return res.render("newViews/users/index", {
          users,
          title: "Users List",
          layout: true,
        });
      else req.flash("error", message.MESSAGE_NO_USER_FOUND);
      return res.redirect("/users");
    })
    .catch((err) => {
      userLogger.error("Error in Listing User", {
        status: "500",
        message: err,
      });
      req.flash("error", err);
      return res.redirect("/users");
    });
};

/**
 *
 * @param {Hexadecimal} _id Document object id to match the user
 * @returns {object} With success or Error message
 */
const deleteAUser = async (req, res) => {
  try {
    const { id } = req.params;
    //Deleting the User
    await userDriver.deleteUser(id).then((user) => {
      if (!user) {
        req.flash("error", message.MESSAGE_NO_USER_FOUND);
        return res.redirect("/users");
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
    return res.redirect("/users");
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
    const { id } = req.params;
    // Edit the User
    await userDriver.userEdit(id).then((user) => {
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
    return res.redirect(`/edit/${id}`);
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
    await userDriver.userView(req.params.id).then((userProfile) => {
      if (userProfile)
        return res.render("newViews/users/view", {
          userProfile,
          currencyFormat: currencyFormat,
          title: "View User",
          layout: true,
        });
    });
  } catch (error) {
    //Logging the error
    userLogger.error("Error in Edit User", { status: "500", message: error });
    req.flash("error", message.MESSAGE_INTERNAL_SERVER_ERROR);
    return res.redirect("/users");
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
    const { id } = req.params;
    const { value, ...data } = req.body;
    if (req.file) {
      data["profile_image"] = req.file.filename;
      await userDriver
        .userUpdate(id, data)
        .then((user) => {
          if (!user) {
            req.flash("error", message.MESSAGE_NO_USER_FOUND);
            return res.redirect("back");
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
          return res.redirect("back");
        });
    } else {
      await userDriver
        .userUpdate(id, data)
        .then((user) => {
          if (!user) {
            req.flash("error", message.MESSAGE_NO_USER_FOUND);
            return res.redirect("back");
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
          return res.redirect("back");
        });
    }
  } catch (error) {
    userLogger.info("Error in update user", { status: "500", message: error });
    req.flash("error", error.message);
    return res.redirect("back");
  }
};

// User Profile Functions

/**
 *
 * @param {id} _id to view the specific user details
 * @returns {object}  selected user details to view on view page
 */
const userProfileView = async (req, res) => {
  try {
    // Edit the User
    await userDriver.userView(req.params.id).then((userProfile) => {
      if (userProfile)
        return res.render("newViews/users/profile", {
          userProfile,
          currencyFormat: currencyFormat,
          title: "User Profile",
          layout: true,
        });
    });
  } catch (error) {
    //Logging the error
    userLogger.error("Error in User", { status: "500", message: error });
    req.flash("error", message.MESSAGE_INTERNAL_SERVER_ERROR);
    return res.redirect("back");
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
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    await userDriver
      .userUpdate(id, req.body)
      .then((user) => {
        if (!user) {
          req.flash("error", message.MESSAGE_NO_USER_FOUND);
          return res.redirect("back");
        } else {
          req.flash("success", message.MESSAGE_PROFILE_UPDATE_SUCCESS);
          return res.redirect(301, `/profile/${id}`);
        }
      })
      .catch((error) => {
        userLogger.info("Error in update user profile", {
          status: "500",
          message: error,
        });
        req.flash("error", error);
        return res.redirect(`/profile/${id}`);
      });
  } catch (error) {
    userLogger.info("Error in update user profile", {
      status: "500",
      message: error,
    });
    req.flash("error", message.MESSAGE_INTERNAL_SERVER_ERROR);
    return res.redirect(`/profile/${id}`);
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
  verifyUser,
  updateProfile,
  userProfileView,
};

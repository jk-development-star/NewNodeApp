"use strict";

const userDriver = require("../../../drivers/users/user.driver");
const {
  validateForgotEmail,
  validateResetPassword,
} = require("../../../validations/users/user.validation");
const bcryptPassword = require("../../../helpers/bcrypt.password");
const { message } = require("../../../constants");
const { sendEmail } = require("../../../config/email.config");
const crypto = require("crypto");
const forgotTokenDriver = require("../../../drivers/users/forgotPassword/forgot.token.driver");
const { addMinutes } = require("../../../helpers/common");

const forgotPasswordView = (req, res) => {
  res.render("newViews/users/forgotPassword/forgotPassword", {
    title: "Forgot Password",
    layout: false,
  });
};

const forgotPasswordEmail = async (req, res) => {
  const { error, value } = validateForgotEmail(req.body);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/forgot-password");
  }
  const user = await userDriver.findUserByEmail(value.email);
  if (!user) {
    req.flash("error", message.MESSAGE_ENTERED_EMAIL_NOT_FOUND);
    return res.redirect("/forgot-password");
  } else {
    let tokenData = {
      user_id: user._id,
      token: crypto.randomBytes(32).toString("hex"),
      token_expire: addMinutes(new Date(), 10),
    };
    forgotTokenDriver
      .findForgotToken(user._id)
      .then((tokens) => {
        if (tokens) {
          tokens.map((token) => forgotTokenDriver.removeToken(token._id));
          forgotTokenDriver
            .createForgotToken(tokenData)
            .then((token) => {
              const content = {
                message: `http://localhost:8081/reset-password/${user._id}/${token.token}`,
                name: user.full_name,
                team: "TechMRB",
                templatePath: "views/newViews/email/email.forgot.password.ejs",
              };
              const subject = "Forgot Password Email";
              sendEmail(value.email, subject, content);
              req.flash("success", message.MESSAGE_EMAIL_FORGOT_SENT);
              return res.redirect("/forgot-password");
            })
            .catch((error) => {
              req.flash("error", error.message);
              return res.redirect("back");
            });
        }
      })
      .catch((error) => {
        req.flash("error", error.message);
        return res.redirect("back");
      });
  }
};

const resetNewPasswordView = async (req, res) => {
  const { id } = req.params;
  const user = await userDriver.findUserById(id);
  if (!user) {
    req.flash("error", message.MESSAGE_NO_USER_FOUND);
    return res.redirect("/contact-us");
  }
  const token = await forgotTokenDriver.findForgotToken(user._id);
  console.log(token);
  if (Date.now() > token.token_expire) {
    req.flash("error", message.MESSAGE_EMAIL_VERIFICATION_LINK_EXPIRED);
    return res.redirect("/contact-us");
  } else {
    res.render("newViews/users/forgotPassword/recoverPassword", {
      title: "Reset Password",
      layout: false,
      id: id,
      token: token.token,
    });
  }
};

const resetNewPassword = async (req, res) => {
  try {
    const { id, forgotToken } = req.params;
    const { error, value } = validateResetPassword(req.body);
    if (error) {
      req.flash("error", error.details[0].message);
      return res.redirect("back");
    }
    const user = await userDriver.findUserById(id);
    if (!user) {
      req.flash("error", message.MESSAGE_NO_USER_FOUND);
      return res.redirect("/contact-us");
    }
    const token = await forgotTokenDriver.findForgotToken(id);
    if (Date.now() > token.token_expire) {
      req.flash("error", message.MESSAGE_EMAIL_VERIFICATION_LINK_EXPIRED);
      return res.redirect("/contact-us");
    } else if (value.confirm_password === value.password) {
      const hasPass = await bcryptPassword.encrypt(value.password);
      const data = {
        password: hasPass,
      };
      await userDriver.updateUserPassword(id, data).then((user) => {
        if (user) {
          forgotTokenDriver.removeToken(token._id);
          req.flash("success", message.MESSAGE_PASSWORD_RESET_SUCCESS);
          return res.redirect("/");
        } else {
          req.flash("error", message.MESSAGE_INTERNAL_SERVER_ERROR);
          return res.redirect(`/reset-password/${id}/${forgotToken}`);
        }
      });
    } else {
      req.flash("error", message.MESSAGE_PASSWORD_CONFIRM_PASSWORD_NOT_MATCH);
      return res.redirect(`/reset-password/${id}/${forgotToken}`);
    }
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
};

module.exports = {
  forgotPasswordView,
  forgotPasswordEmail,
  resetNewPasswordView,
  resetNewPassword,
};

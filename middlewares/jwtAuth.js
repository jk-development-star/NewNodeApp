"use strict";

const jwt = require("jsonwebtoken");
const { message } = require("../constants/index");
const { userLogger } = require("../utils/loggers");

/**
 * Function for JsonWebToken verification
 * @param {obj} req, res, next
 * @returns {json} obj
 */
const checkJWTAuth = async (req, res, next) => {
  try {
    const token = req.cookies.auth.token;
    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_KEY);
        req.userId = await user.id;
        req.userRole = await user.role;
        next();
      } catch (error) {
        req.flash("error", message.MESSAGE_USER_NOT_AUTHORIZED);
        return res.redirect("/");
      }
    } else {
      req.flash("error", message.MESSAGE_NO_TOKEN_PROVIDED);
      return res.redirect("/");
    }
  } catch (error) {
    req.flash("error", "Something went wrong, Please try again!!");
    userLogger.error("Error in Authorizing the User", {
      status: "500",
      message: error,
    });
    return res.redirect("back");
  }
};

module.exports = checkJWTAuth;

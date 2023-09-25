"use strict";
const { message } = require("../constants/index");
const { userLogger } = require("../utils/loggers");

/**
 * Function for JsonWebToken verification
 * @param {obj} req, res, next
 * @returns {json} obj
 */
async function checkPassportAuth(req,res,next){
    try {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", message.MESSAGE_USER_NOT_AUTHORIZED);
        return res.redirect('/');
        
    } catch (error) {
        req.flash("error", "Something went wrong, Please try again!!");
        userLogger.error("Error in Authorizing the User", {
          status: "500",
          message: error,
        });
        return res.redirect("back");
    }
}

module.exports = {checkPassportAuth}
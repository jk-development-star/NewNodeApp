"use strict";

const Joi = require("joi");

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const passwordPattern =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/;
const stringPassswordError =
  "Password length must be 8 to 20 characters long and password must contains a combination of uppercase, lowercase letter, number, and a special character are required.";
const mobilePattern = /^(\+\d{1,3}[- ]?)?\d{10}$/;
const stringMobileError = "Enter a valid Mobile Number";
const stringDateError = "Date should be less than today's date";

const userSchemaValidate = Joi.object({
  full_name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required().label("Email"),
  phone: Joi.string()
    .trim()
    .regex(mobilePattern)
    .rule({ message: stringMobileError })
    .length(10)
    .required(),
  role: Joi.string().trim().required(),
  password: Joi.string()
    .trim()
    .regex(passwordPattern)
    .rule({ message: stringPassswordError })
    .required()
    .label("Password"),
  confirm_password: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "Password and Confirm Password does not match" }),
  profile_image: Joi.any(),
});

const forgotEmailValidate = Joi.object({
  email: Joi.string().trim().email().required().label("Email"),
});

const resetPasswordValidate = Joi.object({
  password: Joi.string()
    .trim()
    .regex(passwordPattern)
    .rule({ message: stringPassswordError })
    .required()
    .label("Password"),
  confirm_password: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "Password and Confirm Password does not match" }),
});
exports.validateForgotEmail = validator(forgotEmailValidate);
exports.validateSignup = validator(userSchemaValidate);
exports.validateResetPassword = validator(resetPasswordValidate);

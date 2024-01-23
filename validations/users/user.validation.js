const Joi = require("joi");

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const passwordPattern =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/;
const stringPassswordError =
  "Your password must be at least 8 characters long, contain at least one number and have a mixture of uppercase ,  lowercase letters, and special characters";
const mobilePattern = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
const stringMobileError = "Enter a valid Mobile Number";

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

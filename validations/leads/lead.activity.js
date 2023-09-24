"use strict";

const Joi = require("joi");

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const leadActivityValidation = Joi.object({
  activity_comment: Joi.string().trim().required(),
  activity_type: Joi.string().trim().required(),
  files: Joi.optional().allow(null),
});

exports.validateLeadActivity = validator(leadActivityValidation);

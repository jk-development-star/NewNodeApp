"use strict";

const Joi = require("joi");

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const taskSchemaValidation = Joi.object({
  task_name: Joi.string().trim().required(),
  task_type: Joi.string().trim().required(),
  task_description: Joi.string().trim().required(),
  updated_by: Joi.optional().allow(null),
  files: Joi.optional().allow(null),
});

exports.validateTask = validator(taskSchemaValidation);

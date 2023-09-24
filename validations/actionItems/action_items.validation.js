"use strict";

const Joi = require("joi");

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const actionItemSchemaValidation = Joi.object({
  action_item_name: Joi.string().trim().required(),
  action_item_completion_days: Joi.string().trim().required(),
  action_item_type_of_work: Joi.string().trim().required(),
  unit_charge: Joi.string().trim().required(),
  action_item_description: Joi.string().trim().required(),
  action_item_updated_by: Joi.optional().allow(null),
  action_item_type: Joi.string().trim().required(),
  action_item_tasks: Joi.allow(null),
  files: Joi.optional().allow(null),
});

exports.validateActionItems = validator(actionItemSchemaValidation);

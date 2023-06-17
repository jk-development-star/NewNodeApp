"use strict";

const Joi = require("joi");

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const actionItemSchemaValidation = Joi.object({
  action_item_name: Joi.string().trim().required(),
  action_item_start_date: Joi.date().required(),
  action_item_end_date: Joi.date().required(),
  action_item_predecessor: Joi.string().optional().allow(null),
  action_item_successor: Joi.string().optional().allow(null),
  action_item_completion_days: Joi.string().trim().required(),
  action_item_type_of_work: Joi.string().trim().required(),
  action_item_description: Joi.string().trim().required(),
  action_item_updated_by: Joi.optional().allow(null),
  action_item_type: Joi.string().trim().required(),
  action_item_tasks: Joi.optional().allow(null),
  files: Joi.optional().allow(null),
});

exports.validateActionItems = validator(actionItemSchemaValidation);

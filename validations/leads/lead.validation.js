'use strict'

const Joi = require('joi')

const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false })

const mobilePattern = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/
const stringMobileError = "Enter a valid Mobile Number"

const leadSchemaValidation = Joi.object({
    customer_name: Joi.string().trim().required(),
    customer_email: Joi.string().trim().email().label("Email").required(),
    customer_phone: Joi.string().trim().regex(mobilePattern).rule({ message: stringMobileError }).length(10).required(),
    customer_address: Joi.string().trim().required(),
    customer_city: Joi.string().trim().required(),
    customer_state: Joi.string().trim().required(),
    customer_country: Joi.string().trim().required(),
    customer_zipcode: Joi.string().trim().min(5).max(6).required(),
    lead_remark_followup: Joi.string().trim().required(),
    lead_budget: Joi.string().trim().required(),
    covered_area: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    assignedTo: Joi.required(),
    lead_status: Joi.string().required(),
    files: Joi.optional().allow(null)
});

exports.validateLead = validator(leadSchemaValidation)
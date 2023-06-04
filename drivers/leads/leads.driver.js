'use strict'

const leadSchema = require('../../models/leads/leads.model')


exports.leadCreate = async (data) => {
    const newLead = await leadSchema.create(data);
    const { generatedBy, lead_id, __v, ...result } = newLead._doc;
    return result;
}

exports.getAllLeads = async () => {
    const leads = await leadSchema.find().select(['-__v']).populate("generatedBy").populate("assignedTo").exec();
    return leads


}
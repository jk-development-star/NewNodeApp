'use strict'

const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    role_name: { type: String, required: true }
})

module.exports = mongoose.model('Roles', roleSchema)
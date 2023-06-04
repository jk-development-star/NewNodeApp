'use strict'

const { message } = require('../constants/index')
const responseCode = require('../constants/responseCode.constant')
const { userLogger } = require('../utils/loggers')

const userAuth = async (req, res, next) => {
    try {
        if (req.role === "Admin" || req.role === "SuperAdmin") return res.status(405).json(responseCode.code(message.MESSAGE_USER_NOT_ALLOWED_TO_DELETE))
        next()
    } catch (error) {
        userLogger.error('Something went wrong', { status: '500', message: error });
        return res.status(500).json(responseCode.code500(message.MESSAGE_INTERNAL_SERVER_ERROR))
    }
}

module.exports = userAuth
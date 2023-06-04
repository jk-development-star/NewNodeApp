'use strict'

const jwt = require('jsonwebtoken')
const { message } = require('../constants/index')
const responseCode = require('../constants/responseCode.constant')
const { userLogger } = require('../utils/loggers')

/**
 * Function for JsonWebToken verification
 * @param {obj} req, res, next
 * @returns {json} obj
 */
const checkJWTAuth = async (req, res, next) => {
    try {
        const userDetail = req.session.user;
        const authorization = userDetail.accessToken;
        if (authorization) {
            try {
                const user = jwt.verify(authorization, process.env.JWT_KEY)
                req.user_id = await user.id
                req.role = await user.role
                next();
            } catch (error) {
                return res.redirect('/');
            }
        } else {
            req.flash('error', res.status(400).json(responseCode.code400(message.MESSAGE_NO_TOKEN_PROVIDED)))
            return res.redirect('/');
        }
    } catch (error) {
        userLogger.error('Error in Authorizing the User', { status: '500', message: error });
        req.flash('error', error)
        return res.redirect('/');
    }
}

module.exports = checkJWTAuth
'use strict'

const jwt = require("jsonwebtoken")

exports.generateAccessToken = async (payload) => {
    const accessToken = await jwt.sign(payload, process.env.JWT_KEY, { expiresIn: process.env.TOKEN_LIFE });
    return accessToken;
}
'use strict'


const bcrypt = require("bcrypt")

exports.encrypt = async (data) => {
    const saltRounds = 10;
    const hashedPwd = await bcrypt.hash(data, saltRounds);
    return hashedPwd
}
exports.encryptSeedPassword = (data) => {
    const saltRounds = 10;
    const hashedPwd = bcrypt.hash(data, saltRounds);
    return hashedPwd
}

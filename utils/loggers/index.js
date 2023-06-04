const userLogger = require('./user');
const loginLogger = require('./login');
const merchantLogger = require('./merchant/merchant')
const branchLogger = require('./merchant/branch')
const accountLogger = require('./merchant/account')
const employeeLogger = require('./merchant/employee')

module.exports = {
     userLogger,
     loginLogger,
     merchantLogger,
     branchLogger,
     accountLogger,
     employeeLogger
}
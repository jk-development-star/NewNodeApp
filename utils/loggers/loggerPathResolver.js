const moment = require('moment')
const path = 'src'
const getErrorPath = (model)=> path + `/logs/error/${model}/${moment().format('MM-DD-YYYY')}.log`;
const getLogPath = (model)=> path + `/logs/${model}/${moment().format('MM-DD-YYYY')}.log`

module.exports = {
    getErrorPath,
    getLogPath
}
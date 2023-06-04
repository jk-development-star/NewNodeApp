const { createLogger, transports } = require("winston");
const { getLogPath, getErrorPath } = require("../loggerPathResolver");
const { format } = require('../loggerFormater');
const winston = require('winston');


const info = winston.createLogger({
    format,
    transports: [
      new transports.File({
        level: 'info',
        filename: getLogPath('merchant'),
      })
    ],
  });
  const error = winston.createLogger({
    format,
    transports: [
      new transports.File({
        level: 'error',
        filename: getErrorPath('merchant'),
      })
    ],
  });
  
  const merchantLogger = {
    info:(...params)=>{info.info(...params)},
    error:(...params)=>{error.error(...params)}
  }
  
  
  
  module.exports = merchantLogger;
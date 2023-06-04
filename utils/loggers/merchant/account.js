const { createLogger, transports } = require("winston");
const { getLogPath, getErrorPath } = require("../loggerPathResolver.js");
const { format } = require('../loggerFormater');
const winston = require('winston');

const info = winston.createLogger({
    format,
    transports: [
      new transports.File({
        level: 'info',
        filename: getLogPath('account'),
      })
    ],
  });
  const error = winston.createLogger({
    format,
    transports: [
      new transports.File({
        level: 'error',
        filename: getErrorPath('account'),
      })
    ],
  });
  
  const accountLogger = {
    info:(...params)=>{info.info(...params)},
    error:(...params)=>{error.error(...params)}
  }
  
  
  
  module.exports = accountLogger;
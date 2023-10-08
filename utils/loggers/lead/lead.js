const { createLogger, transports } = require("winston");
const { getLogPath, getErrorPath } = require("../loggerPathResolver.js");
const { format } = require("../loggerFormater.js");
const winston = require("winston");

const info = winston.createLogger({
  format,
  transports: [
    new transports.File({
      level: "info",
      filename: getLogPath("lead"),
    }),
  ],
});
const error = winston.createLogger({
  format,
  transports: [
    new transports.File({
      level: "error",
      filename: getErrorPath("lead"),
    }),
  ],
});

const leadLogger = {
  info: (...params) => {
    info.info(...params);
  },
  error: (...params) => {
    error.error(...params);
  },
};

module.exports = leadLogger;

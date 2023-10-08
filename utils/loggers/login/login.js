const { createLogger, transports } = require("winston");
const { format } = require("../loggerFormater");
const { getLogPath, getErrorPath } = require("../loggerPathResolver");
const winston = require("winston");

const info = winston.createLogger({
  format,
  transports: [
    new transports.File({
      level: "info",
      filename: getLogPath("login"),
    }),
  ],
});

const error = winston.createLogger({
  format,
  transports: [
    new transports.File({
      level: "error",
      filename: getErrorPath("login"),
    }),
  ],
});

const loginLogger = {
  info: (...params) => {
    info.info(...params);
  },
  error: (...params) => {
    error.error(...params);
  },
};

module.exports = loginLogger;

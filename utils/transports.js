const transports = {
  LOCAL: [],
  STAGING: [],
  PRODUCTION: [],
};

const env = process.env.ENVIRONMENT;

module.exports = transports[env];


const transports = {
    DEV:[],
    STAGING:[],
    PRODUCTION:[]
};

const env = process.env.ENVIRONMENT;

module.exports =  transports[env];
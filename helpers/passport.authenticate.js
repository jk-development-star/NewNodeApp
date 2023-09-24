"use strict";
const Users = require("../models/users/users.model");
const userDriver = require("../drivers/users/user.driver");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const LocalStrategy = require('passport-local');
const { message } = require("../constants/index");
const { userLogger } = require("../utils/loggers");

async function initiateLogin(passport){
    

    passport.use(new LocalStrategy(async function verify(username, password, done) {
        try {
            let data  = await userDriver.findUserByEmail(username);
            if(data !== null){
                const validPassword = await bcrypt.compare(password, data.password);
                if (!validPassword) {
                    return done(null , false , {message:message.MESSAGE_EMAIL_OR_PASSWORD_NOT_MATCHED})
                };
                return done(null, data);
            }else{
                return done(null , false , {message:message.MESSAGE_NO_USER_FOUND});
            }
        } catch (error) {
            
        }
            
    }));
    
    
    passport.serializeUser(function(user, done) {
        // process.nextTick(function() {
          done(null,user);
        // });
    });
      
    passport.deserializeUser(function(id, done) {
        // process.nextTick(function() {
          return done(null, id);
        // });
    });    

}


module.exports ={initiateLogin};

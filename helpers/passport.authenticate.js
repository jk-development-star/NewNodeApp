"use strict";
const userDriver = require("../drivers/users/user.driver");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const LocalStrategy = require("passport-local");
const { message } = require("../constants/index");

const initiateLogin = async (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async function verify(username, password, done) {
        try {
          let data = await userDriver.findUserByEmail(username);
          if (data !== null) {
            const validPassword = await bcrypt.compare(password, data.password);
            if (!validPassword) {
              return done(null, false, {
                message: message.MESSAGE_INVALID_PASSWORD,
              });
            }
            return done(null, data);
          } else {
            return done(null, false, {
              message: message.MESSAGE_ENTERED_EMAIL_NOT_FOUND,
            });
          }
        } catch (error) {
          return done(null, false, {
            message: message.MESSAGE_INTERNAL_SERVER_ERROR,
          });
        }
      }
    )
  );
  passport.serializeUser(function (user, done) {
    // process.nextTick(function() {
    done(null, user);
    // });
  });

  passport.deserializeUser(function (id, done) {
    // process.nextTick(function() {
    return done(null, id);
    // });
  });
};

module.exports = { initiateLogin };

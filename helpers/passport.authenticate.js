"use strict";
const userDriver = require("../drivers/users/user.driver");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
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

const googleInitiateLogin = async (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID, // Your Credentials here.
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Credentials here.
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
      },
      async function (request, accessToken, refreshToken, profile, done) {
        let userData = await userDriver.findUserByEmail(profile.email);
        if (userData !== null) {
          console.log("already a user");
          return done(null, userData);
        } else {
          let data = {
            full_name: profile.displayName,
            email: profile.email,
            password: profile.sub,
            email_verified: profile.email_verified,
            provider: profile.provider,
            provider_id: profile.id,
            phone: "7878789898",
            role: "Admin",
          };
          let saltRounds = 10;
          let hashedPassword = await bcrypt.hash(data.password, saltRounds);

          data.password = hashedPassword;
          await Users.insertMany(data);
          console.log("Data Inserted");
          return done(null, data);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser(function (id, done) {
    done(null, id);
  });
};

module.exports = { initiateLogin, googleInitiateLogin };

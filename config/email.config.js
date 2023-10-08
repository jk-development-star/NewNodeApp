const nodemailer = require("nodemailer");
require("dotenv").config();
const ejs = require("ejs");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
let from = `TechMRB <${process.env.EMAIL_USERNAME}>`;
const sendEmail = async (email, subject, content) => {
  try {
    ejs.renderFile(content.templatePath, { email, content }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        var mailOptions = {
          from: from,
          to: email,
          subject: subject,
          html: data,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          } else {
            console.log("email sent sucessfully");
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const receiveEmail = async (subject, content) => {
  console.log(subject, content);
  try {
    ejs.renderFile(content.templatePath, { content }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        var mailOptions1 = {
          from: content.email,
          to: process.env.EMAIL_USERNAME,
          subject: subject,
          html: data,
        };
        transporter.sendMail(mailOptions1, (error, info) => {
          if (error) {
            return console.log(error);
          } else {
            console.log("email sent sucessfully");
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendEmail, receiveEmail };

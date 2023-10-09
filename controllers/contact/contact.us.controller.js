"use strict";

const { receiveEmail } = require("../../config/email.config");
const contactUsView = (req, res) => {
  res.render("newViews/contact/contactUs", {
    title: "Contact Us",
    layout: false,
  });
};

const contactUs = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    console.log(req.body);
    const content = {
      templatePath: "views/newViews/email/email.expire.link.ejs",
      name: name,
      subject: subject,
      message: message,
      email: email,
    };
    const emailReceive = await receiveEmail(subject, content);
    if (emailReceive) {
      req.flash("success", "Email sent successfully, we will contact you soon");
      return res.redirect("/contact-us");
    } else {
      req.flash("error", "Email not sent, Something went wrong");
      return res.redirect("/contact-us");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { contactUsView, contactUs };

"use strict";

const forgotTokenSchema = require("../../../models/users/forgot.pass.model");

exports.createForgotToken = async (data) => {
  const forgotToken = await forgotTokenSchema.create(data);
  return forgotToken;
};

exports.findForgotToken = async (id) => {
  const token = await forgotTokenSchema.find({ user_id: id });
  // .sort({ createdAt: -1 });
  return token;
};

exports.removeToken = async (id) => {
  const token = await forgotTokenSchema.findOneAndDelete({ _id: id });
  return token;
};

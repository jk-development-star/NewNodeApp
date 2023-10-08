"use strict";

const tokenSchema = require("../../models/users/token.model");

exports.createToken = async (data) => {
  const newToken = await tokenSchema.create(data);
  return newToken;
};

exports.findToken = async (id) => {
  const token = await tokenSchema.findOne({ user_id: id });
  return token;
};

exports.removeToken = async (id) => {
  const token = await tokenSchema.findOneAndDelete({ _id: id });
  return token;
};

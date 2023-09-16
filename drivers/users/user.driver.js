"use strict";

const mongoose = require("mongoose");
const userSchema = require("../../models/users/users.model");

exports.createUser = async (data) => {
  const newUser = await userSchema.create(data);
  const { password, profile_image, __v, ...result } = newUser._doc;
  return result;
};

exports.findUserByEmail = async (data) => {
  const user = await userSchema.findOne({ email: data });
  return user;
};

exports.getAllUsersForAssignLeads = async () => {
  const allUsers = await userSchema.find();
  return allUsers;
};

exports.getAllUsers = async (id, role) => {
  if (role === "Admin") {
    const users = await userSchema.aggregate([
      {
        $lookup: {
          from: "leads",
          localField: "_id",
          foreignField: "generatedBy",
          as: "generatedLeads",
        },
      },
      {
        $lookup: {
          from: "leads",
          localField: "_id",
          foreignField: "assignedTo",
          as: "assignedLeads",
        },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "created_by",
          as: "createdTasks",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    return users;
  } else {
    const users = await userSchema.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "leads",
          localField: "_id",
          foreignField: "generatedBy",
          as: "generatedLeads",
        },
      },
      {
        $lookup: {
          from: "leads",
          localField: "_id",
          foreignField: "assignedTo",
          as: "assignedLeads",
        },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "created_by",
          as: "createdTasks",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    return users;
  }
};

exports.userUpdate = async (id, data) => {
  const user = await userSchema.findByIdAndUpdate(
    id,
    {
      $set: data,
    },
    { new: true }
  );
  const { password, __v, ...result } = user._doc;
  return result;
};

exports.deleteUser = async (id) => {
  const user = await userSchema.findOneAndDelete({ _id: id });
  return user;
};

exports.userEdit = async (id) => {
  const usersWithLeadsInfo = await userSchema.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "leads",
        localField: "_id",
        foreignField: "generatedBy",
        as: "generatedLeads",
      },
    },
    {
      $lookup: {
        from: "leads",
        localField: "_id",
        foreignField: "assignedTo",
        as: "assignedLeads",
      },
    },
  ]);
  return usersWithLeadsInfo;
};

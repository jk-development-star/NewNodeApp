'use strict'

const mongoose = require('mongoose')
const userSchema = require('../../models/users/users.model')

exports.createUser = async (data) => {
    const newUser = await userSchema.create(data)
    const { password, __v, ...result } = newUser._doc
    return result
}

exports.findUserByEmail = async (data) => {
    const user = await userSchema.findOne({ email: data })
    return user;
}

exports.getAllUsers = async () => {

    const usersWithLeadsInfo = await userSchema.aggregate([
        {
            $lookup:
            {
                from: "leads",
                localField: "_id",
                foreignField: "generatedBy",
                as: "generatedLeads"
            },
        },
        {
            $lookup:
            {
                from: "leads",
                localField: "_id",
                foreignField: "assignedTo",
                as: "assignedLeads"
            },
        },
    ]);
    return usersWithLeadsInfo;
    // const users = usersWithLeadsInfo.limit(limit * 1).skip((page - 1) * limit).select(['-password', '-__v']).exec();
    // const count = await usersWithLeadsInfo.count();
    // return {
    //     users,
    //     totalPage: Math.ceil(count / limit),
    //     currentPage: page
    // }
}

exports.userUpdate = async (id, data) => {
    const user = await userSchema.findByIdAndUpdate(id, {
        $set: data
    }, { new: true });
    const { password, __v, ...result } = user._doc
    return result;
}

exports.deleteUser = async (id) => {
    const user = await userSchema.findOneAndDelete({ _id: id });
    return user;
}

exports.userEdit = async (id) => {
    const usersWithLeadsInfo = await userSchema.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup:
            {
                from: "leads",
                localField: "_id",
                foreignField: "generatedBy",
                as: "generatedLeads"
            },
        },
        {
            $lookup:
            {
                from: "leads",
                localField: "_id",
                foreignField: "assignedTo",
                as: "assignedLeads"
            },
        },

    ]);
    return usersWithLeadsInfo


    // const user = await userSchema.findById({ _id: id });
    // return user;
}
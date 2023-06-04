const User = require("../models/users/users.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
};
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/mvc_test_app", options);
    console.log("Connected to mongodb");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

(async () => {
  let data = {
    full_name: "Jitendra Kumar",
    email: "jitendra@yopmail.com",
    password: "Jitendra@123",
    phone: "08168623107",
    role: "Admin",
  };
  let saltRounds = 10;
  let hashedPassword = await bcrypt.hash(data.password, saltRounds);

  data.password = hashedPassword;

  const seedDatabase = async () => {
    try {
      await User.insertMany(data);
      console.log("Seeding successful");
    } catch (error) {
      console.log(error);
    }
  };

  seedDatabase().then(() => {
    mongoose.connection.close();
  });
})();

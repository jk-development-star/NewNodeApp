const User = require('./models/users/users.model');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const connectDB = async () => {
    const options = {
        family: 4,
    }
    try {
        await mongoose.connect("mongodb://localhost:27017/mvc_test_app", options);
        console.log('Connected to mongodb');
    } catch (error) {
        console.log(error);
    }
};

connectDB();

(async () => {
    let data = {
        full_name: 'Jitendra ',
        email: 'admin@yopmail.com',
        password: 'Admin1234',
        phone: '7878789898',
        role: 'Admin',
    };
    let saltRounds = 10;
    let hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword;
    const seedDatabase = async () => {
        try {
            await User.insertMany(data);
            console.log('Seeding successful');
        } catch (error) {
            console.log(error);
        }
    };

    seedDatabase().then(() => {
        mongoose.connection.close();
    });
})();
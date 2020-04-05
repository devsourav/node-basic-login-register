// Imports
const mongoose = require('mongoose');

// MongoDB connection string 
mongoose.connect('mongodb://admin:admin123@ds053874.mlab.com:53874/razordb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User schema
const User = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    contact: String,
    user_role_id: String,
    created_date: Date
});

// Users collection
const Users = mongoose.model('users', User);

// Save user to DB
const createUser = (user, callback) => {
    Users(user).save((err, data) => {
        callback(err ? false : data);
    });
}

// Find user from DB 
const getUser = (option, callback) => {
    Users.find(option, (err, data) => {
        callback(err ? false : data);
    });
}

// Get document count of user collection
const getUserCount = (option, callback) => {
    Users.find(option).countDocuments({}, (err, count) => {
        callback(err ? -1 : count);
    });
}

// Remove all documents from user collection
const removeAllUser = (callback) => {
    Users.deleteMany({}, (err) => {
        callback(err ? false : true);
    });
}

// Exports
module.exports = {
    createUser,
    getUser,
    getUserCount,
    removeAllUser
}
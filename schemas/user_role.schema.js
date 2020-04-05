// Imports
const mongoose = require('mongoose');

// MongoDB connection string 
mongoose.connect('mongodb://admin:admin123@ds053874.mlab.com:53874/razordb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// MongoDB connection status
var db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongodb!'));

// User_Role schema
const UserRole = new mongoose.Schema({
    role: String,
    permission: Object
});

// User_Roles collection
const UserRoles = mongoose.model('User_roles', UserRole);

// Save user_role 
const createUserRole = (role, callback) => {
    UserRoles(role).save((err, data) => {
        callback(err ? false : data);
    });
}

// Find user_role by id 
const getUserRoleById = (id, callback) => {
    UserRoles.find({ _id: id }, (err, data) => {
        callback(err ? false : data);
    });
}

// Get document count of user_roles collection 
const role_count = (callback) => {
    UserRoles.countDocuments({}, (err, count) => {
        callback(err ? -1 : count);
    });
}

// Remove all documents from user_roles collection
const removeAllRoles = (callback) => {
    UserRoles.deleteMany({}, (err) => {
        callback(err ? false : true);
    });
}

// Exports
module.exports = {
    createUserRole,
    getUserRoleById,
    role_count,
    removeAllRoles
}
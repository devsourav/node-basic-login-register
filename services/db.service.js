// Imports
const UserSchema = require('../schemas/user.schema');
const UserRoleSchema = require('../schemas/user_role.schema');

// Return user_role object
function createRole(option) {
    return user_role = {
        role: option ? 'admin' : 'member',
        permission: {
            remove: option,
            update: option,
            view: true
        }
    }
}

// Create new user function
function createUser(userData) {
    return new Promise((resolve, reject) => {
        // Call to add user_role in user & return user
        let createUserFunc = (user_data, user_role) => {
            if (user_data) {
                let _user = Object.assign({}, user_data._doc);
                _user.user_role = user_role;
                Object.assign(_user, { user_role });
                resolve(_user);
            } else {
                reject('Failed to create account');
            }
        }

        // Call to create user with user_role Id
        let createUserRoleFunc = (user_role) => {
            let user = userData;
            if (user_role) {
                Object.assign(user, { user_role_id: user_role._id, created_date: new Date() });
                UserSchema.createUser(user, user_data => createUserFunc(user_data, user_role));
            } else {
                reject('Failed to create role for user');
            }
        }

        // Check count and call to create user_role 
        let roleCountFunc = (count) => {
            let role;
            if (count == 0) {
                role = createRole(true);
            } else if (count > 0) {
                role = createRole(false);
            } else {
                reject(false);
            }
            UserRoleSchema.createUserRole(role, createUserRoleFunc);
        }

        // Check user exists or not 
        // If exists then, get user_role document count
        let userListFunc = (userList) => {
            userList ? reject('Email already exists!') : UserRoleSchema.role_count(roleCountFunc);
        }

        // Find user by email Id
        UserSchema.getUserCount({ email: userData.email }, userListFunc);
    });
}

// For login
// Find user by email Id & check user credential
function findUser(credential) {
    return new Promise((resolve, reject) => {
        // Call to get user by email Id
        UserSchema.getUser({ email: credential.email }, (user) => {
            if (user && user[0]) {
                user[0].password === credential.password ? resolve(user[0]) : reject('Either the username or password is incorrect.');
            } else {
                reject('Failed to find user!')
            }
        });
    })
}


// Get user list
function getUserList() {
    return new Promise((resolve, reject) => {
        // Call to add user_role in user & return user list
        let userRoleFun = (_user, user_role, userList, count, i) => {
            if (user_role && user_role[0]) {
                Object.assign(_user, { user_role: user_role[0]._doc });
                userList.push(_user);
                if (i === count - 1) {
                    resolve(userList);
                }
            }
        }

        // Loop user list & call to add user_role
        let userListFunc = async (users, count) => {
            let userList = [] = [];
            let i = 0;
            for await (const userData of users) {
                let _user = Object.assign({}, userData._doc);
                UserRoleSchema.getUserRoleById(_user.user_role_id, (user_role) => userRoleFun(_user, user_role, userList, count, i++));
            }
        }

        // Call to get all users
        let userCountFunc = (count) => {
            if (!count) reject(false);
            UserSchema.getUser({}, users => userListFunc(users, count));
        }

        // Call to get user count
        UserSchema.getUserCount({}, userCountFunc);
    });
}

// Call to remove all users and user_role
function removeAllUsersAndRoles() {
    return new Promise((resolve, reject) => {
        // Remove all users
        UserSchema.removeAllUser((status) => {
            if (!status) reject('Failed to remove user.');
            // Remove all user_role
            UserRoleSchema.removeAllRoles((status) => {
                if (!status) reject('Failed to remove user.');
                resolve('Successfully removed all users and roles.');
            });
        });
    });
}

// Exports
module.exports = {
    createUser,
    findUser,
    getUserList,
    removeAllUsersAndRoles
};
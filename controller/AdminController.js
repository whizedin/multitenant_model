const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

// Find the Admin by ID
const getAdminById = function (id, callback) {
    Admin.findById(id, callback);
}

// Find the Admin by Its username
const getAdminByUsername = function (username, callback) {
    const query = {
        username: username
    }
    Admin.findOne(query, callback);
}

// to Register the Admin
const addAdmin = function (newAdmin, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            if (err) throw err;
            newAdmin.password = hash;
            newAdmin.save(callback);
        });
    });
}

// Compare Password
const comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}

module.exports = {
    comparePassword,
    addAdmin,
    getAdminById,
    getAdminByUsername
};
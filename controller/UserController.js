const bcrypt = require('bcryptjs');
const User = require('../models/User');

    const  getUserById = function (id, callback) {
        User.findById(id, callback);
    }

    const getUserByUsername = function (username, callback) {
        const query = {
                username: username
            }
            User.findOne(query, callback);
        }
    
    const addUser = function (newUser, callback) {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save(callback);
                });
            });
        }
    
    const comparePassword = function (password, hash, callback) {
            bcrypt.compare(password, hash, (err, isMatch) => {
                if (err) throw err;
                callback(null, isMatch);
            });
        };

module.exports ={
    getUserById,
    comparePassword,
    addUser,
    getUserByUsername
};
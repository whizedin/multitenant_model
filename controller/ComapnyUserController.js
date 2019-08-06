const bcrypt = require('bcryptjs');
const CompanyUser = require('../models/CompanyUser');

const  getCompanyUserById = function (id, callback) {
    CompanyUser.findById(id, callback);
}

const getCompanyUserByUsername = function (username, callback) {
    const query = {
            username: username
        }
        CompanyUser.findOne(query, callback);
    }  

const addCompanyUser = function (newCompanyUser, callback) { 
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newCompanyUser.password, salt, (err, hash) => {
                if (err) throw err;
                newCompanyUser.password = hash;
                newCompanyUser.save(callback);
            });
        });
    }

const comparePassword = function (password, hash, callback) {
        bcrypt.compare(password, hash, (err, isMatch) => {
            if (err) throw err;
            callback(null, isMatch);
        });
    };


module.exports = {
getCompanyUserById,
comparePassword,
addCompanyUser,
getCompanyUserByUsername
};
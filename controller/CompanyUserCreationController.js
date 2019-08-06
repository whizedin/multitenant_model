const bcrypt = require('bcryptjs');
const CompanyUserCreation = require('../models/CompanyUserCreation');

const  getCompanyUserCreationById = function (id, callback) {
    CompanyUserCreation.findById(id, callback);
}

const getCompanyUserCreationByUsername = function (username, callback) {
    const query = {
            username: username
        }
        CompanyUserCreation.findOne(query, callback);
    }   

const addCompanyUserCreation = function (newCompanyUserCreation, callback) { 
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newCompanyUserCreation.password, salt, (err, hash) => {
                if (err) throw err;
                newCompanyUserCreation.password = hash;
                newCompanyUserCreation.save(callback);
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
getCompanyUserCreationById,
comparePassword,
addCompanyUserCreation,
getCompanyUserCreationByUsername
};
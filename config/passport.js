const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const Admin = require('../models/Admin');
const config = require('../config/database');
const AdminController = require('../controller/AdminController');
const UserController = require('../controller/UserController');  
const CompanyUserController = require('../controller/ComapnyUserController');

// To authtenticate the User by JWT Startegy
module.exports = (userType, passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        if (userType == 'admin') {
            AdminController.getAdminById(jwt_payload.data._id, (err, user) => {
                if (err) return done(err, false);
                if (user) return done(null, user);
                return done(null, false);
            });
        }
        if (userType == 'users') {
            UserController.getUserById(jwt_payload.data._id, (err, user) => {
                if (err) return done(err, false);
                if (user) return done(null, user);
                return done(null, false);
            });
        }
        if(userType == 'companyuser') {
            CompanyUserController.getCompanyUserById(jwt_payload.data._id,(err,user) =>{
                if (err) return done(err,false);
                if (user) return done(null, user);
                return done(null,false);
            });
        }
        if(checkEmp == 'companyemp'){
            CompanyUserCreationController.getCompanyUserById(jwt_payload.data._id,(err,user) =>{
                if (err) return done(err,false);
                if (user) return done(null, user);
                return done(null,false);
            });
        }
    }));  
}
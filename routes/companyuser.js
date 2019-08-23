const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const CompanyUser = require('../models/CompanyUser');
const config = require('../config/database');
const CompanyUserController = require('../controller/ComapnyUserController');
const jwtDecode = require('jwt-decode');
const CompanyUserCreation = require('../models/CompanyUserCreation');
const CompanyUserCreationController = require('../controller/CompanyUserCreationController');
//const password11 = require('../generatePassword');
const async = require('async');
const crypto = require('crypto')
const nodemailer = require('nodemailer');
const generator = require('generate-password');

//console.log(password11);
//console.log(CompanyUserCreationController);
const app = express();

router.post('/register',(req,res)=>{
    let newCompanyUser = new CompanyUser({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        company_name:req.body.company_name,
        created_at:Date.parse(req.body.created_at),
        updated_at:Date.parse(req.body.updated_at),
        active:"true",
        contact_number:req.body.contact_number,
        role:'1'
    });
    CompanyUserController.addCompanyUser(newCompanyUser, (err, user) => {
        if (err) {
            console.log(err);
            let message = "";
            if (err.errors.username) message = "Username is already taken. ";
            if (err.errors.email) message += "Email already exists.";
            return res.json({
                success: false,
                message
            });
        } else {
            return res.json({
                success: true,
                message: "CompanyUser/Company registration is successful."
            });
        }
    });
});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    CompanyUserController.getCompanyUserByUsername(username, (err, companyuser) => {
        if (err) throw err;
        if (!companyuser) {
            return res.json({
                success: false,
                message: "CompanyUser not found."
            });
        }

        CompanyUserController.comparePassword(password, companyuser.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({
                    type: "companyuser",
                    data: {
                        _id: companyuser._id,
                        username: companyuser.username,
                        name: companyuser.name,
                        email: companyuser.email,
                        contact_number: companyuser.contact_number,
                        role:companyuser.role,
                        active:companyuser.active,
                        created_at:companyuser.created_at,
                        updated_at:companyuser.updated_at,
                        company_name:companyuser.company_name
                    }
                }, config.secret, {
                    expiresIn: 604800 // for 1 week time in milliseconds
                });
                return res.json({
                    success: true,
                    token: "JWT " + token
                });
            } else {
                return res.json({
                    success: true,
                    message: "Wrong Password."
                });
            }
        });
    });
});

   const checkUserType = function (req, res, next) {
    const userType = req.originalUrl.split('/')[2];
    // Bring in the passport authentication starategy
    require('./config/passport')(userType, passport);
    //next();
};

const checkRole = function(req,res,next){
    const header = req.headers['authorization'];
    let decoded = jwtDecode(header);
    const decodedid = decoded.data._id;
    if( typeof header !== 'undefined' ){
        let role = decoded.data.role;
        if(role == '2'){
            res.json({msg:'!!forbidden path taken that shall result in your death!!'})
        }
        else{
            next();
        }
    }
};

app.use(checkRole);

router.route('/:id1/user/:id2')
   .get((req,res) => {
        CompanyUserCreation.findById(req.params.id2)
                           .then(CompanyUserCreation => res.json(CompanyUserCreation))
                           .catch(err => res.status(400).json('Error: ' + err))
   })
   .put((req,res) => {
        CompanyUserCreation.findByIdAndUpdate(req.params.id2)
                           .then(
                                CompanyUserCreation =>{
                                    CompanyUserCreation.name = req.body.name;
                                    CompanyUserCreation.email = req.body.email;
                                    CompanyUserCreation.password = req.body.password;
                                    CompanyUserCreation.username = req.body.username;
                                    CompanyUserCreation.contact = req.body.contact;
                                    CompanyUserCreation.companyId = req.body.companyId;
                                    CompanyUserCreation.role = req.body.role;

                                    CompanyUserCreation.save()
                                                       .then(() => res.json('Company employee information updated!'))
                                                       .catch(err => res.status(400).json('Error: ' + err));
                                }
                                
                           )
                           .catch(err => res.status(400).json('Error: ' + err))
   })
   .delete((req,res) => {
    CompanyUserCreation.findByIdAndDelete(req.params.id2)
                       .then( () => res.json({msg:'successfully deleted!!'}))
                       .catch(err => res.status(400).json('Error: ' + err))
   })

router.route('/:id/user/create',[checkRole,passport.authenticate('jwt',{session:false})])
      .post((req,res) => {
        console.log(password11);
        var password11 = generator.generate({
          length: 10,
          numbers: true
      });
    let newComanyUserCreation = new CompanyUserCreation({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        contact: req.body.contact,
        password:password11,
        job_profile: req.body.job_profil,
        companyId:req.body.companyId,
        role:'2'
    });
    CompanyUserCreationController.addCompanyUserCreation(newComanyUserCreation, (err, user) => {
        if (err) {
            console.log(err);
            let message = "";
            if (err.errors.username) message = "Username is already taken. ";
            if (err.errors.email) message += "Email already exists.";
            return res.json({
                success: false,
                message
            });
        } else {
            return res.json({
                success: true,
                message: "CompanyAdmin created CompanyEmp successfully!!."
            });
        }
    });
   });

router.post('/companyemp/login',(req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    CompanyUserCreationController.getCompanyUserCreationByUsername(username, (err, companyusercreation) => {
        if (err) throw err;
        if (!companyusercreation) {
            return res.json({
                success: false,
                message: "CompanyUser not found."
            });
        }

        CompanyUserCreationController.comparePassword(password, companyusercreation.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({
                    type: "companyusercreation",
                    data: {
                        _id: companyusercreation._id,
                        username: companyusercreation.username,
                        name: companyusercreation.name,
                        email: companyusercreation.email,
                        contact_number: companyusercreation.contact_number,
                        //role:companyuser.role,
                        //active:companyuser.active,
                        //created_at:companyuser.created_at,
                        //updated_at:companyuser.updated_at,
                        //company_name:companyuser.company_name
                    }
                }, config.secret, {
                    expiresIn: 604800 // for 1 week time in milliseconds
                });
                return res.json({
                    success: true,
                    token: "JWT " + token
                });
            } else {
                return res.json({
                    success: true,
                    message: "Wrong Password."
                });
            }
        });
    });
});

router.post('/companyemp/forgot',(req,res) => {
    
    async.waterfall([
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done) {
          CompanyUserCreation.findOne({ email: req.body.email }, function(err, companyusercreation) {
            if (!companyusercreation) {
              //req.flash('error', 'No account with that email address exists.');
              return res.json({msg:'error at finding company employee!!'});
            }
    
            companyusercreation.resetPasswordToken = token;
            companyusercreation.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
            companyusercreation.save(function(err) {
              done(err, token, companyusercreation);
            });
          });
        },
        function(token, companyusercreation, done) {
          var smtpTransport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'hadihusain112@gmail.com',
              pass: '******'
            }
          });
          var mailOptions = {
            to: 'hadi@whizedin.com',
            from: 'hadihusain112@gmail.com',
            subject: 'Node.js Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'http://' + req.headers.host + '/reset/' + token + '\n\n' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            //req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            res.json({msg:'successfully sent password reset email !!'})
            done(err, 'done');
          });
        }
      ], function(err) {
        if (err) return next(err);
        //res.redirect('/forgot');
        res.json({msg:'error at sending email to employee'})
      });

});

router.post('/companyemp/reset/:token',(req,res) =>{
  

    console.log('working not going further');
    async.waterfall([
        function(done) {
          CompanyUserCreation.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, companyusercreation) {
            if (!companyusercreation) {
              //req.flash('error', 'Password reset token is invalid or has expired.');
              return res.json({msg:'Password reset token is invalid or has expired.'});
            }
    
            companyusercreation.password = req.body.password;
            companyusercreation.resetPasswordToken = undefined;
            companyusercreation.resetPasswordExpires = undefined;
    
            companyusercreation.save(function(err) {
              req.logIn(companyusercreation, function(err) {
                done(err, companyusercreation);
              });
            });
          });
        },
        function(companyusercreation, done) {
          var smtpTransport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'hadihusain112@gmail.com',
              pass: '*******'
            }
          });
          var mailOptions = {
            to: 'hadi@whizedin.com',
            from: 'hadihusain112@gmail.com',
            subject: 'Your password has been changed',
            text: 'Hello,\n\n' +
              'This is a confirmation that the password for your account ' + companyusercreation.email + ' has just been changed.\n'
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            //req.flash('success', 'Success! Your password has been changed.');
            done(err);
          });
        }
      ], function(err) {
        //res.redirect('/');
        res.json({msg:'error going to main page'});
      });
});


module.exports = router;
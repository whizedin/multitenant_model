const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// User Schema  
const CompanyUserCreationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: { 
        type: String,
        unique: true,
        index: true, 
        required: true
    },
    username: {
        type: String,
        unique: true,  
        required: true 
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    companyId:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        required:false
    },
    resetPasswordToken:String,
    resetPasswordExpires:Date,
});

CompanyUserCreationSchema.plugin(uniqueValidator);

const CompanyUserCreation = module.exports = mongoose.model('CompanyUserCreation', CompanyUserCreationSchema);

module.exports = CompanyUserCreation;
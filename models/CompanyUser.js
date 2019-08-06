const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const CompanyUserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    company_name:{
        type:String,
        required:true
    },
    username:{
        unique:true,  
        type:String,
        required:true
    },
    contact_number:{
        type:String,
        required:true
    },
    email:{
        unique:true,
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now,
        required:false
    },
    updated_at:{
        type:Date,
        default:Date.now,
        required:false
    },
    active:{
        type:Boolean,
        default:true,
        required:false
    },
    role:{
        type:Number,
        required:false
    }
});


CompanyUserSchema.plugin(uniqueValidator); 

const CompanyUser = module.exports =  mongoose.model('CompanyUser',CompanyUserSchema);

module.exports = CompanyUser;

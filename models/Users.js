const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    first_name:{
        unique: true,
        required: true,
        type:String,
    },
    last_name:{
        unique: true,
        required: true,
        type:String,
    },
    email:{
        unique: true,
        required: true,
        type:String,
    },
    username:{
        unique: true,
        required: true,
        type:String,
    },
    password:{
        required: true,
        type:String
    },
},
{timestamps: true} 
);

module.exports = mongoose.model('User', userSchema)
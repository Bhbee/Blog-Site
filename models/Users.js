const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    first_name:{
        required: true,
        type:String,
    },
    last_name:{
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
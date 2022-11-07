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

UserSchema.pre(
    'save',
    async function (next) {
        const user = this;
        const hash = await bcrypt.hash(this.password, 10);

        this.password = hash;
        next();
    }
);

UserSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
}

module.exports = mongoose.model('User', userSchema)
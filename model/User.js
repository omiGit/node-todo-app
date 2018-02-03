//import { access } from 'fs';


const {Mongoose} = require('../db/mongoose');
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new Mongoose.Schema({
    email:{
        type:String,
        trim:true,
        minlength:5,
        required:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:"{VALUE} is no a valid function"
        }
    },
    password:{
        type:String,
        minlength:6,
        required:true
    },
    tonkens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});
userSchema.methods.toJSON = function(){
    const user = this;
    const userObj = user.toObject();
    return {id:userObj._id,token:userObj.email};
}

userSchema.methods.getToken = function() {
    const user = this
    const access = "auth";
    const token = jwt.sign({_id:user._id,access},'omkar2153').toString();
    user.tonkens.push({access,token});
    return user.save().then(()=>{
        return token;
    })
}
const User = Mongoose.model('User',userSchema);
exports.User = User;
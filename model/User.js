//import { request } from 'https';

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
    tokens:[{
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
    return {id:userObj._id,email:userObj.email};
}

userSchema.methods.getToken = function() {
    const user = this
    const access = "auth";
    const token = jwt.sign({_id:user._id,access},'omkar2153').toString();
    user.tokens.push({access,token});
    return user.save().then(()=>{
        return token;
    })
}

userSchema.statics.findByToken= function(token){
    const user = this;
    try{
        const decode = jwt.verify(token,'omkar2153');
        return user.findOne({
            '_id':decode._id,
            'tokens.token':token,
            'tokens.access':decode.access
        }); 
    }
    catch(e){
        return Promise.reject("System Error");
    }
};
const User = Mongoose.model('User',userSchema);
exports.User = User;
const {Mongoose} = require('../db/mongoose');
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
const getHashPassword = (password)=>{
    return new Promise ((resolve,reject)=>{
        bcrypt.genSalt(10,(err,salt)=>{
            if(!err){bcrypt.hash(password,salt,(err,hash)=>{
                //return new Promise((resolve,reject)=>{
                    if(!err){
                        console.log("not error");
                       resolve(hash);
                    }
                    else{
                        console.log("error 64");
                     reject("System Error");
                    }
               //
            })}
            else{
                return Promise.reject("System Error");
            }
        });
    });
}
userSchema.pre('save',function(next){
    const user = this;
    if(user.isModified('password')){
        getHashPassword(user.password).then(hash=>{
            user.password = hash;
            next();
        }).catch((e)=>console.log("System Error: Password could not hashed"));
    }
    else{
        next();
    }
})

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
        return Promise.reject("Invalid Request");
    }
};

userSchema.statics.validateEmailPassword = function({email,password}){
    const user = this;
    return user.findOne({email}).then(user=>{
         if(user){
            return new Promise((resolve,reject)=>{bcrypt.compare(password,user.password,(err,res)=>{
                if(res){
                    resolve(user);
                }
                else{
                    return reject("Please enter valid username and password");
                }
            })
        });
        }
        else{
            return Promise.reject("Please enter valid username and password");
        }
    });
    
}
const User = Mongoose.model('User',userSchema);
exports.User = User;
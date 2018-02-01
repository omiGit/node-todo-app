const {Mongoose} = require('../db/mongoose');
const User = Mongoose.model('User',{
    name:{
        type:String,
        trim:true,
        minlength:3,
        required:true
    },
    email:{
        type:String,
        trim:true,
        minlength:5,
        required:true
    }
})

exports.User = User;
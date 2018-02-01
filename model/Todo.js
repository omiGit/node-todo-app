const {Mongoose} = require("../db/mongoose");
const Todo = Mongoose.model('Todo',{
    task:{
        type:String,
        required:true,
        trim: true
    },
    completed:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type: Number,
        default:null
    }
});
exports.Todo = Todo;
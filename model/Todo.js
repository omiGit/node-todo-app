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
    completedAt:{
        type: Number,
        default:null
    },
    _creator:{
        type: Mongoose.Schema.Types.ObjectId,
        required:true
    }
});
exports.Todo = Todo;
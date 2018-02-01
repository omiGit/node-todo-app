const { User } = require("../model/User");
const ID = "5a72181c959abd211e54a83b";

User.findById(ID).then(doc=>{
    console.log(doc);
})
User.find({_id:ID}).then(doc=>{
    console.log(doc);
})
User.findOne({_id:ID}).then(doc=>{
    console.log(doc);
})
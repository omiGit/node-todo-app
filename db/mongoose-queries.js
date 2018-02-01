const { User } = require("../model/User");

User.findById(ID).then(doc=>{
    console.log(doc);
})
User.find({_id:ID}).then(doc=>{
    console.log(doc);
})
User.findOne({_id:ID}).then(doc=>{
    console.log(doc);
})
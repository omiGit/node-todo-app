const { User } = require("../model/User");
const {Todo} = require("../model/Todo");

// User.findById(ID).then(doc=>{
//     console.log(doc);
// })
// User.find({_id:ID}).then(doc=>{
//     console.log(doc);
// })
// User.findOne({_id:ID}).then(doc=>{
//     console.log(doc);
// })

Todo.findOneAndRemove("5a7389e7491f3e48e0af547a").then(doc=>{
    console.log(doc);
})

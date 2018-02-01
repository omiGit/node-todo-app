//import { ObjectID } from '../../../../../../../home/omi/.cache/typescript/2.6/node_modules/@types/bson';

const {ObjectID=ObjectId} = require('mongodb');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

//const {Mongoose} = require('./db/mongoose');
const {Todo} = require("./model/Todo");
const {User} = require("./model/User");

const port = process.env.PORT || 3000

app.use(bodyParser.json());
app.post("/todos",(req,res)=>{
    new Todo({
        task:req.body.task,
    }).save().then(doc=>{
        console.log(JSON.stringify(doc,undefined,2));
        res.send(doc);
    })
    .catch(e=>{
        console.log(e);
        res.status(400).send(e);
    });
})

app.get("/todos",(req,res)=>{
    Todo.find().then(doc=>{
        res.send(doc);
    }).catch(e=>res.send(e));
});

app.get("/todos/:id",(req,res)=>{
    const {id} = req.params;
    if(!ObjectID.isValid(id)){
        res.status(400).send({e:"Id is not valid"});
    }
    else{
        Todo.findById(id).then(doc=>{
            res.send(doc);
        }).catch(e=>res.status(400).send({e:"Some error was ocurred"}));
    }
})

app.listen(port,()=>console.log("server Starting At",port));
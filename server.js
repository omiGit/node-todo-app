

const _ = require("lodash");
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
    }).catch(e=>res.send({error:e._message}));
});

app.get("/todos/:id",(req,res)=>{
    const {id} = req.params;
    if(!ObjectID.isValid(id)){
        res.status(400).send({e:"Id is not valid"});
    }
    else{
        Todo.findById(id).then(doc=>{
            if(!doc){
                res.send([]);
            }
            else{res.send(doc);}
        }).catch(e=>res.status(400).send({e:"Some error was ocurred"}));
    }
})


app.delete("/todos/:id",(req,res)=>{
    const {id} = req.params;
    if(!ObjectID.isValid(id)){
        res.status(400).send({error:"Id is not valid"});
    }
    else{
        Todo.findByIdAndRemove(id).then(doc=>{
              if(!doc){
                res.status(400).send({});
              }
              else{
                  res.send(doc);
              }
        }).catch(e=>res.status(400).send({error:"Some error was occured"}));
    }
});

app.post("/users",(req,res)=>{
    let body = {...req.body}
    if(body.hasOwnProperty("email") && body.hasOwnProperty('password')){
        const {email,password} = body;
        if(typeof email === "string" && typeof password === "string"){
            const user  = new User({email,password});
            user.save().then(doc=>{
                console.log("user saved");
                return user.getToken();
            }).then((token)=>res.header('x-auth',token).send(user))
            .catch(e=>res.status(400).send({error:e._message ||"user exist" } ));
        }
        else{
            res.status(400).send({error:"Please Enter Valid email and password"});
        }
    }
    else{
        res.status(400).send({error:"Invalid Request"});
    }
});

app.patch("/todos/:id",(req,res)=>{
    const {id}= req.params;
    if(!ObjectID.isValid(id)){
        res.status(400).send({error:"Id is not valid"});
    }
    else{
        //let body = _pick(req.body,['task','completed']);
        let body = {...req.body};
        if(typeof body.completed === "boolean" && body.completed && body.hasOwnProperty('completed')){
           body.completedAt = new Date().getTime(); 
        }
        else{
            body.completed = false;
            body.completedAt = null;
            // 
        }
        Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then(doc=>{
            if(!doc){
                res.status(400).send({error:"Todo does not exist"})
            }
            else{res.send(doc);}
        }).catch(e=>res.status(400).send({error:"Invalid Data Type"}));
    }
});

app.listen(port,()=>console.log("server Starting At",port));
const _ = require("lodash");
const {ObjectID=ObjectId} = require('mongodb');
const express = require("express");
const bodyParser = require("body-parser");
const {authentication} = require("./middlewears/authentication");
const app = express();

//const {Mongoose} = require('./db/mongoose');
const {Todo} = require("./model/Todo");
const {User} = require("./model/User");

const port = process.env.PORT || 3000

app.use(bodyParser.json());
app.post("/todos",authentication,(req,res)=>{
    new Todo({
        task:req.body.task,
        _creator: req.user._id
    }).save().then(doc=>{
        res.send(doc);
    })
    .catch(e=>{
        console.log(e);
        res.status(400).send(e);
    });
})
app.get("/todos",authentication,(req,res)=>{
    Todo.find({_creator:req.user._id}).then(doc=>{
        res.send(doc);
    }).catch(e=>res.send({error:e._message}));
});
app.get("/todos/:id",authentication,(req,res)=>{
    const {id} = req.params;
    if(!ObjectID.isValid(id)){
        res.status(400).send({e:"Id is not valid"});
    }
    else{
        Todo.findOne({_id:id,_creator:req.user._id}).then(doc=>{
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
        Todo.findOneAndRemove({_id:id,_creator:req.user._id}).then(doc=>{
              if(!doc){
                res.status(400).send({});
              }
              else{
                  res.send(doc);
              }
        }).catch(e=>res.status(400).send({error:"Some error was occured"}));
    }
});
const checkEmailPassword = ({email, password})=>{
    return typeof email === "string" && typeof password === "string" && email.length >= 6 && password.length >= 6 
}

app.post("/users",(req,res)=>{
    let body = {...req.body}
    if(body.hasOwnProperty("email") && body.hasOwnProperty('password')){
        const {email,password} = body;
        if(body){
            const user  = new User({email,password});
            user.save().then(doc=>{
                return user.getToken();
            }).then((token)=>res.header('x-auth',token).send(user))
            .catch(e=>{console.log("error:",e);res.status(400).send({error:e._message ||"user exist" } )});
        }
        else{
            res.status(400).send({error:"Please Enter Valid email and password"});
        }
    }
    else{
        res.status(400).send({error:"Invalid Request"});
    }
});


app.get('/users/me',authentication,(req,res)=>{
    return res.send(req.user);
});

app.post('/users/login',(req,res)=>{
    if(checkEmailPassword(req.body)){
        User.validateEmailPassword(req.body).then((user)=>{
             return user.getToken().then(token=>{
                res.header('x-auth',token).send(user);
            });
        }).catch((e)=>{
            res.status(401).send({error:e});
        });
    }
    else{
        res.status(401).send({error:"Please Enter Valid Email & Password"});
    }
});
app.patch("/todos/:id",(req,res)=>{
    const {id}= req.params;
    if(!ObjectID.isValid(id)){
        res.status(400).send({error:"Id is not valid"});
    }
    else{
        let body = {...req.body};
        if(typeof body.completed === "boolean" && body.completed && body.hasOwnProperty('completed')){
           body.completedAt = new Date().getTime(); 
        }
        else{
            body.completed = false;
            body.completedAt = null;
            
        }
        Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then(doc=>{
            if(!doc){
                res.status(400).send({error:"Todo does not exist"})
            }
            else{res.send(doc);}
        }).catch(e=>res.status(400).send({error:"Invalid Data Type"}));
    }
});

app.delete("/users/me/logout",authentication,(req,res)=>{
    req.user.removeToken(req.token)
    .then(()=>res.send())
    .catch((e)=>res.status(400).send({error:e}));
})

app.listen(port,()=>console.log("server Starting At",port));
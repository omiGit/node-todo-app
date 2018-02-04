const {User} = require("../model/User");
const authentication = (req,res,next)=>{
    const token = req.header('x-auth');
    User.findByToken(token).then((user)=>{
        if(!user){
           return Promise.reject("Unauthorised Access");
        }
        
        req.user = user;
        req.token = token;
        next();
    }).catch((e)=>res.status(401).send({error:e}));
}

module.exports= {authentication};
const exp=require("express")
const mongoose = require("mongoose"); 
const User = require('./models/User')
const jwt=require('jsonwebtoken')
const app=exp()

//we can put port number, database address in env file
//at end of project  put this jwt secret key in .env

const jwtSectet="appleballcatdog"

app.post('/register',async (req,res)=>{
    const {username,password} =req.body;
    const createdUser=await User.create({username,password});
    jwt.sign({userId:createdUser._id},jwtSectet, (err,token)=>{
        if(err) throw err;
        res.cookie('token',token).status(201),json('done!');
    })
})


mongoose.connect("mongodb://localhost:27017/chathive")
.then(app.listen(1234,()=>console.log(`server listening on port 1234...`)))
.catch(err=>console.log("error in DB connection",err))

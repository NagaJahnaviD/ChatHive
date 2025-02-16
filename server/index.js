const exp=require("express")
const mongoose = require("mongoose"); 
const User = require('./models/User')
const jwt=require('jsonwebtoken')
const app=exp()
const cors=require('cors')
const cookieParser = require("cookie-parser");

//we can put port number, database address in env file
//at end of project  put this jwt secret key in .env

const jwtSecret="appleballcatdog"

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173' // can be included in .env as client_url
}))

app.use(cookieParser())
app.use(exp.json())

app.get('/profile', (req,res)=>{
    const token = req.cookies?.token;
    if(token){
        jwt.verify(token, jwtSecret, {}, (err, userData)=>{
            if (err) throw err;
            // const {id, username}= userData;
            res.json({userData});
        })
    } else {
        res.status(401).json('no token')
    }
    
})

app.post('/register',async (req,res)=>{
    const {username,password} =req.body;
    try{
        const createdUser=await User.create({username,password});
        jwt.sign({userId:createdUser._id,username},jwtSecret,{}, (err,token)=>{
            if(err) throw err;
            res.cookie('token',token, {sameSite:'none', secure:true}).status(201).json({
                id: createdUser._id,
            });
        })
    } catch(err){
        if (err) throw err;
        res.status(500).json('error')
    }
    
})



mongoose.connect("mongodb://localhost:27017/chathive")
.then(app.listen(1234,()=>console.log(`server listening on port 1234...`)))
.catch(err=>console.log("error in DB connection",err))


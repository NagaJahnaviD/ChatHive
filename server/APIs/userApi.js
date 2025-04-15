const exp=require('express')
const userApp= exp.Router()
const User= require('../models/User')
const expressAsyncHandler= require('express-async-handler')

async function createNewUser(req,res){
    let newUser=req.body;
    let userInDB=await User.findOne({email:newUser.email});
    if(userInDB!==null){
        res.status(200).send({message:'User already exists. Invalid email'})
    }else{
        let newUserDoc= await new User(newUser).save();
        res.status(201).send({message:'User created successfully', payload:newUserDoc});
    }
}

userApp.post("/user", expressAsyncHandler(createNewUser));

module.exports=userApp;
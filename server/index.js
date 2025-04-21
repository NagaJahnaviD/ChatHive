const exp=require("express")
const app=exp()
const mongoose = require("mongoose"); 

const cors=require('cors')
app.use(cors())
app.use(exp.json())
  
const userApp= require('./APIs/userApi')
app.use('/user-api', userApp);
const chatApp= require('./APIs/chatAPI')
app.use('/message-api', chatApp);

mongoose.connect("mongodb://localhost:27017/chathive")
.then(app.listen(1234,()=>console.log(`server listening on port 1234...`)))
.catch(err=>console.log("error in DB connection",err))

// error handler 
app.use((err,req,res,next)=>
    {
        console.log('err object in express error handler: ', err)
        res.send({message:err.message})
    })


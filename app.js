const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 5000;
const User = require('./models/user'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET, MONGOURI} = require('./config/keys')

mongoose.connect(MONGOURI);


mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB')
});

mongoose.connection.on('error', (err) => {
  console.log('error', err)
});

app.use(express.json());

const requireLogin = (req,res,next) =>{
  const {authorization} = req.headers
  if(!authorization){
    return res.status(401).json({error:"you must be logged in"})
  }
  try{
    const {userId} = jwt.verify(authorization, JWT_SECRET)
    req.user = userId
    next()
  }catch(err){
    return res.status(401).json({error:"you must be logged in"})
  }  
}

app.post('/signup', async (req,res) =>{
  const {email,password} = req.body
  try{
    if(!email || !password){
      return res.status(422).json({error:"please add all the fields"});
    }
    const user = await User.findOne({email})
    if(user){
      return res.status(422).json({error: "user already exists with the mail"});
    }
    const hashedPassword = await bcrypt.hash(password,12)
    await new User({
      email,
      password: hashedPassword
    }).save()
    res.status(200).json({message: "signup success you can login now"});

  }catch(err){
    console.log(err)
  }
});
app.post('/signin', async (req,res) =>{
  const {email,password} = req.body
  try{
      if(!email || !password){
      return res.status(422).json({error:"please add all the fields"});
    }
      const user = await User.findOne({email})
      if(!user){
      return res.status(404).json({error: "user not found"});
    }
    const doMatch = await bcrypt.compare(password,user.password)
    if(doMatch){
      const token = jwt.sign({userId:user._id},JWT_SECRET)
      res.status(201).json({token})
    }else{
      return res.status(401).json({error: "email or password invalid"});
    }
  }catch(err){
    console.log(err)
  }
});


if(process.env.NODE_ENV=='production'){
  const path = require('path')
  app.get('/',(req,res)=>{
    app.use(express.static(path.resolve(__dirname,'client','build')))
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))

  })
}


app.listen(PORT, () => {
  console.log('server running on', PORT)
});
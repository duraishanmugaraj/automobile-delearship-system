require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const ejs = require("ejs")

var Model = require(__dirname+"/models/model");
var Servicing = require(__dirname+"/models/service");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))

// passport initialization
app.use(session({
    secret:process.env.SECRET, // env variable
    resave:false,
    saveUninitialized:false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  
  //db connection
  mongoose.connect('mongodb://localhost:27017/automobileDB', {useNewUrlParser: true, useUnifiedTopology: true});

  const userSchema = new mongoose.Schema({
    username:String,
    password:String
  })
  
  userSchema.plugin(passportLocalMongoose); //passport plugin
  const User = mongoose.model('user', userSchema);


  // passport configuration
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());


  app.get("/",function(req,res){
      res.render("login")
  })

  app.get("/register",function(req,res){
    res.render("register")
})



  // node server initialization
  app.listen(3000, function(){
    console.log("Server started on port 3000.");
  });
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
    password:String,
    isAdmin:Boolean
  })
  
  userSchema.plugin(passportLocalMongoose); //passport plugin
  const User = mongoose.model('user', userSchema);


  // passport configuration
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

// login route
  app.get("/",function(req,res){
    if(req.isAuthenticated()){
      res.redirect("/home")
    }else{
      res.render("login",{isInvalid:false})
    }
  })

  // register route
  app.get("/register",function(req,res){
    if(req.isAuthenticated()){
      res.redirect("/home")
    }else{
      res.render("register")
    }
})

// logout
app.get("/logout",function(req,res){
  req.logout()
  res.redirect("/")
})

app.post('/login', passport.authenticate('local', { successRedirect:'/home', failureRedirect: '/invalid' }));

app.get("/invalid",function(req,res){
  if(req.isAuthenticated()){
    res.redirect("/home")
  }else{
    res.render("login",{isInvalid:true})
  }
})
// app.post("/login",function(req,res){
//   const user = new User({
//     username:req.body.username,
//     password:req.body.password
//   })
//   req.logIn(user,function(err){
//     if(err){
//       console.log(err)
//       res.redirect("/")
//     } else {
//       passport.authenticate("local")(req,res,function(){
//         res.redirect("/home")
//       })
//     }
//   })
//   })
  
  app.post("/register",function(req,res){
    User.register({username:req.body.username},req.body.password,function(err,user){
    if(err){
      console.log(err)
      res.redirect("/register")
    } else {
      passport.authenticate("local")(req,res,function(){
        res.redirect("/home")
      })
    }
  })
  })

// Home Route
app.get("/home",function(req,res){
if(req.isAuthenticated()){
    Model.find(function(err,found){
      res.render("home",{cars:found,isAdmin:req.user.isAdmin})
        })
  } else {
    res.redirect("/")
  }    
})

// admin route
app.get("/admin",function(req,res){
  if(req.isAuthenticated()){
    if(req.user.isAdmin){
      res.render("admin",{isAdmin:req.user.isAdmin})
      }else{
        res.redirect("/home")
      }
  } else{
    res.redirect("/")
  }

})

app.get("/booknow/:carid",function(req,res){
if(req.isAuthenticated()){
  const id = req.params.carid
  Model.findOne({_id:id},function(err,carFound){
    res.render("booknow",{car:carFound,isAdmin:req.user.isAdmin})
  })
}
})

// service
app.get("/service",function(req,res){
  if(req.isAuthenticated()){
    if(req.user.isAdmin){
      Servicing.find(function(err,foundService){
        if(err){
          console.log(err)
        } else{
           res.render("adminService",{isAdmin:req.user.isAdmin,service:foundService})
        }
      })
     
    } else{
      res.render("service",{isAdmin:req.user.isAdmin,isService:false})
    }
  } else{
    res.redirect("/")
  }
})

// admin service delete
app.post("/service/delete",function(req,res){
Servicing.deleteOne({_id:req.body.id},function(err){
  if (err){
    console.log(err)
  } else{
    res.redirect("/service")
  }
})
})

app.post("/service",function(req,res){
  const newService = new Servicing({
    "customerImage": req.body.img,
    "customerName": req.body.name,
    "customerEmail": req.body.email,
    "customerPhone": req.body.Phoneno,
    "customerModel": req.body.model,
    "customerType": req.body.service,
    "customerBill": req.body.bill,
  })
    newService.save().then(() => res.render("service",{isAdmin:req.user.isAdmin,isService:true}));
  })

  app.post("/admin",function(req,res){
  
    const newCar = new Model({ 
      "imagePath": req.body.img,
    	"title": req.body.title,
    	"t1": req.body.title2,
    	"t2": req.body.title3,
    	"price": req.body.price,
    	"topspeed": req.body.speed,
    	"time60": req.body.time60,
    	"range": req.body.range,
    	"colour": req.body.colour,
    	"interior": req.body.interior,
    	"wheel": req.body.wheel,
    	"description": req.body.desc,
    	"safety":  req.body.safty,
    	"rangedesc": req.body.rangedesc
     });
    newCar.save().then(() => res.redirect("/home"));
  })


app.post("/deleteCar",function(req,res){
  Model.deleteOne({_id:req.body.delete},function(err){
    if(!err){
      res.redirect("/home")
    } else{
      console.log(err)
    }
  })
})

  

// node server initialization
  app.listen(3000, function(){
    console.log("Server started on port 3000.");
  });
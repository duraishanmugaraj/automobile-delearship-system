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
      res.render("login")
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

app.post("/login",function(req,res){
  const user = new User({
    username:req.body.username,
    password:req.body.password
  })
  req.logIn(user,function(err){
    if(err){
      console.log(err)
      res.redirect("/")
    } else {
      passport.authenticate("local")(req,res,function(){
        res.redirect("/home")
      })
    }
  })
  })
  
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
      res.render("service",{isAdmin:req.user.isAdmin})
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
  console.log(req.body)
})


// const newService = new Servicing({
// 	"customerImage": "/images/6.jpg",
// 	"customerName": "Bruce Wayne",
// 	"customerEmail": "wayne.bruce@gmail.com",
// 	"customerPhone": "8444153287",
// 	"customerModel": "2019 Tesla Model X Standard Plus",
// 	"customerType": "Air Condition Service",
// 	"customerDone": "Yes",
// 	"customerBill": "$300",
// 	"Date": "03/02/2020"
// })

// newService.save().then(() => console.log('new service'));


// const newCar = new Model({ 
//   "imagePath": "images/8.jpg",
// 	"title": "Tesla Model Y Long Range AWD",
// 	"t1": "2020 Tesla Model Y",
// 	"t2": "Long Range AWD Edition",
// 	"price": "52,000",
// 	"topspeed": "135",
// 	"time60": "4.8",
// 	"range": "346",
// 	"colour": "Red Metallic Paint",
// 	"interior": "Cream Oakwood Interior",
// 	"wheel": "19'' Induction Wheels",
// 	"description": "Model Y provides maximum versatility creating flexible storage for skis, furniture, luggage and a low trunk floor that makes loading and unloading easy and quick with all-Wheel Drive has two ultra-responsive, independent electric motors that digitally control torque.",
// 	"safety": "Safety is the most important part of the overall Model 3 design. The metal structure is a combination of aluminum and steel, for maximum strength in every area. In a roof-crush test, Model 3 resisted four times its own mass, even with an all-glass roof",
// 	"rangedesc": "Model 3 is fully electric, so you never need to visit a gas station again. If you charge overnight at home, you can wake up to a full battery every morning. And when you’re on the road, it’s easy to plug in along the way—at any public station or with the Tesla charging network."
//  });
// newCar.save().then(() => console.log('meow'));

  

// node server initialization
  app.listen(3000, function(){
    console.log("Server started on port 3000.");
  });
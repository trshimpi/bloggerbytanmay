var express = require("express");
var router  = express.Router();
var User    = require("../models/user");
var passport= require("passport");
var Blog    = require("../models/blog");



// //root route
// router.get("/",function(req,res){
// res.render(""); 
// });
router.get("/",function(req,res){
    //find blogs from database
    Blog.find({},function(err,allBlogs){
        if(err){
            console.log(err);
        }else{
            console.log("all the blogs..");
            res.render("blogs/index",{blogs:allBlogs});
        }
    });
    
});


//auth routes
//show sign up form
router.get("/register",function(req,res){
    res.render("register");
});

//sign up logic
router.post("/register",function(req,res){
   var newUser = new User ({username : req.body.username});
   User.register(newUser,req.body.password,function(err,user){
       if(err){
           
           return res.render("register",{error:err.message});
       }
      passport.authenticate("local")(req,res,function(){
          req.flash("success","Welcome to Bloggggger "+user.username);
          res.redirect("/blogs");
      });
   });
});

//login form
router.get("/login",function(req,res){
    res.render("login");
});

//login logic
router.post("/login",passport.authenticate("local",{
    successRedirect:"/blogs",
    failureRedirect:"/login"
}),function(req,res){});

//logout route
router.get("/logout",function(req,res){
   req.logout();
   req.flash("success","Successfully Logged Out!Thank You!");
   res.redirect("/blogs");
});




module.exports = router;
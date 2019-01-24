var express = require("express");
var router  = express.Router();
var Blog    = require("../models/blog");



//INDEX route 
router.get("/blogs",function(req,res){
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


//create route
router.post("/blogs",isLoggedIn,function(req,res){
   //get data from the form using body parser
   var title = req.body.title;
   var image = req.body.image;
   var post =req.body.post;
   
   var author ={id:req.user._id,username:req.user.username};
   var newBlog = {title:title,image:image,post:post,author:author};
   //create the new blog
   Blog.create(newBlog,function(err,newlyCreated){
       if(err){
           console.log(err);
       }else{
           //render the page 
             res.redirect("/blogs");
       }
   });
   
});


//new route
router.get("/blogs/new",isLoggedIn,function(req,res){
   res.render("blogs/new") ;
});


//show route
router.get("/blogs/:id",function(req,res){
   //get the blog with id
   Blog.findById(req.params.id).populate("comments").exec(function(err,foundBlog){
      if(err){
          console.log(err);
      } else{
          //render the show page
             res.render("blogs/show",{blog:foundBlog});
      }
   });
   
});

//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;

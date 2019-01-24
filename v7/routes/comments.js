var express = require("express");
var router  = express.Router();
var Blog    = require("../models/blog");
var Comment    = require("../models/comment");


//new comment route
router.get("/blogs/:id/comments/new",isLoggedIn,function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs/"+req.params.id);
        }else{
            res.render("comments/new",{blog:foundBlog});
        }
    });
});

//create route 
router.post("/blogs/:id/comments",isLoggedIn,function(req,res){
   //find the blog with id
   Blog.findById(req.params.id,function(err,foundBlog){
       if(err){
           console.log(err);
           res.redirect("/blogs/"+req.params.id);
       }else{
          //create new comment
          Comment.create(req.body.comment,function(err,comment){
              if(err){
                  console.log(err);
              }else{
                  //connect new comment to the blog
                  foundBlog.comments.push(comment);
                  foundBlog.save();
                  //redirect to the blog with id page again
                  res.redirect("/blogs/"+req.params.id);
              }
          });
        
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
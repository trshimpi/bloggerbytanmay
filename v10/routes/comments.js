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
                  //add username and id to comment
                  comment.author.id=req.user._id;
                  comment.author.username = req.user.username;
                  
                  //save the comment
                  comment.save();
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

//edit comment
router.get("/blogs/:id/comments/:comment_id/edit",checkCommentOwnership,function(req,res){
    //find the comment 
    var blog_id =req.params.id;
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{blog_id:blog_id,comment:foundComment});
        }
    });
});

//update comment
router.put("/blogs/:id/comments/:comment_id",checkCommentOwnership,function(req,res){
   //find comment and update
   Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err){
       if(err){
           res.redirect("back");
       }else{
           res.redirect("/blogs/"+req.params.id);
       }
   });
});

//delete comment
router.delete("/blogs/:id/comments/:comment_id",checkCommentOwnership,function(req,res){
   //find the comment and delete
   Comment.findByIdAndRemove(req.params.comment_id,function(err){
       if(err){
           res.redirect("back");
       }else{
           res.redirect("/blogs/"+req.params.id);
       }
   });
});


function checkCommentOwnership(req,res,next){
    if(req.isAuthenticated()){
    //find the blog with id
       Comment.findById(req.params.comment_id,function(err,foundComment){
       if(err){
           res.redirect("back");
       }else{
           // does user is the author of the blog
           if(foundComment.author.id.equals(req.user._id)){
            next();   
           }else{
            res.redirect("back"); 
           }
       }
   });
    }else{
        res.redirect("back");
    }
} 

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
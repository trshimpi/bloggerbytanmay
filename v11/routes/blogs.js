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
            req.flash("success","Blog successfully created");
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

//edit route
router.get("/blogs/:id/edit",checkBlogOwnership,function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("back");
        }else{
            res.render("blogs/edit",{blog:foundBlog});
        }
    });
});


//update route
router.put("/blogs/:id",checkBlogOwnership,function(req,res){
    //find and update the edited blog
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            req.flash("success","Successfully updated blog");
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//destroy route
router.delete("/blogs/:id",checkBlogOwnership,function(req,res){
   //find the blog and delete
   Blog.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/blogs/"+req.params.id);
       }else{
           req.flash("success","Successfully deleted blog");
           res.redirect("/blogs");
       }
   });
});

 function checkBlogOwnership(req,res,next){
    if(req.isAuthenticated()){
    //find the blog with id
       Blog.findById(req.params.id,function(err,foundBlog){
       if(err){
           res.redirect("back");
       }else{
           // does user is the author of the blog
           if(foundBlog.author.id.equals(req.user._id)){
            next();   
           }else{
            req.flash("error","You don't Have Permission To Do That");
            res.redirect("back"); 
           }
       }
   });
    }else{
        req.flash("error","You need to be loggedIn to do that");
        res.redirect("back");
    }
}

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be loggedIn to do that");
    res.redirect("/login");
}



module.exports = router;

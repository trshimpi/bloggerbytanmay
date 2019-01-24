var express = require("express");
var app = express();
var bodyParser= require("body-parser");
var mongoose = require("mongoose");
var Blog = require("./models/blog");
var Comment = require("./models/comment");
var seedDB = require("./seed");

seedDB();

mongoose.connect("mongodb://localhost/blog_v2");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");



app.get("/",function(req,res){
res.render("landing"); 
});

//INDEX route 
app.get("/blogs",function(req,res){
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
app.post("/blogs",function(req,res){
   //get data from the form using body parser
   var title = req.body.title;
   var image = req.body.image;
   var post =req.body.post;
   var newBlog = {title:title,image:image,post:post};
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
app.get("/blogs/new",function(req,res){
   res.render("blogs/new") ;
});


//show route
app.get("/blogs/:id",function(req,res){
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

//======================
//comments routes
//======================
//new comment route
app.get("/blogs/:id/comments/new",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs/"+req.params.id);
        }else{
            res.render("comments/new",{blog:foundBlog});
        }
    });
});

//create route 
app.post("/blogs/:id/comments",function(req,res){
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


app.listen(process.env.PORT,process.env.IP,function(){
   console.log("bloger started successully"); 
});
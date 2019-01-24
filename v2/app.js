var express = require("express");
var app = express();
var bodyParser= require("body-parser");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blog_v2");


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");


// blog schema
var blogSchema = new mongoose.Schema({
   title : String,
   image : String,
   post  : String
});

var Blog = mongoose.model("Blog",blogSchema);
      


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
            res.render("index",{blogs:allBlogs});
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
             res.redirect("blogs");
       }
   });
   
});


//new route
app.get("/blogs/new",function(req,res){
   res.render("new") ;
});


//show route
app.get("/blogs/:id",function(req,res){
   //get the blog with id
   Blog.findById(req.params.id,function(err,foundBlog){
      if(err){
          console.log(err);
      } else{
          //render the show page
             res.render("show",{blog:foundBlog});
      }
   });
   
});

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("bloger started successully"); 
});
var express = require("express");
var app = express();
var bodyParser= require("body-parser");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blog_v2")

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

var blogs = [
       {title:"tanamy1", image:"https://pixabay.com/get/ec31b90f2af61c22d2524518b7444795ea76e5d004b014439cf4c970aee8b5_340.jpg",post:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic "},
       {title:"tanamy2", image:"https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104497f9c571aee4b0b8_340.jpg",post:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic "},
       {title:"tanamy3", image:"https://pixabay.com/get/eb32b7072df5043ed1584d05fb1d4e97e07ee3d21cac104497f9c571aee4b0b8_340.jpg",post:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic "},
       {title:"tanamy1", image:"https://pixabay.com/get/eb34b6072cf0033ed1584d05fb1d4e97e07ee3d21cac104497f9c571aee4b0b8_340.jpg",post:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic "},
       {title:"tanamy2", image:"https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104497f9c571aee4b0b8_340.jpg",post:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic "},
       {title:"tanamy3", image:"https://pixabay.com/get/ec31b90f2af61c22d2524518b7444795ea76e5d004b014439cf4c970aee8b5_340.jpg",post:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic "}
       ]; 

app.get("/",function(req,res){
  res.render("landing"); 
});

app.get("/blogs",function(req,res){
    
    res.render("blogs",{blogs:blogs});
});

app.post("/blogs",function(req,res){
   //get data from the form using body parser
   var title = req.body.title;
   var image = req.body.image;
   var post =req.body.post;
   var newBlog = {title:title,image:image,post:post};
   blogs.push(newBlog);
   //render the page 
   res.redirect("blogs");
});

app.get("/blogs/new",function(req,res){
   res.render("new") ;
});

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("bloger started successully"); 
});
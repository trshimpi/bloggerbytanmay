var  express            = require("express"),
     app                = express(),
     bodyParser         = require("body-parser"),
     passport           =require("passport"),
     LocalStrategy      =require("passport-local"),
     mongoose           = require("mongoose"),
     Blog               = require("./models/blog"),
     Comment            = require("./models/comment"),
     User               =  require("./models/user"),
     seedDB             = require("./seed");

seedDB();

mongoose.connect("mongodb://localhost/blog_v2");
app.use(bodyParser.urlencoded({extended:true}));


app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");

//passport config
//tell express to use passport
app.use(require("express-session")({
    secret:"i love my INDIA , ye mera INDIA ,ha maza BHARAT",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   next();
});

//routes
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
app.post("/blogs",isLoggedIn,function(req,res){
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
app.get("/blogs/new",isLoggedIn,function(req,res){
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
app.get("/blogs/:id/comments/new",isLoggedIn,function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs/"+req.params.id);
        }else{
            res.render("comments/new",{blog:foundBlog});
        }
    });
});

//create route 
app.post("/blogs/:id/comments",isLoggedIn,function(req,res){
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

//auth routes
//show sign up form
app.get("/register",function(req,res){
    res.render("register");
});

//sign up logic
app.post("/register",function(req,res){
   var newUser = new User ({username : req.body.username});
   User.register(newUser,req.body.password,function(err,user){
       if(err){
           console.log(err);
           return res.render("register");
       }
      passport.authenticate("local")(req,res,function(){
          res.redirect("/blogs");
      });
   });
});

//login form
app.get("/login",function(req,res){
    res.render("login");
});

//login logic
app.post("/login",passport.authenticate("local",{
    successRedirect:"/blogs",
    failureRedirect:"/login"
}),function(req,res){});

//logout route
app.get("/logout",function(req,res){
   req.logout();
   res.redirect("/");
});

//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("bloger started successully"); 
});
var  express            = require("express"),
     app                = express(),
     bodyParser         = require("body-parser"),
     passport           =require("passport"),
     LocalStrategy      =require("passport-local"),
     mongoose           = require("mongoose"),
     User               =  require("./models/user"),
     methodOverride     = require("method-override"),
     flash              = require("connect-flash");

//including routes
var blogRoutes   = require("./routes/blogs"),
    commentRoutes= require("./routes/comments"),
    indexRoutes  = require("./routes/index");


mongoose.connect("mongodb://localhost/blog_v7");
app.use(bodyParser.urlencoded({extended:true}));


app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
//flash messages
app.use(flash());

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
   res.locals.error       = req.flash("error");
   res.locals.success     = req.flash("success")
   next();
});


//telling express to use routes
app.use(indexRoutes);
app.use(blogRoutes);
app.use(commentRoutes);



app.listen(process.env.PORT,process.env.IP,function(){
   console.log("bloger started successully"); 
});
var mongoose = require("mongoose");

// blog schema
var blogSchema = new mongoose.Schema({
   title : String,
   image : String,
   post  : String,
   created:{type:Date,default:Date.now},
   author:{
      id:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User"
      },
      username:String
   },
   comments:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"Comment"
      }
      ]
});

module.exports = mongoose.model("Blog",blogSchema);
      
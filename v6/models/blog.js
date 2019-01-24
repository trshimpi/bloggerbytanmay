var mongoose = require("mongoose");

// blog schema
var blogSchema = new mongoose.Schema({
   title : String,
   image : String,
   post  : String,
   comments:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"Comment"
      }
      ]
});

module.exports = mongoose.model("Blog",blogSchema);
      
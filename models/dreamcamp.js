var mongoose = require("mongoose");

// SCHEMA
var dreamCampSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments : [
       {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment"
       }
    ]
});

module.exports = mongoose.model("DreamCamp", dreamCampSchema);
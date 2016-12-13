var mongoose = require("mongoose");

// SCHEMA
var dreamCampSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

module.exports = mongoose.model("DreamCamp", dreamCampSchema);
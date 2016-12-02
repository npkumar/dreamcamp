var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

mongoose.connect("mongodb://localhost/dream_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
 
// SCHEMA
var dreamCampSchema = new mongoose.Schema({
    name: String,
    image: String
});
var DreamCamp = mongoose.model("DreamCamp", dreamCampSchema);

// DreamCamp.create({name: "Falling away", image: "https://farm9.staticflickr.com/8067/8212362709_94a379cf66.jpg"}, function(err, dreamCamp){
//     if(err){
//         console.log(err);
//     } else {
//         console.log("newly created dreamCamp ");
//         console.log(dreamCamp);
//     }
// })

app.get("/", function(req, res){
   res.render("landing");
});

// show all dreams
app.get("/dreams", function(req, res){
   DreamCamp.find({}, function(err, dreams){
      if(err){
          console.log(err);
      } else {
          res.render("dreams", {dreams: dreams});
      }
   });
});

// post dream data from a form
app.post("/dreams", function(req, res){
    var dream = {
     name: req.body.name,
     image: req.body.image
   };
   DreamCamp.create(dream, function(err, newdream){
      if (err){
          console.log(err);
      } else {
          console.log("Created dream " + newdream);
          res.redirect("/dreams");
      }
   });
});

// show form that send data to POST /dreams
app.get("/dreams/new", function(req, res){
   res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("DreamCamp Server running at " + process.env.PORT); 
});
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
    image: String,
    description: String
});
var DreamCamp = mongoose.model("DreamCamp", dreamCampSchema);

// DreamCamp.create({
//     name: "Falling away", 
//     image: "https://farm9.staticflickr.com/8067/8212362709_94a379cf66.jpg",
//     description: "This was seen during the morning around 9 am"
// }, function(err, dreamCamp){
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

// INDEX - show all dreams
app.get("/dreams", function(req, res){
   DreamCamp.find({}, function(err, dreams){
      if(err){
          console.log(err);
      } else {
          res.render("index", {dreams: dreams});
      }
   });
});
   
// CREATE - post dream data from a form
app.post("/dreams", function(req, res){
    var dream = {
     name: req.body.name,
     image: req.body.image,
     description: req.body.description
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

// NEW - show form that send data to POST /dreams
app.get("/dreams/new", function(req, res){
   res.render("new");
});

// SHOW - show information about a single dream
app.get("/dreams/:id", function(req, res){
   DreamCamp.findById(req.params.id, function(err, foundDreamCamp){
       if(err){
           console.log(err);
       } else {
        res.render("show", { dreamCamp: foundDreamCamp});
       }
   });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("DreamCamp Server running at " + process.env.PORT); 
});
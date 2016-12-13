var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    DreamCamp   = require("./models/dreamcamp"),
    seedDB      = require("./seeds");

seedDB();

mongoose.connect("mongodb://localhost/dream_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


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
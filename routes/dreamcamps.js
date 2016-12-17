var express = require("express");
var router = express.Router();

var DreamCamp   = require("../models/dreamcamp");

// INDEX - show all dreams
router.get("/", function(req, res){
   DreamCamp.find({}, function(err, dreams){
      if(err){
          console.log(err);
      } else {
          res.render("dreamcamps/index", {dreams: dreams});
      }
   });
});
   
// CREATE - post dream data from a form
router.post("/", function(req, res){
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
router.get("/new", function(req, res){
   res.render("dreamcamps/new");
});

// SHOW - show information about a single dream
router.get("/:id", function(req, res){
   DreamCamp.findById(req.params.id).populate("comments").exec(function(err, foundDreamCamp){
       if(err){
           console.log(err);
       } else {
        res.render("dreamcamps/show", { dreamCamp: foundDreamCamp});
       }
   });
});

module.exports = router;
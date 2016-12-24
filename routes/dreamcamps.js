var express = require("express");
var router = express.Router();

var DreamCamp   = require("../models/dreamcamp");
var middleware = require("../middleware");

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
router.post("/", middleware.isLoggedIn, function(req, res){
    var dream = {
     name: req.body.name,
     image: req.body.image,
     description: req.body.description,
     author: {
         id: req.user._id,
         username: req.user.username
     }
   };
   DreamCamp.create(dream, function(err, newdream){
      if (err){
          console.log(err);
      } else {
          res.redirect("/dreams");
      }
   });
});

// NEW - show form that send data to POST /dreams
router.get("/new", middleware.isLoggedIn, function(req, res){
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

// EDIT - dreamcamp route
router.get("/:id/edit", middleware.checkDreamCampOwnership, function(req, res) {
        DreamCamp.findById(req.params.id, function(err, foundDreamCamp){
           if (err) {
                res.redirect("/dreams");
           } else {
                res.render("dreamcamps/edit", {dreamcamp: foundDreamCamp});   
           }
        });
});

// UPDATE - dreamcamp route
router.put("/:id", middleware.checkDreamCampOwnership, function(req, res) {
    DreamCamp.findByIdAndUpdate(req.params.id, req.body.dreamcamp, function(err, dreamcamp){
       if (err) {
           req.redirect("/dreams");
       } else {
           res.redirect("/dreams/" + req.params.id);
       }
    });
});

// DELETE - dreamcamp delete
router.delete("/:id", middleware.checkDreamCampOwnership, function(req, res){
   DreamCamp.findByIdAndRemove(req.params.id, function(err){
       if (err) {
           res.redirect("/dreams");
       } else {
           res.redirect("/dreams");
       }
   });
});

module.exports = router;
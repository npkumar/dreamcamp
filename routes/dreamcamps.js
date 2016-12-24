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
router.post("/", isLoggedIn, function(req, res){
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
router.get("/new", isLoggedIn, function(req, res){
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
router.get("/:id/edit", checkDreamCampOwnership, function(req, res) {
        DreamCamp.findById(req.params.id, function(err, foundDreamCamp){
           if (err) {
                res.redirect("/dreams");
           } else {
                res.render("dreamcamps/edit", {dreamcamp: foundDreamCamp});   
           }
        });
});

// UPDATE - dreamcamp route
router.put("/:id", checkDreamCampOwnership, function(req, res) {
    DreamCamp.findByIdAndUpdate(req.params.id, req.body.dreamcamp, function(err, dreamcamp){
       if (err) {
           req.redirect("/dreams");
       } else {
           res.redirect("/dreams/" + req.params.id);
       }
    });
});

// DELETE - dreamcamp delete
router.delete("/:id", checkDreamCampOwnership, function(req, res){
   DreamCamp.findByIdAndRemove(req.params.id, function(err){
       if (err) {
           res.redirect("/dreams");
       } else {
           res.redirect("/dreams");
       }
   });
});

// Middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkDreamCampOwnership(req, res, next){
    // is the user logged in
    if (req.isAuthenticated()){
        DreamCamp.findById(req.params.id, function(err, foundDreamCamp){
           if (err) {
               res.redirect("back");
           } else {
               // check if user owns the dreamcamp
               if (foundDreamCamp.author.id.equals(req.user._id)){
                    // all good, move on
                    next();  
               } else {
                   res.redirect("back");
               }
           }
        });
    } else {
        // send user back to previous page they are on
        res.redirect("back");
    }
}
module.exports = router;
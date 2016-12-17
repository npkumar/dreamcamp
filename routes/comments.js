var express = require("express");
var router = express.Router();

var DreamCamp   = require("../models/dreamcamp");
var Comment   = require("../models/comment");
    
// COMMENTS
router.get("/dreams/:id/comments/new", isLoggedIn, function(req, res) {
   DreamCamp.findById(req.params.id, function(err, dreamcamp){
      if (err){
          console.log(err);
      } else {
          res.render("comments/new", {dreamcamp: dreamcamp});
      }
   });
});

router.post("/dreams/:id/comments", isLoggedIn, function(req,res){
    DreamCamp.findById(req.params.id, function(err, dreamcamp){
      if (err){
          console.log(err);
          res.redirect("/dreams");
      }  else {
          Comment.create(req.body.comments, function(err, comment){
             if (err) {
                 console.log(err);
             } else {
                 dreamcamp.comments.push(comment._id);
                 dreamcamp.save();
                 res.redirect("/dreams/" + dreamcamp._id);
             }
          }); 
      }
    });  
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
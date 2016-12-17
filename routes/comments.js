var express = require("express");
var router = express.Router({ mergeParams: true });

var DreamCamp   = require("../models/dreamcamp");
var Comment   = require("../models/comment");
    
// COMMENTS NEW
router.get("/new", isLoggedIn, function(req, res) {
   DreamCamp.findById(req.params.id, function(err, dreamcamp){
      if (err){
          console.log(err);
      } else {
          res.render("comments/new", {dreamcamp: dreamcamp});
      }
   });
});

// COMMENTS SAVE
router.post("/", isLoggedIn, function(req,res){
    DreamCamp.findById(req.params.id, function(err, dreamcamp){
      if (err){
          console.log(err);
          res.redirect("/dreams");
      }  else {
          Comment.create(req.body.comments, function(err, comment){
             if (err) {
                 console.log(err);
             } else {
                 // add username and id to comment
                 comment.author.id = req.user._id,
                 comment.author.username = req.user.username
                 // save comment
                 console.log(comment)
                 comment.save();
                 // push comment to dreamcamp
                 dreamcamp.comments.push(comment._id);
                 dreamcamp.save();
                 res.redirect("/dreams/" + dreamcamp._id);
             }
          }); 
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

module.exports = router;
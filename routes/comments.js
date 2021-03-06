var express = require("express");
var router = express.Router({ mergeParams: true });

var DreamCamp   = require("../models/dreamcamp");
var Comment   = require("../models/comment");
var middleware = require("../middleware");

// COMMENTS NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
   DreamCamp.findById(req.params.id, function(err, dreamcamp){
      if (err){
          console.log(err);
      } else {
          res.render("comments/new", {dreamcamp: dreamcamp});
      }
   });
});

// COMMENTS SAVE
router.post("/", middleware.isLoggedIn, function(req,res){
    DreamCamp.findById(req.params.id, function(err, dreamcamp){
      if (err){
          console.log(err);
          res.redirect("/dreams");
      }  else {
          Comment.create(req.body.comments, function(err, comment){
             if (err) {
                 req.flash("error", "Oops! Something went wrong!");
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
                 req.flash("success", "Successfully added comment!");
                 res.redirect("/dreams/" + dreamcamp._id);
             }
          }); 
      }
    });  
});

// COMMENTS EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {
                dreamcamp_id: req.params.id,
                comment: foundComment
            });
        }
    });
});

// COMMENTS UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comments, function(err, updatedComment){
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/dreams/" + req.params.id);
        }
    })
});

// COMMENTS DELETE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, req.body.comments, function(err, updatedComment){
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/dreams/" + req.params.id);
        }
    })
});

module.exports = router;
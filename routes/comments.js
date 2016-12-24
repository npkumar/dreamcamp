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

// COMMENTS EDIT
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
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
router.put("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comments, function(err, updatedComment){
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/dreams/" + req.params.id);
        }
    })
});

// COMMENTS DELETE
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, req.body.comments, function(err, updatedComment){
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/dreams/" + req.params.id);
        }
    })
});

// Middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCommentOwnership(req, res, next){
    // is the user logged in
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if (err) {
               res.redirect("back");
           } else {
               // check if user owns the dreamcamp
               if (foundComment.author.id.equals(req.user._id)){
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
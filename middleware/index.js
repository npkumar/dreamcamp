var DreamCamp   = require("../models/dreamcamp");
var Comment   = require("../models/comment");

// all middleware
var middlewareObj = {
    
    isLoggedIn: function(req, res, next){
        if (req.isAuthenticated()){
            return next();
        }
        res.redirect("/login");
    },

    checkDreamCampOwnership: function(req, res, next){
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
    },

    checkCommentOwnership: function(req, res, next){
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
};

module.exports = middlewareObj;
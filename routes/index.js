var express = require("express");
var router = express.Router();
var passport = require("passport");

var User    = require("../models/user");

// ROUTE ROUTE
router.get("/", function(req, res){
   res.render("landing");
});

// REGISTER FORM ROUTE
router.get("/register", function(req, res) {
    res.render("register");    
});

// REGISTER LOGIC ROUTE
router.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       if (err) {
           req.flash("error", "Oops! Could not register: " + err.message);
           return res.redirect("register");
       } 
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to DreamCamp " + user.username);
           res.redirect("/dreams");
       });
    });
});

// LOGIN FORM ROUTE
router.get("/login", function(req, res) {
    res.render("login");    
});

// LOGIN SAVE ROUTE
router.post("/login", passport.authenticate("local", {
    successRedirect: "/dreams",
    failureRedirect: "/login"
}), function (req, res) {
    
});

// LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/dreams");
});

module.exports = router;
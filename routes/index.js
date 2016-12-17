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
           console.log(err);
           return res.render("register");
       } 
       passport.authenticate("local")(req, res, function(){
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
    res.redirect("/dreams");
});

// Middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
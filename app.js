var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    DreamCamp   = require("./models/dreamcamp"),
    Comment   = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");

seedDB();

mongoose.connect("mongodb://localhost/dream_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// PASSPORT
app.use(require("express-session")({
    secret: "Revenge of the Siths",
    resave: false,
    saveUnitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.get("/", function(req, res){
   res.render("landing");
});

// INDEX - show all dreams
app.get("/dreams", function(req, res){
   DreamCamp.find({}, function(err, dreams){
      if(err){
          console.log(err);
      } else {
          res.render("dreamcamps/index", {dreams: dreams});
      }
   });
});
   
// CREATE - post dream data from a form
app.post("/dreams", function(req, res){
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
app.get("/dreams/new", function(req, res){
   res.render("dreamcamps/new");
});

// SHOW - show information about a single dream
app.get("/dreams/:id", function(req, res){
   DreamCamp.findById(req.params.id).populate("comments").exec(function(err, foundDreamCamp){
       if(err){
           console.log(err);
       } else {
        res.render("dreamcamps/show", { dreamCamp: foundDreamCamp});
       }
   });
});

// COMMENTS
app.get("/dreams/:id/comments/new", isLoggedIn, function(req, res) {
   DreamCamp.findById(req.params.id, function(err, dreamcamp){
      if (err){
          console.log(err);
      } else {
          res.render("comments/new", {dreamcamp: dreamcamp});
      }
   });
});

app.post("/dreams/:id/comments", isLoggedIn, function(req,res){
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


// AUTH ROUTES
app.get("/register", function(req, res) {
    res.render("register");    
});

app.post("/register", function(req, res) {
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

app.get("/login", function(req, res) {
    res.render("login");    
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/dreams",
    failureRedirect: "/login"
}), function (req, res) {
    
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/dreams");
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("DreamCamp Server running at " + process.env.PORT); 
});
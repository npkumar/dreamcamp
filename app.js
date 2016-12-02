var express = require("express"),
    app = express(),
    bodyParser = require("body-parser");

var dreams = [
    {name: "Running away", image: "https://farm3.staticflickr.com/2891/9551971749_964dc50f32.jpg"},
    {name: "Falling away", image: "https://farm9.staticflickr.com/8067/8212362709_94a379cf66.jpg"},
    {name: "Monster chase", image: "https://farm3.staticflickr.com/2135/2486451369_32323e32a2.jpg"}
];

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
 
app.get("/", function(req, res){
   res.render("landing");
});

// show all dreams
app.get("/dreams", function(req, res){
   res.render("dreams", {dreams: dreams});
});

// post dream data from a form
app.post("/dreams", function(req, res){
    var dream = {
     name: req.body.name,
     image: req.body.image
   };
   dreams.push(dream);
   res.redirect("/dreams");
});

// show form that send data to POST /dreams
app.get("/dreams/new", function(req, res){
   res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("DreamCamp Server running at " + process.env.PORT); 
});
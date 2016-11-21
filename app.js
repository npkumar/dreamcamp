var express = require("express"),
    app = express();

var dreams = [
    {name: "Running away", image: "https://farm3.staticflickr.com/2891/9551971749_964dc50f32.jpg"},
    {name: "Falling away", image: "https://farm9.staticflickr.com/8067/8212362709_94a379cf66.jpg"},
    {name: "Monster chase", image: "https://farm3.staticflickr.com/2135/2486451369_32323e32a2.jpg"}
];

app.set("view engine", "ejs");
 
app.get("/", function(req, res){
   res.render("landing");
});

app.get("/dreams", function(req, res){
   res.render("dreams", {dreams: dreams});
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("DreamCamp Server running at " + process.env.PORT); 
});
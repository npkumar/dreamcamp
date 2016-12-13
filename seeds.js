var mongoose = require("mongoose");
var DreamCamp = require("./models/dreamcamp");
var Comment = require("./models/comment");

var data = [
    {
        name: "Dream One", 
        image: "https://farm7.staticflickr.com/6138/6042439726_9efecf8348.jpg",
        description: "simply dummy text of the printing and typesetting industry."
    },
    {
        name: "Fun Dream", 
        image: "https://farm4.staticflickr.com/3856/15236626161_2fda851322.jpg",
        description: "simply dummy text of the printing and typesetting industry."
    },
    {
        name: "Lake Trip", 
        image: "https://farm9.staticflickr.com/8058/8188116542_4b265dcf2e.jpg",
        description: "simply dummy text of the printing and typesetting industry."
    }
];

function seedDB(){
    // remove all dreams
    DreamCamp.remove({},function(err){
       if (err){
           console.log(err);
       }  else {
           
           console.log("removed dreams");
           
            // add few dreams
            data.forEach(function(seed){
               DreamCamp.create(seed, function(err, dreamcamp){
                  if (err) {
                      console.log(err);
                  } else {
                      console.log(dreamcamp);
                      
                      // create a comment
                      Comment.create({
                          text: "This place is awesome!",
                          author: "Hommy"
                      }, function(err, comment){
                          if (err){
                              console.log(err);
                          } else {
                              console.log("created comment");
                              dreamcamp.comments.push(comment._id);
                              dreamcamp.save();
                          }
                      });
                  }
               });
            });
       }
    });  
    
}

module.exports = seedDB;
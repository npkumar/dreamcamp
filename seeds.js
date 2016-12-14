var mongoose = require("mongoose");
var DreamCamp = require("./models/dreamcamp");
var Comment = require("./models/comment");

var randomContent = "It is a long established fact that a reader will be distracted by the readable content of a page when " +
        "looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed " +
        "to using 'Content here, content here', making it look like readable English. Many desktop publishing packages " + 
        "and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites" +
        "still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose ";

var data = [
    {
        name: "Dream One", 
        image: "https://farm7.staticflickr.com/6138/6042439726_9efecf8348.jpg",
        description: randomContent
    },
    {
        name: "Fun Dream", 
        image: "https://farm4.staticflickr.com/3856/15236626161_2fda851322.jpg",
        description: randomContent
    },
    {
        name: "Lake Trip", 
        image: "https://farm9.staticflickr.com/8058/8188116542_4b265dcf2e.jpg",
        description: randomContent
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
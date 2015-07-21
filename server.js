// Require path
var path = require("path");

// Require express and create express app
var express = require("express");
var app = express();

// Require body-parser to be able to send POST data
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded( {extended: true} ));

// Static content
app.use(express.static(path.join(__dirname + "/static")));

// Set up views directory and ejs
app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "ejs");

// Require mongoose
var mongoose = require("mongoose");

// Create/connect to "dojo_message_board"
// database
mongoose.connect("mongodb://localhost/dojo_message_board");

// Create schema to start associations,
// similar to MySQL joins
var Schema = mongoose.Schema;

var messageSchema = new mongoose.Schema({
    name: String,
    message: String,
    // Code below creates a
    // "created_at" date
    created_at: {type: Date, default: new Date},
    // Line below is used to associate
    // a message "_id" to a
    // comment "_id" which is
    // like a foreign key
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}]
});

var commentSchema = new mongoose.Schema({
    // Line below is used to associate
    // the message "_id" to a comment "_id"
    // and notice the underscore
    // in "_message" to associate this "_id"
    // with the "messageSchema"
    _message: {type: Schema.ObjectId, ref: "Message"},
    name: String,
    comment: String,
    // Code below creates a
    // "created_at" date
    created_at: {type: Date, default: new Date}
});

// "Message" and "Comment" objects below
// will give me objects to
// take actions on the MongoDB database AND
// the "Message" parameter needs to match the 'ref: "Message"'
// property value AND
// the "Comment" parameter needs to match the 'ref: "Comment"'
// property value
var Message = mongoose.model("Message", messageSchema);
var Comment = mongoose.model("Comment", commentSchema);

// Home page
app.get("/", function(req, res) {
    //res.render("index");

    // Display all documents from
    // the "messages" collection on the
    // home page
    Message.find({}).populate("comments").exec(function(err, messages) {
        if(err) {
            console.log("Error:", err);
        }
        else {
            // Reverses order of properties
            // in an array of objects
            messages.reverse();
            res.render("index", {messages: messages});
        }
    });
});

// Post message
app.post("/messages", function(req, res) {
    console.log("Message Posted:", req.body);

    var message = new Message({
        name: req.body.name,
        message: req.body.message
    });

    message.save(function(err) {
        if(err) {
            console.log("Error:", err);
        }
        else {
            res.redirect("/");
        }

    });

});

// Post comment using the "_id" field
// from the "messages" collection
app.post("/message/:id", function(req, res) {

    // Show post of comment form in terminal
    console.log("Comment Posted:", req.body);

    // Code to post one comment related to one
    // message via the message id
    Message.findOne( {_id: req.params.id}, function(err, message) {

        var comment = new Comment(req.body);

        comment._message = message._id;

        message.comments.push(comment);

        comment.save(function(err) {
            message.save(function(err) {

                if(err) {
                    console.log("Comment Error", err);
                }
                else {
                    res.redirect("/");
                }

            });

        });

    });

});




// Listen on port 8000
app.listen(8000, function() {
    console.log("Node.js is running on port 8000");
});
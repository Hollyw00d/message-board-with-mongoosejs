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


// Home page
app.get("/", function(req, res) {
    res.render("index");
});

// Post message
app.post("/post-message", function(req, res) {
    console.log("POST", req.body);

    res.redirect("/");
});




// Listen on port 8000
app.listen(8000, function() {
    console.log("Node.js is running on port 8000");
});
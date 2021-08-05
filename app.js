require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
var encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});


mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

//create the schema. userSchema is an object created from mongoose Schema class.
//email = a@b.com , password = qwerty.
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});

// Create the model, collection name = User.
const User = new mongoose.model("User", userSchema);

app.post("/submit", function(req, res) {
  res.send("submitted !");
});

app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err) {
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  })
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser) {
    if (foundUser) {
      if (foundUser.password === password) {
        res.render("secrets");
      }
    } else {
      console.log(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000 !");
});

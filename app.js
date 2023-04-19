//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", async function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
});

    try {
        await newUser.save();
        res.render("secrets");
    } catch (err) {
        console.error(err);
    }
});

app.post("/login", async function(req, res) {
    const userName = req.body.username;
    const password = req.body.password;

    try {
        const foundUser = await User.findOne({email: userName});
        
        if (foundUser && foundUser.password === password) {
            res.render("secrets");
        } else {
            res.send("User not found or incorrect password.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while processing your request.");
    }
});






app.listen(3000, function() {
    console.log("Server is running on port 3000");
});

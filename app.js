//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set('view engine', 'ejs'); //app.use

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));

let items = ['drink water', 'eat food'];

app.get("/", function (req, res) {
    res.render('lists', {
        htmlItems: items
    });
});

app.post("/", function (req, res) {
    let input = req.body.input;
    items.push(input);
    console.log(items);
    res.redirect("/");
});



app.listen(3000, function () {
    console.log("Server started on port 3000.");
});
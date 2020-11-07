//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
var _ = require('lodash');
const app = express();

app.set('view engine', 'ejs'); //app.use

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));

mongoose.connect('mongodb+srv://lovish:2LB3pQaSwiIkrvCt@cluster0.nyykt.mongodb.net/listDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const listSchema = {
    name: String
};

const customListschema = {
    name: String,
    items: [listSchema]
};
const Items = mongoose.model('Items', listSchema);

const CustomList = mongoose.model("CustomList", customListschema);

const introItem = new Items({
    name: 'welcome to To Do List!!🎉'
});

// introItem.save();

const itemsDB = [introItem];


app.get("/", function (req, res) {
    // var datetime = new Date();
    // console.log(datetime.toISOString().slice(0, 10));
    Items.find({}, function (err, items) {
        if (items.length === 0) {
            Items.insertMany(items, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("successfull");
                }
            });
        } else {
            res.render('lists', {
                listName: "To Do List",
                htmlItems: items
            });
        }
    });

});

app.get("/:localHost", function (req, res) {
    const localHost = _.capitalize(req.params.localHost);
    CustomList.findOne({
        name: localHost
    }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                const customLists = new CustomList({
                    name: localHost,
                    items: itemsDB
                });
                customLists.save();
                res.redirect("/" + localHost);
            } else {
                res.render('lists', {
                    listName: foundList.name,
                    htmlItems: foundList.items
                });
            }
        }
    });
});

app.post("/", function (req, res) {
    const input = req.body.input;
    const customInput = req.body.customInput;
    const item = new Items({
        name: input
    });

    if (customInput === "To Do List") {
        item.save();
        res.redirect("/");
    } else {
        CustomList.findOne({
            name: customInput
        }, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+ customInput);
        });
    }
});

app.post("/delete", function (req, res) {
    const deleteDB = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "To Do List") {
Items.findByIdAndRemove(deleteDB, function (err) {
    if (!err) {
        console.log("deleted successfully");
        console.log(deleteDB);
        res.redirect("/");
    }
});
    }else{
        CustomList.findOneAndUpdate({
                    name: listName
                }, {
                    $pull: {
                        items:{
                            _id:deleteDB
                        }
                    }
                }, function (err, foundlist) {
if(!err){
    res.redirect("/"+ listName );
}
        });
    }
    

});


app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port 3000.");
});
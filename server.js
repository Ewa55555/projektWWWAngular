var express = require('express');
var fs = require('fs');
var http = require('http')
var app = express();
var logger = require("morgan");
var path = require("path");
var router = express.Router();
//var session = require('express-session')
//app.use(session({secret: 'ssshhhhh', resave: false,
 //   saveUninitialized: true}));
var bodyParser = require("body-parser");
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/products';
MongoClient.connect('mongodb://localhost:27017/products', function (err, db) {
    if (err) throw err
});
app.set("views", path.resolve(__dirname, "views")); //podkatalog views
app.use(logger("dev"));   //midlewearstack
var mongoose = require('mongoose');
app.use(bodyParser.urlencoded({ extended: false }));  //odkodowuje formularz
//var fileUpload = require('express-fileupload');
//app.use(fileUpload());
app.use(bodyParser.json());
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/products';
var crypto = require('crypto');
var md5sum = crypto.createHash('md5');
var validator = require("email-validator");

var Todo = mongoose.model('Todo', {
    text : String
});
app.get('/', function (req, res) {
    res.sendfile('./public/index.html');
});
app.use(express.static(__dirname + "/public"))
app.post('/register', function (req, res) {
    var username = req.body.login;
    var password = req.body.password;
    var password2 = req.body.password2;
    var mail = req.body.email;
    var ok = false;
    var emailOk = false;
    if (password == password2)
    {
        ok = true;
        hash = crypto.createHash('md5').update(password).digest('hex');
    }
    if(validator.validate(mail)){
        emailOk = true;
    }
    var insertDocument = function (db, callback) {
        db.collection('users').insertOne({"username": username, "password": hash, "email":mail,"role":"user"}, function (err, result) {
            console.log('dodaje do bazy');
            assert.equal(err, null);
            callback();
        });
    };

    var searchLogin = function(db,callback)
    {

        db.collection('users').find({"username":username}).count(function (e, count) {
            if(count>0)
            {
                res.send("Taki login już istnieje");
                console.log("Taki login już istnieje");
                //res.redirect('/register');
            }
            else
            {
                if(ok && emailOk)
                {
                    //delete req.session.error;
                    callback();
                }
                else
                {
                    if(!ok) {
                        res.send("Hasła nie są takie same");
                        console.log("Hasła nie są takie same");
                    }else{
                        res.send("Wprowadzony e-mail nie jest poprawny");
                        console.log("Wprowadzony e-mail nie jest poprawny")
                    }
                    //res.redirect('/register');
                }

            }
        });

    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        searchLogin(db,function() {
                insertDocument(db, function () {
                    db.close();
                });
                //res.redirect????
                });
        });


});
app.get('/productsList', function(req, res) {

        var products = function(db,callback) {
            db.collection('products').find().toArray(function (err, results) {
                return callback(results);
            });

        };
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            products(db,function(array) {
                db.close();
                console.log(array);
                res.json(array);
            });
        });

});




http.createServer(app).listen(3000, function() {
    console.log("Dziala");
});
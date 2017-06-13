var express = require('express');
var fs = require('fs');
var http = require('http')
var app = express();
var logger = require("morgan");
var path = require("path");
var router = express.Router();
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
var fileUpload = require('express-fileupload');
app.use(fileUpload());
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
    console.log("jestem w registr post");
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
            }
            else
            {
                if(ok && emailOk)
                {
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
            res.status(200).send('OK');
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

app.post('/login', function (req, res)
{
    var username = req.body.login;
    console.log(username);
    var password = req.body.password;
    var hash =crypto.createHash('md5').update(password).digest('hex');
    var searchLogin = function(db,callback) {
        db.collection('users').find({"username": username}).count(function (e, count) {
            if (count > 0) {
                console.log("blee");
                db.collection('users').find({"username": username}).toArray(function (err, results) {
                    console.log(results[0]['password']);
                    if (results[0]['password'] == hash) {
                        console.log("Dobre hasło")
                        res.status(200).send('OK');
                    }
                    else {
                        req.send("Podane hasło jest błędne");
                    }
                });
            }
            else {
                req.send("Podany login nie istnieje");
            }

        });

    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        searchLogin(db,function() {
            db.close();
        });
    });


});

app.post('/addproduct', function(req, res) {
    var string2;
    console.log("description"+ req.body.description);
    var insertDocument = function (db,callback) {
        console.log("widze id");
        db.collection('products').insertOne({"id": Date.now(), "name": req.body.name,
            "description": req.body.description,"path": string2, "marks": 0, "users": 0}, function (err, result) {
            assert.equal(err, null);
            callback();
        });
    };

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        insertDocument(db,function(){
            db.close();
            res.status(200).send('OK');
        });
    });

});

app.get('/product/:id', function (req, res) {

    {
        var products = function(db,callback) {
            var id = req.params.id;
            console.log(id);
            db.collection('products').find({"id": parseInt(id, 10)}).toArray(function (err, results) {
                console.log("produkt");
                console.log(results);
                return callback(results);
            });

        };
        var findComments = function(db, callback){
            var id = req.params.id;
            db.collection('comments').find({"productId": id}).toArray(function(err, results){
                console.log("komentarze");
                console.log(results);
                return callback(results);
            })
        };
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            products(db,function(array) {
                findComments(db, function(c){
                    db.close();
                    res.json(c.concat(array[0]));
                });

            });
        });

    }
});

app.post('/comment/:id', function(req, res){
    console.log("weszlam do coment");
        var insertDocument = function (db,callback) {
            var productId = req.params.id;
            db.collection('comments').insertOne({"id": Date.now(), "productId": productId, "comment": req.body.comment,
                "user": 'Anonim', "time": new Date()}, function (err, result) {
                assert.equal(err, null);
                callback();
            });
        };
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            insertDocument(db,function(){
                db.close();
                res.send('OK');
            });


        });

})

app.post('/mark/:id', function(req, res){

        var insertDocument = function (db,callback) {
            var productId = req.params.id;
            console.log("w marku mark"+req.body);
            db.collection('marks').insertOne({"id": Date.now(), "productId": productId, "mark": req.body,
                "user": 'Anonim', "time": new Date()}, function (err, result) {
                assert.equal(err, null);
                console.log("alo");
                db.collection('products').update(
                    {"id": parseInt(productId, 10)},
                    { $inc: { "marks": parseInt(req.body, 10), "users": 1 } }, function(err, result){
                        callback();
                    }
                )

            });


        };
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            insertDocument(db,function(){
                db.close();
                res.send('OK');
            });

        });

});

http.createServer(app).listen(3000, function() {
    console.log("Dziala");
});
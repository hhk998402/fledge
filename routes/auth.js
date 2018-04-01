var express = require('express');
var router = express.Router();
var player = require('../model/participants').participants;
var authenticate = require('../authenticate');
var bcrypt = require('bcrypt-nodejs');
var cheerio = require('cheerio');
var extend = require('util')._extend;
var path = require('path');
var nodemailer = require('nodemailer');
var fs = require('fs');

var MongoClient   = require('mongodb').MongoClient;
var url = "mongodb://teamCodepark:teamCodepark@ds125774.mlab.com:25774/codepark";


router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//This is for verification on each login

router.post('/verifyPlayer', function (req, res) {
    authenticate.authenticate(req, res);
});

//Post Registration - EMAIL AUTHENTICATION (Sending EMAIL)
router.post('/save', function (req, res, next) {

    var success=true;
    var rand = Math.random().toString(36).slice(2);
    var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    var data = new player({
        name: req.body.name,
        username: req.body.username,
        password: hash,
        email: req.body.email,
        hashcode : rand,
        organisation: req.body.organisation,
        phone: req.body.phone,
        authcomp : false
    });
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(req.body.email)) {
        res.json({code: '0', message: 'Invalid email!'});
        success=false;
    }
    re = /^[A-Za-z0-9_ -]{3,20}$/;
    if (!re.test(req.body.username)) {
        res.json({code: '0', message: 'Invalid Username'});
        success=false;
    }
    else if(!req.body.username){
        res.json({code: '0', message: 'Invalid Username'});
        success=false;
    }

    re = /^[A-Za-z ]{3,50}$/;
    if (!re.test(req.body.name)) {
        res.json({code: '0', message: 'Invalid Name'});
        success=false;
    }
    else if (!req.body.name) {
        res.json({code: '0', message: 'Invalid Name'});
        success=false;
    }
    re = /^[A-Za-z ]{3,50}$/;
    if (!re.test(req.body.organisation)) {
        res.json({code: '0', message: 'Invalid Organisation Name!'});
        success=false;
    }
    else if(!req.body.organisation){
        res.json({code: '0', message: 'Invalid Organisation Name!'});
    }
    re = /^[A-Za-z0-9_ -]{3,20}$/;
    if (!re.test(req.body.password)) {
        res.json({code: '0', message: 'Invalid Password!'});
        success=false;
    }
    re = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    if (!re.test(req.body.phone)) {
        res.json({code: '0', message: 'Invalid Contact Number.'});
        success=false;
    }
    if(success) {
        data.save(function (err, doc) {
            if (err && err.code == 11000) {
                res.json({code: '0', message: 'This email or username is already registered!'})
            }
            else if (err && err.code != 66) {
                res.json({code: '0', message: err})
            }
            else if (err) {
                res.json({code: '0', message: err})
            }
            else {
                res.json({code: '1', message: "Verify your email address using the link sent to you."});
                console.log(rand);
                var myobj = {email: req.body.email, hashcode: rand, authcomp: false};
                var htmlPath = __dirname + '/index1.html';
// html file to output modified html to
                var outPath = __dirname + '/index2.html';
                var s = "http://" + req.headers.host + '/auth/' + "verifyMail?code=" + myobj.hashcode + "&email=" + myobj.email;
                console.log(req.headers.host);
// load in the json file with the replace values
                fs.readFile(htmlPath, {encoding: 'utf8'}, function (error, data) {
                    var $ = cheerio.load(data); // load in the HTML into cheerio
                    // the keys are class names, use them to pick out what element
                    // we are going to modify & then replace the innerHTML content
                    // of that element
                    //$('a.').html(replaceValues[key]);
                    //console.log($('#herehere').attr('href'));
                    var inputs = $('#herehere');
                    inputs.attr('href', function (i, id) {
                        return id.replace('codepark.in', s);
                    });
                    fs.writeFile(outPath, $.html());
                    var content;
                    fs.readFile(path.resolve(__dirname, 'index2.html'), 'UTF-8', function read(err, data) {
                        if (err) {
                            throw err;
                        }
                        content = data;
                        var smtpTransport = nodemailer.createTransport("smtps://codepark.auth%40gmail.com:" + encodeURIComponent('hhkcodepark') + "@smtp.gmail.com:465");
                        if(content !== null){
                            var mailOptions = {
                                to: req.body.email,
                                from: 'codepark.auth@gmail.com',
                                subject: 'CodePark - Email Authentication',
                                html : content
                            };
                        }
                        else{
                            var mailOptions = {
                                to: req.body.email,
                                from: 'codepark.auth@gmail.com',
                                subject: 'CodePark - Email Authentication',
                                text : "You are receiving this because you (or someone else) have signed up to CodePark."+ "\n\n" +
                                "Please click on the following link, or paste this into your browser to complete the process:\n\n" + s + "\n\n" +
                                "If you did not request this, please ignore this email."
                            };
                        }
                        smtpTransport.sendMail(mailOptions, function (err) {
                            console.log("Email Sent");
                        });
                        // Invoke the next step here however you like
                        // Put all of the code here (not the best solution)
                    });
                });
            }
        });
    }
});

router.get('/verifyMail', function(req, res, next) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(req.query.email)) {
        res.json({code: '0', message: 'Incorrect Link!'});
    }
    else {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            db.collection("participants").findOne({email: req.query.email}, function (err, result) {
                if (err) throw err;
                if (!result) {
                    // res.json({code: '0', message: 'You have not yet registered!'});
                    res.send("You haven't registered !");
                }

                else if(result.authcomp){
                    //res.json({code: '0', message: 'Already Authorised'});
                    res.redirect('/');
                }
                else {
                    var re = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
                    if (re.test(req.query.code)) {
                        if (req.query.code !== result.hashcode)
                        //res.json({code: '0', message: 'Incorrect Hash Code/Hash Code expired'});
                            res.send("Hash code Expired or is tampered !");
                        else {
                            //console.log(result);
                            var myquery = extend({}, result);
                            delete myquery._id;
                            var newvalues = extend({}, myquery);
                            newvalues.authcomp=true;
                            delete myquery.hashcode;
                            //console.log(newvalues);

                            db.collection("participants").updateOne(myquery, newvalues, function (err, res1) {
                                if (err) throw err;
                                //res.json({code: '0', message: 'Account has been Authorized'});
                                res.redirect('/');
                                db.close();
                            });
                        }
                    }
                    else
                        res.json({code: '0', message: 'Incorrect Hash Code'});
                    //res.json({code: '0', message: 'Incorrect HashCode!'});
                }
                db.close();
            });
        });
    }
});

module.exports = router;
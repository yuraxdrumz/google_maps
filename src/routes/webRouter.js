/* eslint no-undef: "error" */
/* eslint-env node */
var express = require('express');
var router = express.Router();
var auth = require('./auth');
var mongoose = require('mongoose');
var Location = require('../models/location-model');

var multiParty = require('connect-multiparty');
var multiPartyMiddleware = multiParty();
var fs = require('fs');
var S3FS = require('s3fs');
var s3fsImpl = new S3FS('yurasbucket776',{
    accessKeyId : 'AKIAJVYEGXUOKVMV5JEA',
    secretAccessKey:'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'
});
s3fsImpl.create();
module.exports = function () {

    router.get('/', function (req,res) {

        var msg = req.flash('message');
        if (req.user) {
            req.logout();
            res.render('home',{message:msg});
        } else {
            res.render('home',{message:msg});
        }
    });

    router.get('/register', function (req,res) {
        var msg = req.flash('message');
        res.render('register',{message:msg});
    });

    router.get('/main', auth, function (req,res) {
        res.render('main',{user:req.user});
    });

    router.get('/add-review', auth, function (req,res) {
        res.render('add_review',{user:req.user});
    });

    router.post('/add-review', multiPartyMiddleware, auth, function (req,res,next) {
        var file = req.files.file;
        var stream = fs.createReadStream(file.path);
        var img_name = file.originalFilename;
        return s3fsImpl.writeFile(file.originalFilename, stream)
            .then(function () {
                var place = req.body.location;
                var place_divide = place.split('*');
                var location_name = place_divide[1];
                var location_id = place_divide[0];
                var location = new Location({
                    _id: mongoose.Types.ObjectId(),
                    location_name:location_name,
                    location_id:location_id,
                    place:req.body.place,
                    img_url:'https://s3.amazonaws.com/yurasbucket776/' + img_name,
                    review:req.body.review,
                    user_id:req.user._id,
                    user_fname:req.user.first_name,
                    user_lname:req.user.last_name
            });
            location.save().then(function () {
                res.redirect('/main');
            }).catch(function (err) {
                next(err);
            });
        }).catch(function (err) {
            next(err);
        });
    });
    router.get('/loc/:place_id', auth, function (req,res,next) {
        Location.find({location_id:req.params.place_id}).exec()
            .then(function (data) {
                res.json(data);
        })
        .catch(function (err) {
            next(err);
        });
    });
    router.get('/my-reviews', auth, function (req,res,next) {
        Location.find({user_id:req.user._id}).exec()
            .then(function (data) {
                res.render('my_reviews', {reviews:data,user:req.user});
        })
        .catch(function(err){
            next(err);
        });
    });

    router.get('/edit/:id', auth, function (req,res,next) {
        Location.findOne({_id:req.params.id}).exec()
            .then(function (found) {
                res.render('edit_review',{review:found,user:req.user});
        })
        .catch(function (err) {
            next(err);
        });
    });

    router.post('/edit/:id', auth, function (req,res,next) {
        Location.findOneAndUpdate({_id:req.params.id},{
            place:req.body.place,
            img_url:req.body.img_url,
            review:req.body.review
        }).exec()
            .then(function () {
                res.redirect('/main');
        })
        .catch(function (err) {
            next(err);
        });
    });
    return router;
};




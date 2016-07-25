
var express = require('express');
var router = express.Router();
var auth = require('./auth');
var mongoose = require('mongoose');
var Location = require('../models/location-model');

module.exports = function(){
    router.get('/',function (req,res) {
        res.render('home');
    });

    router.get('/register',function (req,res) {
        res.render('register')
    });

    router.get('/main',auth,function (req,res) {
        res.render('main',{user:req.user});
    });

    router.get('/add-review',auth,function(req,res){
        res.render('add_review',{user:req.user})
    });

    router.post('/add-review',auth,function(req,res,next){
        var location = new Location({
            _id: mongoose.Types.ObjectId(),
            location_id:req.body.location,
            place:req.body.place,
            img_url:req.body.img,
            review:req.body.review,
            user_id:req.user[0]._id,
            user_email:req.user[0].email
        });
        location.save().then(function(){
            res.redirect('/main');
        }).catch(function(err){
            next(err);
        });
    });

    router.get('/loc/:place_id',auth,function(req,res,next){
        Location.find({location_id:req.params.place_id}).exec().then(function(data){
            res.json(data)
        })
        .catch(function(err){
            next(err);
        })
    });
    return router;
}




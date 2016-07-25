
var express = require('express');
var router = express.Router();
var auth = require('./auth');
var mongoose = require('mongoose');
var Location = require('../models/location-model');

module.exports = function(){

    router.get('/',function (req,res) {
        if(req.user){
            req.logout();
            res.render('home')
        }else{
            res.render('home');
        }
    });

    router.get('/register',function (req,res) {
        res.render('register')
    });

    router.get('/main',auth,function (req,res) {
        res.render('main',{user:req.user[0]});
    });

    router.get('/add-review',auth,function(req,res){
        res.render('add_review',{user:req.user[0]})
    });

    router.post('/add-review',auth,function(req,res,next){
        var place = req.body.location;
        var place_divide = place.split('*');
        var location_name = place_divide[1];
        var location_id = place_divide[0];

        var location = new Location({
            _id: mongoose.Types.ObjectId(),
            location_name:location_name,
            location_id:location_id,
            place:req.body.place,
            img_url:req.body.img,
            review:req.body.review,
            user_id:req.user[0]._id,
            user_fname:req.user[0].first_name,
            user_lname:req.user[0].last_name
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
    router.get('/my-reviews',auth,function(req,res,next){
        Location.find({user_id:req.user[0]._id}).exec().then(function(data){
            res.render('my_reviews',{reviews:data,user:req.user[0]});
        })
        .catch(function(err){
            next(err);
        });
    });

    return router;
}




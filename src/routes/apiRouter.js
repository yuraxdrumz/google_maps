var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

module.exports = function (passport) {

    router.post('/register',passport.authenticate('local-signup',{successRedirect:'/main',failureRedirect:'/register',failureFlash:true}));

    router.post('/login', passport.authenticate('local-login',                  {successRedirect:'/main',failureRedirect:'/',failureFlash:true}));

    router.get('/logout',function (req,res) {
        req.logout();
        res.redirect('/');
    })

    return router;
};

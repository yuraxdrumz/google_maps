var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

module.exports = function (passport) {

    router.post('/register',passport.authenticate('local-signup',{successRedirect:'/main',failureRedirect:'/'}));

    router.post('/login', passport.authenticate('local-login',                  {successRedirect:'/main',failureRedirect:'/'}));

    router.get('/logout',function (req,res) {
        req.logout();
        res.redirect('/');
    })

    return router;
};

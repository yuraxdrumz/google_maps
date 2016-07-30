var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

module.exports = function (passport) {

    router.post('/register',passport.authenticate('local-signup',{successRedirect:'/main',failureRedirect:'/register',failureFlash:true}));

    router.post('/login', passport.authenticate('local-login',                  {successRedirect:'/main',failureRedirect:'/',failureFlash:true}));

    router.get('/auth/google',
        passport.authenticate('google', { scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read'
        ] }
    ));

    router.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/' }),
        function(req, res) {
            res.redirect('/main');
        });
    router.get('/logout',function (req,res) {
        req.logout();
        res.redirect('/');
    })

    return router;
};

/**
 * Created by Jbt on 22-Jul-16.
 */
var express = require('express');
var router = express.Router();
var auth = require('./auth');

router.get('/',function (req,res) {
    res.render('home');
});


router.get('/register',function (req,res) {
    res.render('register')
})

router.get('/main',auth,function (req,res) {
    res.render('main',{user:req.user})
})

module.exports = router;

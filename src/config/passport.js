/**
 * Created by Jbt on 22-Jul-16.
 */
var mongoose = require('mongoose');
var User = require('../models/user-model');
var localStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var configAuth = require('./auth');
module.exports = function (passport) {
    passport.serializeUser(function (user,done) {
        return done(null,user._id)
    });
    passport.deserializeUser(function (id,done) {
        User.findOne({_id:id}).exec().then(function (user) {
            return done(null, user)
        })
    });

    passport.use('local-login',new localStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true
    },
        function (req, email, password, done) {
            User.findOne({email:email}).exec().then(function (user) {
                if(!user){
                    return done(null,false,req.flash('message','user not found'));
                }
                if(!(user.checkValid(password))){
                    return done(null,false,req.flash('message','password is incorrect'))
                }
                return done(null, user)
            })
                .catch(function (err) {
                    done(err)
                })
        }
    ));

    passport.use('local-signup', new localStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true
    },
        function (req,email,password,done) {
            User.findOne({email:email}).exec().then(function (user) {
                if(user) {
                    return done(null, false,req.flash('message','This email is already taken'))
                }else{
                    var user = new User({
                        _id: mongoose.Types.ObjectId(),
                        first_name: req.body.f_name,
                        last_name: req.body.l_name,
                        email: email
                    });
                    user.setPassword(password);
                    user.save().then(function () {
                        return done(null, user)
                    })
                        .catch(function (err) {
                            done(err)
                        })
                }
            })
                .catch(function (err) {
                    done(err)
                })
        }

    ));
    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            if(!req.user){
                User.findOne({'google.id':profile.id}).exec()
                .then(function(user){
                    if(user !== null){
                        user.google.id = profile.id
                        user.google.first_name = profile.name.givenName;
                        user.google.last_name=profile.name.familyName;
                        user.first_name = profile.name.givenName;
                        user.last_name = profile.name.familyName;
                        user.google.email = profile.email
                        user.email = profile.email
                        user.save().then(function(){
                            console.log(user)
                            return done(null,user)
                        })
                    }else{
                        var user = new User({
                            _id: mongoose.Types.ObjectId(),
                            'google.id' : profile.id,
                            'google.first_name' : profile.name.givenName,
                            'google.last_name' : profile.name.familyName,
                            'google.email' : profile.email,
                            first_name:profile.name.givenName,
                            last_name:profile.name.familyName,
                            email : profile.email
                        })
                        user.save().then(function(){
                            return done(null,user);
                        })
                    }
                })
            }


        });
    }));

};

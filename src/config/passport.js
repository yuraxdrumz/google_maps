/**
 * Created by Jbt on 22-Jul-16.
 */
var mongoose = require('mongoose');
var User = require('../models/user-model');
var localStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

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

    ))



};

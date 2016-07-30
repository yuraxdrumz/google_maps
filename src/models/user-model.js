/**
 * Created by Jbt on 22-Jul-16.
 */
var mongoose = require('mongoose');
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    first_name:String,
    last_name:String,
    email:{
        type:String
    },
    salt:String,
    hash:String,
    google:{
        id:String,
        first_name:String,
        last_name:String,
        email:String
    }
});

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.checkValid = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000 ,64).toString('hex');
    return this.hash === hash;
};

module.exports = mongoose.model('User', userSchema);

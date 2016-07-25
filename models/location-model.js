var mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    location_name:String,
    location_id:String,
    place:String,
    img_url:String,
    review:String,
    user_id:String,
    user_fname:String,
    user_lname:String,
    date: {type:Date,default:Date.now}
});

module.exports = mongoose.model('Location', locationSchema);

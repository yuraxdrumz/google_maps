/**
 * Created by Jbt on 22-Jul-16.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var exphbs  = require('express-handlebars');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/gmaps');

var passport = require('passport');
require('./config/passport')(passport);
var session = require('express-session');
var webRouter = require('./routes/webRouter')();
var apiRouter = require('./routes/apiRouter')(passport);






app.engine('.hbs',exphbs({defaultLayout:'body',extname:'.hbs'}));
app.set('view engine', '.hbs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
    secret:'express-app',
    resave:false,
    saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());


var con = mongoose.connection;
con.on('error',console.error.bind(console,'connection error'));
con.on('open',function () {

    app.use('/',webRouter);
    app.use('/',apiRouter);
    app.listen(port,function () {
        console.log('server is up on port ' + port);
    });
});






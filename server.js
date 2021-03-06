/*eslint no-undef: "error"*/
/*eslint-env node*/
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('./src/routes/sockets')(io);
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var exphbs  = require('express-handlebars');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/gmaps');
var flash = require('connect-flash');

var passport = require('passport');
require('./src/config/passport')(passport);
var session = require('express-session');
var webRouter = require('./src/routes/webRouter')();
var apiRouter = require('./src/routes/apiRouter')(passport);

var multiParty = require('connect-multiparty');
var multiPartyMiddleware = multiParty();

app.use(multiPartyMiddleware);
app.set('views', __dirname + '/src/views');
app.engine('.hbs',exphbs({defaultLayout:'body',extname:'.hbs',layoutsDir:'src/views/layouts',partialsDir:'src/views/partials'}));
app.set('view engine', '.hbs');
app.use(flash());
app.use(express.static(__dirname + '/src/public'));
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
    http.listen(port,function () {
        console.log('server is up on port ' + port);
    });
});


module.exports = app;



var express        = require('express');
var path           = require('path');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var passport       = require('passport');
var expressSession = require('express-session');
var cookieParser   = require("cookie-parser");
var jwt            = require('jsonwebtoken');
var expressJWT     = require('express-jwt');
var methodOverride = require('method-override');
var connect-flash  = require('connect-flash');
var app            = express();



var databaseURL = 'mongodb://localhost:27017spoken';
mongoose.connect(databaseURL);

// Middleware
app.use(cookieParser());
// app.use(expressSession({secret: 'mySecretKey', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setting up the Passport Strategies
require("./config/passport")(passport)

// app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email'} ));

// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', {
//     successRedirect: '/',
//     failureRedirect: '/'
//   })
// );

// app.get("/logout", function(req, res){
//   req.logout();
//   res.redirect("/")
// })

app.listen(3000);


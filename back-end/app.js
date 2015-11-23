var express        = require('express');
var path           = require('path');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var passport       = require('passport');
var expressSession = require('express-session');
var cookieParser   = require("cookie-parser");
var jwt            = require('jsonwebtoken');
// var expressJWT     = require('express-jwt');
var methodOverride = require('method-override');
var connectFlash  = require('connect-flash');
var app            = express();



var databaseURL = 'mongodb://localhost:27017/spoken';
mongoose.connect(databaseURL);

var routes = require('./config/routes')

// Middleware
app.use(cookieParser());
// app.use(expressSession({secret: 'mySecretKey', resave: true, saveUninitialized: true}));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === "object" && "_method" in req.body){
    var method = req.body._method;
    delete req.body._method;
    return method; 
  }
}));
app.use('/api', routes)

// Setting up the Passport Strategies for FACEBOOK
// require("./config/passport")(passport)

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

// Setting Up the Local Login Strat



app.listen(3000);
console.log("App listening local 3000")


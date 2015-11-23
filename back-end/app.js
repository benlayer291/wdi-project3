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
var connectFlash   = require('connect-flash');
var app            = express();

var config      = require('./config/config');
var secret      = require('./config/config').secret;
var databaseURL = 'mongodb://localhost:27017/spoken';
mongoose.connect(databaseURL);

require('./config/passport')(passport);

var routes = require('./config/routes')

// Middleware
app.use(cookieParser());
app.use(expressSession({secret: 'mySecretKey', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
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

// Protect your api with JWT here - CHECKS FOR THE TOKEN
app.use('/api', expressJWT({secret: secret})
  .unless({
    path: [
      { url: '/api/login', methods: ['POST'] },
      { url: '/api/register', methods: ['POST'] }
    ]
  })
);

// Show better errors for protected pages (UnauthorizedError) - IF THERE IS NO TOKEN
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({message: 'You need an authorization token to view confidential information.'});
  }
});

var routes = require('./config/routes')
app.use('/api', routes)


// Setting Up the Local Login Strat



app.listen(3000);
console.log("App listening local 3000")


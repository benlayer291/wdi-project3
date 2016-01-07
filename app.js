var express        = require('express');
var cors           = require('cors');
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
var port           = process.env.PORT || 3000;
var app            = express();

var config      = require('./config/config');
var secret      = require('./config/config').secret;
// var databaseURL = 'mongodb://localhost:27017/spoken';
var databaseURL = config.database;
mongoose.connect(databaseURL);

require('./config/passport')(passport);

// Middleware
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());
// app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === "object" && "_method" in req.body){
    var method = req.body._method;
    delete req.body._method;
    return method; 
  }
}));

app.use('/api', expressJWT({secret: secret})
  .unless({
    path: [
      { url: '/api/login',    methods: ['POST'] },
      { url: '/api/register', methods: ['POST'] },
      { url: '/api/facebook', methods: ['POST'] },
      { url: '/api/posts',    methods: ['GET'] },
      { url: '/api/search',   methods: ['POST'] }
    ]
  })
);

//Setting current user variable
app.use(function(req, res, next){
  global.currentUser = req.user;
  next();
})

app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({message: 'You need an authorization token to view confidential information.'});
  }
});

var routes = require('./config/routes')
app.use('/api', routes)

app.use(express.static(__dirname + "/public"));

app.get('/', function(req, res) {
  res.sendFile('/index.html');
})

app.listen(port);
console.log("App listening on "+ port);


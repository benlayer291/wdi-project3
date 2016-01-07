var passport = require("passport");
var User     = require('../models/user');
var secret   = require('../config/config').secret 
var jwt      = require('jsonwebtoken');

function register(req, res, next) {
  var localStrategy = passport.authenticate('local-signup', function(err, user, info) {
    if (err) return res.status(500).json({ message: 'Something went wrong!' });
    if (info) return res.status(401).json({ message: info.message });
    if (user) return res.status(401).json({ message: 'User already exists!' });

    // User has authenticated so issue token 
    var token = jwt.sign(user, secret, { expiresIn: 60*60*24 });

    // Send back the token to the front-end to store
    return res.status(200).json({ 
      success: true,
      message: "Thank you for authenticating",
      token: token,
      user: user
    });
  });

  return localStrategy(req, res, next);
};


function login(req, res, next) {
  User.findOne({
    "local.email": req.body.email
  }, function(err, user) {
    if (err) return res.status(500).json(err);
    if (!user) return res.status(403).json({ message: 'No user found.' });
    if (!user.validPassword(req.body.password)) return res.status(403).json({ message: 'Authentication failed.' });

    var token = jwt.sign(user, secret, { expiresIn: 60*60*24 });
    return res.status(200).json({ 
      success: true,
      message: "Thank you for authenticating",
      token: token,
      user: user
    });
  });
};

function facebook(req, res, next) {
  var profile = req.body;
  console.log(profile);

  // Could possibly check for a valid access token here?
  var access_token = profile.access_token
  if (!access_token) return res.status(500).json({ message: 'No Access Token provided.' });
  
  // Facebook and LinkedIn
  User.findOne({ 
    'local.email' : profile.email 
  }, function(err, user) {
    if (err) return res.status(500).json({ message: 'Something went wrong.' });

    // Update existing user
    if (user) {
      user.facebook.id           = profile.id;
      user.facebook.access_token = profile.access_token;
      user.local.firstName       = profile.first_name;
      user.local.lastName        = profile.last_name;
      user.local.picture         = profile.picture + '?type=large';

      return user.save(function(err, user) {
        if (err || !user) return res.status(500).json({ message: 'Something went wrong.' });
        var token = jwt.sign(user, secret, { expiresIn: 60*60*24 });
        return res.status(200).json({ 
          success: true,
          message: "Thank you for authenticating",
          token: token,
          user: user
        });
      });
    }

    // Create new user
    var newUser                   = new User();
    newUser.facebook.id           = profile.id;
    newUser.facebook.access_token = profile.access_token;
    newUser.local.firstName       = profile.first_name;
    newUser.local.lastName        = profile.last_name;
    newUser.local.picture         = profile.picture + '?type=large';
    newUser.local.email           = profile.email;
    newUser.local.password        = profile.access_token;

    if (!newUser.email) {
      newUser.local.email = "temp-"+ profile.access_token+ "@facebook.com"
    } 

    return newUser.save(function(err, user) {
      console.log(newUser);
      if (err) return res.status(500).json({ message: 'Something went wrong.' });
      var token = jwt.sign(user, secret, { expiresIn: 60*60*24 });
      return res.status(200).json({ 
        success: true,
        message: "Thank you for authenticating",
        token: token,
        user: user
      });
    });
  });
}


module.exports = {
  login: login,
  register: register,
  facebook: facebook
}
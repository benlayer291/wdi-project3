var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');


module.exports = function(passport){

 passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, function(req, email, password, done) {

    User.findOne({ 'local.email' : email }, function(err, user) {
     if (err) return done(err, false, { message: "Somethig went wrong"});

       // If there is a user with this email
      if (user) {
        return done(null, false, { message: "This email is already used!"});
      } else {

        var newUser            = new User();
        newUser.local.email    = email;
        newUser.local.password = User.encrypt(password);
        newUser.local.firstName = req.body.firstName;
        newUser.local.lastName = req.body.lastName;
        newUser.local.picture  = req.body.picture;
        newUser.local.birthday = req.body.birthday;
        newUser.local.tagline = req.body.tagline;

        newUser.save(function(err, user) {
          if (err) return done(err, false, {message : "something went wrong"});
          return done(null, user);
        });
      }           
    });
  }));
}
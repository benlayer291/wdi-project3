var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');


module.exports = function(passport){

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      console.log('deserializing user:',user);
      done(err, user);
    });
  });

 passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, function(req, email, password, done) {

    User.findOne({ 'local.email' : email }, function(err, user) {
     if (err) return done(err);

       // If there is a user with this email
      if (user) {
        return done(null, false, req.flash('errorMessage', 'This email is already used!'));
      } else {

        var newUser            = new User();
        newUser.local.email    = email;
        newUser.local.password = User.encrypt(password);

        newUser.save(function(err, user) {
          if (err) return done(err);
          return done(null, user);
        });
      }           
    });
  }));


  //FACEBOOK PASSPORT LOGIN 

  passport.use('facebook', new FacebookStrategy({
    clientID        : process.env.SPOKEN_FACEBOOK_API_KEY,
    clientSecret    : process.env.SPOKEN_FACEBOOK_API_SECRET,
    callbackURL     : 'http://localhost:3000/auth/facebook/callback',
    enableProof     : true,
    profileFields   : ['name', 'emails', 'age_range', 'picture'],
  }, function(access_token, refresh_token, profile, done) {

    // // Use this to see the information returned from Facebook
    console.log(profile)

    process.nextTick(function() {

      User.findOne({ 'fb.id' : profile.id }, function(err, user) {
        if (err) return done(err);
        if (user) {
          return done(null, user);
        } else {

          var newUser = new User();
          newUser.fb.id           = profile.id;
          newUser.fb.access_token = access_token;
          newUser.fb.firstName    = profile.name.givenName;
          newUser.fb.lastName     = profile.name.familyName;
          newUser.fb.email        = profile.emails[0].value;
          newUser.fb.birthday    = profile.birthday;
          newUser.fb.picture      = profile.picture;

          newUser.save(function(err) {
            if (err) return done(err);

            return done(null, newUser);
          });
        }

      });


    });
  }));

}
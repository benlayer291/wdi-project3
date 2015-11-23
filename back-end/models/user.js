var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');


var userSchema = mongoose.Schema({
  fb: {
    id: String,
    access_token: String,
    firstName: String,
    lastName: String,
    email: String,
    birthday: String,
    picture: String,
  },
  local: {
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    picture: String,
    birthday: String,
    picture: String,
  },
  description: String
});


// userSchema.local.pre('save', function(next){
//   var user = this;

//   //Only hash password if has been modified or new
//   if (!user.isModified('password')) return next();
//   bcrypt.genSalt(5, function(err, salt){
//     if (err) return next(err);

//     //Hash the password using our new salt
//     bcrypt.hash(user.password, salt, function(err, hash){
//       if (err) return next(err)

//       user.password = hash;
//       next();
//     });
//   });
// });

// userSchema.local.methods.authenticate = function(password, callback) {
//   bcrypt.compare(password, this.password, function(err, isMatch){
//     callback(null, isMatch)
//   }) 
// }

module.exports = mongoose.model('User', userSchema);
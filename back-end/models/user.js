var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');


var userSchema = mongoose.Schema({
  // fb: {
  //   id: String,
  //   access_token: String,
  //   firstName: String,
  //   lastName: String,
  //   email: String,
  //   birthday: String,
  //   picture: String,
  // },
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

userSchema.statics.encrypt = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
}


// userSchema.local.methods.authenticate = function(password, callback) {
//   bcrypt.compare(password, this.password, function(err, isMatch){
//     callback(null, isMatch)
//   }) 
// }

module.exports = mongoose.model('User', userSchema);
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');


var userSchema = mongoose.Schema({
  local: {
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    picture: String,
    birthday: String,
    tagline: String,
    posts: [{ type: mongoose.Schema.ObjectId, ref: 'Post' }]
  }
});

userSchema.statics.encrypt = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);



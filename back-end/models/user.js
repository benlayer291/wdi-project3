var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  fb: {
    id: String,
    access_token: String,
    firstName: String,
    lastName: String,
    email: String,
    birthday: String,
    picture: String,
    description: String
    // post: 
    // request:
  }
});

module.exports = mongoose.model('User', userSchema);
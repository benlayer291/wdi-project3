var mongoose   = require('mongoose');

var postSchema = new mongoose.Schema({
  _creator: { type: String, ref: 'User' },
  where: {type: String, required: true},
  when: {type: String, required: true},
  what: {type: String, required: true},
  status: {type: String, default: 'pending'}
})

module.exports = mongoose.model('Post', postSchema);
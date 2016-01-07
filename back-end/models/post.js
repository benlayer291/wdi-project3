var mongoose   = require('mongoose');
var Request    = require('./request');

var postSchema = new mongoose.Schema({
  // _creator:  { type: String, ref: 'User' },
  where:     { type: String, required: true },
  lattitude: { type: String, required: true },
  longitude: { type: String, required: true },
  when:      { type: String, required: true },
  what:      { type: String, required: true },
  status:    { type: String, default: 'pending' },
  requests: [Request.schema]
})

postSchema.index({ where: "text" });

module.exports = mongoose.model('Post', postSchema);
var mongoose   = require('mongoose');

var requestSchema = new mongoose.Schema({
  requester_id: {type: String, required: true},
  requester_firstName: String,
  requester_lastName: String,
  requester_email: String,
  requester_picture: String,
  message: String,
  status: {type: String, default: 'pending'}
})

module.exports = mongoose.model('Request', requestSchema);
var mongoose   = require('mongoose');

var requestSchema = new mongoose.Schema({
  requester_id: {type: String, required: true},
  // receiver_id: {type: String, required: true},
  message: String,
  status: {type: String, default: 'pending'}
})

module.exports = mongoose.model('Request', requestSchema);
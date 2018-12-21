const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomercareSchema = new Schema({
  name: {
    type: String,
    required: true,
    max: 100
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  last_action: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Number // 0 = offline, 1 = idle, 2 = active. >=1 would be online
  }
});

module.exports = mongoose.model('Customercare', CustomercareSchema);

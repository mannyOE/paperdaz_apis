const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DisbmanagerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Number
  },
  loanTaken: {
    type: Number
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  dateSuspended: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Disbmanager', DisbmanagerSchema);

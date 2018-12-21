const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  loanName: {
    type: String,
    required: true,
    unique: true,
    max: 100
  },
  description: {
    type: String,
    required: true,
    unique: true,
    max: 250
  },
  interestRate: {
    type: Number,
    required: true
  },
  image: {
      type: String,
      default: ""
  },
  icon:  {
      type: String,
      default: ""
  },
  created: {
    type: Date,
    default: Date.now
  },
  requirements: [],
  lastActivity: {
    type: Date,
    default: Date.now
  },
  maxAmount: {
    type: Number,
    required: true
  },
  minAmount: {
    type: Number,
    required: true
  },
  durationMax: {
    type: String,
    required: true
  },
  durationMin: {
    type: String,
    required: true
  },
});


module.exports = mongoose.model('Products', ProductSchema);

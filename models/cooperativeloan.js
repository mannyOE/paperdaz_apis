const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

const cooperativeSchema = new Schema({
  
  user: {
    type: String,
    required: true
  },
  community: {
    type: String,
    required: true,
  },
  dateApplied: {
    type: Date,
    default: Date.now
  },
  dateApproved: {
    type: Number,
    default:0
  },
  cooperativeType: {
    type: Number,
  },
  amount: {
    type: Number,
  },
  duration: {
    type: Number,
  },
  monthlyRepayment:{
      type: Number
  },
  status:{
      type:Number,
      default:0
  },
  repaid:{
    type:Boolean,
    default:false
  }
});

cooperativeSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('CooperativeLoan', cooperativeSchema);

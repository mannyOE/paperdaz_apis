const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');


const LoanSchema = new Schema({
  
  created: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number,
  },
  due_message: {type: String, default: ''},
  due_payment_now: Number,
  total_cost: {type: Number, default: 0},
  monthly_repayments: {type: Number, default: 0},
  accountHolder: String,
  amount: {
    type: String,
  },
  productName: {
    type: String,
  },
  salaryEarned: {
    type: String,
  },
  goToApproval:{
    type:Boolean,
    default:false
  },
  interestRate: {
    type: Number,
    default: 5.0
  },
  cac_doc: {
    type: String,
  },
  bankStatement: {
    type: String,
  },
  blank_cheque: {
    type: String,
  },
  repaid: {
    type: Boolean,
    default: false,
  },
  penalty: {
    type: Number,
    default: 0
  },
  disbursed: {
    type: Boolean,
    default: false,
  },
  applicationState: {
    type: Number,
    default: 0
  },
  approvedBy: String,
  disbursedBy: String,
  approvedDate: String,
  disbursedDate: String,
  actions: [Object],
  rejectionReason: {
    type: String
  },
  comments: [Object],
  repayments: [],
  user: {}

});
LoanSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Loans', LoanSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

const ComplaintsSchema = new Schema({
  complaint: String,
  complaintBy: String,
  complaintAt: {
    type: Date,
    default: Date.now,
  },
  responses: [],
  resolved: {type: Boolean,default: false},
  resolvedBy: String,
});
ComplaintsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Complaints', ComplaintsSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

const cooperativeSchema = new Schema({
  name: {
    type: String,
    required: true,
    max: 100
  },
  description: {
    type: String,
    required: true
  },
  contribution: {
    type: Number,
    default: 0,
  },
  image: String,
  date_created: {
    type: Date,
    default: Date.now
  },
  cooperative_type: {
    type: Number,
  },
  interest: {
    type: Number,
    default:0.5
  },
  amount: {
    type: Number,
  },
  location:String,
  admin: String,
  applicants: [],
  requirements:[],
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

cooperativeSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Cooperative', cooperativeSchema);

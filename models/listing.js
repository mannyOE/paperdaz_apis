const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

const ListingSchema = new Schema({
  name: {
    type: String,
    required: true,
    max: 100
  },
  description: {
    type: String,
    required: true
  },
  date_created: {
    type: Date,
    default: Date.now
  },
  accountHolder: {
    type: String
  },
  contact_information: String,
  duration: String,
  advert_image: String,
  top_advert: Boolean,
  advert_cost: String,
  listingState: {
    type: Number,
    default: 0
  },
  approved: {
    type: Number,
    default: 0,
  },
  company: {
    type: String,
    required: true
  },
  company_cac: String,
});
ListingSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Listing', ListingSchema);

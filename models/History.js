
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var historySchema = new Schema({
    description           : String,
    amount                : Number,
    accountHolder         : String,
    date_created          : {type: Date, default: Date.now}, 
});


historySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('History', historySchema); 
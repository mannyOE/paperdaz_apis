
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
    account_number        : {type:String,  required:true},
    ref                   : String,
    type                  : String,
    Auth                  : String,
    name                  : String,
    accountHolder         : {type:String,  required:true},
    created_time: {
		    type: Date,
		    default: Date.now,
		  },
    bank_code             : String,
    email                 : String,
    recipient_code		  : String,
    transfer_code         : String,
    verified              : Boolean,
});



module.exports = mongoose.model('Account', accountSchema); 
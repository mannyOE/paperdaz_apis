
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var walletSchema = new Schema({

    balance                : {type:Number, default: 0},
    accountHolder          : String,
    created_time           : {type:Date, default: Date.now},
});



module.exports = mongoose.model('Wallet', walletSchema);

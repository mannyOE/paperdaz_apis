
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var cardSchema = new Schema({
    cardNo                : {type:String,  required:true},
    ref                   : String,
    type                  : String,
    Auth                  : String,
    accountHolder         : {type:String,  required:true},
    month                 : String,
    year                  : String,
     created_time: {
            type: Date,
            default: Date.now,
          },
    status                : {type:Number, default: 1},
    email                 : String,
    phone                 : String, 
});



module.exports = mongoose.model('Card', cardSchema); 
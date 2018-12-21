
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var iconsSchema = new Schema({
    name                   : String,
    location                  : String,
    type: Number,
});



module.exports = mongoose.model('Images', iconsSchema); 
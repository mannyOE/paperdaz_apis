'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-paginate');


// set up a mongoose model
const UserSchema = new Schema({
    
    email: {
        type: String,
        unique: true,
        required: true
    },
    businessName: {
        type: String
    },
    telephone: {
        type: String,
        unique: true,
        required: true
    },    
    isVerified: {
        type: Boolean,
        default: false
    },
    industry:String,
    address:String,
    country: String,
    
    verificationToken: {
        type: String,
    },
    
    firstName: {
        type: String,
        lowercase: true,
    },
    lastName: {
        type: String,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: 4
    },
    position: String,
}, { timestamp: true });

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', UserSchema);

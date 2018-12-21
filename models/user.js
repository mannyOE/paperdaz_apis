'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-paginate');


// set up a mongoose model
const UserSchema = new Schema({
    username: {
        type: String,
        alphanumeric: true,
        minLength: 3
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    
    identificationType: String,
    identificationImage: String,
    identificationExpiry: String,
    security_question: String,
    security_answer: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    // isAuthenticated: {
    //     type: Boolean,
    //     required: true
    // },
    verificationToken: {
        type: String,
    },
    enabled: {type:Boolean, default: true},
    phone: {
        type: String,
        unique: true,
        required: true
    },
    bvn: {
        type: String,
    },
    role: Number,
    image: {
        type: String
    },
    gender: String,

    // displayName: {
    //     type: String,
    //     lowercase: true,
    // },
    firstName: {
        type: String,
        lowercase: true,
    },
    profile_status: {
        type: Boolean,
        default: false
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
    accountId: {
        type: String,
        required: true
    },
    proof_employment_upload: {
        type: String,
      },
    employmentType: String,
    companyName: String,
    positionInCompany: String,
}, { timestamp: true });

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', UserSchema);

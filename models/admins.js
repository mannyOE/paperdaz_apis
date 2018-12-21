'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// set up a mongoose model
const AdminSchema = new Schema({
    username: {
        type: String,
        unique: true,
        alphanumeric: true,
        minLength: 3
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: Number,
    },
    firstName: {
        type: String,
        lowercase: true,
    },
    disabled: {
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
    role: {
        type: Number,
        required: true
    },
}, { timestamp: true });


module.exports = mongoose.model('Admins', AdminSchema);

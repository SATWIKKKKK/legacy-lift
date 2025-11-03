const mongoose = require('mongoose');
const { timeStamp } = require('node:console');

const userModel = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true

    },
    description: {
        type: String,
        required: true,

    },
    files:{
        type: Array,
        required: true,
        default: []

    },
    timeStamp:{
        type: Date,
        default: Date.now

    }

});

module.exports = mongoose.model('User', userModel);
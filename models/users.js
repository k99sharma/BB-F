const mongoose = require('mongoose');
const creationInfo = require('../models/schemaPlugins');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName : {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
});

// adding plugin to the schema
userSchema.plugin(creationInfo);

const User = mongoose.model('user', userSchema);

module.exports = User;
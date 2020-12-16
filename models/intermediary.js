const mongoose = require('mongoose');
const creationInfo = require('../models/schemaPlugins');
const Schema = mongoose.Schema;

const intermediarySchema = new Schema({
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
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }]
});

intermediarySchema.plugin(creationInfo);

const Intermediary = mongoose.model('Intermediary', intermediarySchema, 'intermediaries');

module.exports = Intermediary;
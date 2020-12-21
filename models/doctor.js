const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const creationInfo = require('../models/schemaPlugins');

const doctorSchema = new Schema({
    firstName: {
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
    speciality: {
        type: [String],
        required: true
    },
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
    }],
    prescriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription'
    }]
});

doctorSchema.plugin(creationInfo);

const Doctor = mongoose.model('Doctor', doctorSchema, 'doctors');

module.exports = Doctor;
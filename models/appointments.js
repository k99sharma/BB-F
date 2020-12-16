const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const creationInfo = require('../models/schemaPlugins');

const appointmentSchema = new Schema({
    patient: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        contactNumber: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    bluebirdAccount: {
        type: Boolean,
        required: true,
        default: false
    },
    symptoms: {
        type: Array,
        required: true
    },
    isPrescribed: {
        type: Boolean,
        required: true,
        default: false
    },
    doctor:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        name:{
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    intermediary: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    },
    appointmentDate: {
        type: String,
        required: true,
        default: "Not Given"
    },
    appointmentTime: {
        type: String,
        required: true,
        default: "Not Given"
    }
});

appointmentSchema.plugin(creationInfo);

const Appointment = mongoose.model('Appointment', appointmentSchema, 'appointments');

module.exports = Appointment;
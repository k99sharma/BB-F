const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const creationInfo = require('../models/schemaPlugins');

const prescriptionSchema = new Schema({
    symptoms: {
        type: [String],
        required: true
    },
    diagnosis: {
        type: [String],
        required: true
    },
    medicines: {
        type: [String],
        required: true
    },
    tips: {
        type: [String],
        required: true
    },
    doctor: {
        id: {
            type: mongoose.Schema.Types.ObjectId
        }
    },
    patient: {
        id: {
            type: mongoose.Schema.Types.ObjectId
        }
    }
});

prescriptionSchema.plugin(creationInfo);

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
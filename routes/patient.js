const express = require('express');
const router = express.Router();

const requireLogin = require('../utility/necessaryFunctions');

// models
const Patient = require('../models/patient');
const Prescription = require('../models/prescriptions');
const Appointment = require('../models/appointments');

// GET Home
router.get('/home', requireLogin, async (req, res)=>{
    const id = req.session.user_id;

    await Patient.findById(id)
        .populate('Prescription')
        .exec((err, patient) => {
            if(!err)
                res.render('patient/home', {patient});

            else{
                console.log('Cannot open right now');
                req.flash('error', 'Can retrieve appointments at this moment');
                res.redirect('/bluebird/login');
            }
        })
});


// GET patient prescription
router.get('/prescriptions', requireLogin, async (req, res)=>{
    const id = req.session.user_id;       // patient id

    const patient = await Patient.findById(id);
    const patientEmail = patient.email;

    await Appointment.find({'patient.email' : patientEmail})
        .exec((err, appointments) => {
            if(!err)
                res.render('patient/prescriptions', { appointments });

            else{
                console.log('Cannot open right now');
                req.flash('error', 'Can retrieve appointments at this moment');
                res.redirect('/bluebird/login');
            }
    })

});


// GET particular appointment details
router.get('/prescriptions/:id', requireLogin, async (req, res) => {
    const {id} = req.params;

    const appointment = await Appointment.findById(id);
    const prescription = await Prescription.findOne({'doctor.appointmentId' : id});

    if(prescription && appointment)
        res.render('patient/prescriptionDetails', {appointment, prescription});

    else{
        req.flash('error', 'Unable to retrieve the data');
        res.redirect(`/bluebird/patient/prescriptions`);
    }
});



module.exports = router;
const express = require('express');
const router = express.Router();

const requireLogin = require('../utility/necessaryFunctions');

// modals
const Doctor = require('../models/doctor');
const Appointment = require('../models/appointments');
const Prescription = require('../models/prescriptions');
const Patient = require('../models/patient');

// GET Home
router.get('/home', requireLogin, (req, res)=>{
    res.locals.user = req.session.user;
    res.render('doctor/home');
});


// GET All appointments page
router.get('/:id/todayAppointments', requireLogin, async (req, res)=>{
    const {id} = req.params;

    await Doctor.findOne({'_id': id})
        .populate('appointments')
        .exec((err, doctor)=>{
            if(!err){
                res.render('doctor/allAppointments', {doctor});
            }

            else{
                console.log('Cannot open right now');
                req.flash('error', 'Can retrieve appointments at this moment');
                res.redirect('/bluebird/doctor/home');
            }
        })
});



// POST prescription
router.post('/:id/prescription', async (req, res)=>{
    const {id} = req.params;
    const appointment = await Appointment.findById(id);
    const doctorId = appointment.doctor.id;

    const {symptoms, diagnosis, medicines, tips} = req.body;

    const prescription = new Prescription({
        symptoms: symptoms.split(','),
        diagnosis: diagnosis.split(','),
        medicines: medicines.split(','),
        tips: tips.split(','),
        doctor: {
            id: doctorId
        }
    });

    await prescription.save();

    if(prescription){
        await Appointment.findByIdAndUpdate(id, {isPrescribed: true});
        await Patient.findOneAndUpdate(
            {email : appointment.patient.email},
            {$push: {
                    prescription: prescription._id
                }
            });

        req.flash('success', 'Prescribed !');
        res.redirect(`/bluebird/doctor/${doctorId}/todayAppointments`);
    }

    else{
        console.log('Prescription not given');
        req.flash('error', 'Cannot Prescribe!');
        res.redirect('/bluebird/doctor/home');
    }
});



module.exports = router;
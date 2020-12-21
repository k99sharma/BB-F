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

    await Appointment.find({'doctor.id': id, 'isPrescribed' : false})
        .populate('appointments')
        .exec((err, appointments)=>{
            if(!err){
                res.render('doctor/allAppointments', { appointments });
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
            id: doctorId,
            appointmentId: id
        }
    });

    await prescription.save();

    if(prescription){
        await Appointment.findByIdAndUpdate(id, {
            isPrescribed: true
        });
        await Patient.findOneAndUpdate(
            {email : appointment.patient.email},
            {$push: {
                    prescriptions: prescription._id
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


// GET appointment history
router.get('/:id/appointmentHistory', requireLogin, async (req, res)=>{
    const { id } = req.params;          // doctor id

    await Doctor.findById(id)
        .populate('appointments')
        .exec((err, doctor) => {
            if(!err){
                const appointments = doctor.appointments;
                res.render('doctor/appointmentHistory', { appointments });
            }

            else{
                req.flash('error', 'Unable to retrieve data');
                req.redirect('/bluebird/doctor/home');
            }
        })


});


// GET particular appointment history
router.get('/appointmentHistory/:id', requireLogin, async (req, res)=>{
    const { id } = req.params;           // appointment id

    const appointment = await Appointment.findById(id);
    const prescription = await Prescription.findOne({'doctor.appointmentId' : id});

    if(prescription && appointment)
        res.render('doctor/patientAH', {appointment, prescription});

    else{
        req.flash('error', 'Unable to retrieve the data');
        res.redirect(`/bluebird/doctor/${appointment.doctor.id}/appointmentHistory`)
    }
});


module.exports = router;
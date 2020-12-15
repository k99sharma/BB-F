const express = require('express');
const router = express.Router();

const requireLogin = require('../utility/necessaryFunctions');

// models
const User = require('../models/users');
const Appointment = require('../models/appointments');

// functions
const findIntermediary = async (id)=>{
    const intermediary = await User.findById(id);

    const intermediaryEmail = intermediary.email;
    const intermediaryId = intermediary._id;
    const intermediaryName = `${intermediary.firstName} ${intermediary.lastName}`;

    return {intermediaryId, intermediaryName, intermediaryEmail};
}

const findDoctor = async (symptoms) => {
    // setting doctor according to symptoms
    // machine learning model is used here !!!!
    const doctorList = ['doctorOne@email.com', 'doctor2@email.com', 'doctor3@email.com'];
    let doctorAppointedEmail;
    if(symptoms === 'cold')
        doctorAppointedEmail = doctorList[0];

    else if(symptoms === 'headache')
        doctorAppointedEmail = doctorList[1];

    else
        doctorAppointedEmail = doctorList[2];

    let doctorId = undefined, doctorName = undefined, doctorEmail = undefined;

    // finding doctor
    const doctor = await User.findOne({email : doctorAppointedEmail});

    // if doctor is found
    if(doctor){
        doctorId = doctor._id;
        doctorName = `${doctor.firstName} ${doctor.lastName}`;
        doctorEmail = doctorAppointedEmail;
    }

    else {
        console.log('Doctor not available');
    }

    return {doctorId, doctorName, doctorEmail};
}


const getSymptomsArray = (symptoms) => {
    const array = symptoms.split(',');

    return array;
}


// GET Home
router.get('/home', requireLogin, (req, res)=>{
    res.locals.user = req.session.user;
    res.render('intermediary/home');
});


// POST New Appointment
router.post('/newAppointment/:id', async (req, res)=>{
    const {id} = req.params;
    const {firstName, lastName, email, contact, address, symptoms, bluebirdAccount = "off", appointmentDate} = req.body;

    // getting intermediary details
    const {intermediaryId, intermediaryName, intermediaryEmail} = await findIntermediary(id);

    // getting appointed doctor details
    const {doctorId, doctorName, doctorEmail} = await findDoctor(symptoms);

    // if doctor is available for current symptoms
    if(doctorId && doctorName && doctorEmail){
        // console.log(doctorId);
        // console.log(doctorName);
        // console.log(doctorEmail);
        // console.log(appointmentDate);

        // making appointment
        const new_appointment = new Appointment({
            patient: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                contactNumber: contact,
                address: address,
            },
            bluebirdAccount: (bluebirdAccount === 'on') ? true : false,
            doctor: {
                id: doctorId,
                name: doctorName,
                email: doctorEmail
            },
            intermediary: {
                id: intermediaryId,
                name: intermediaryName,
                email: intermediaryEmail
            },
            appointmentDate: appointmentDate,
            symptoms: getSymptomsArray(symptoms)
        });

        await new_appointment.save()
            .then(()=>{
                console.log('Appointment Done!');
                req.flash('success', 'Appointment Made!');
                return res.redirect('/bluebird/intermediary/home');
            })
            .catch(err=>{
                console.log('Appointment cannot not made!');
                req.flash('error', 'Appointment cannot be made');
                return res.redirect('/bluebird/intermediary/home');
            })
    }

    else{                     // if doctor is not available
        req.flash('error', 'Doctor is not available');
        return res.redirect('/bluebird/intermediary/home');
    }

});


// GET show appointment
router.get('/appointment/show', async (req, res)=>{
    const user_id = req.session.user_id;

    // finding all appointments in the database
    const appointments = await Appointment.find({ "intermediary.id" : user_id, "isPrescribed" : false });

    res.render('intermediary/showAppointments', { appointments });
});


// PUT edit existing appointment
router.put('/appointment/edit/:id', async (req, res)=>{
    const {id} = req.params;
    const {email} = req.body;

    console.log(email);

    res.send('Editing');
});

// DELETE existing appointment
router.delete('/appointment/:id', async (req, res)=>{
   const {id} = req.params;

   await Appointment.findByIdAndDelete(id)
       .then(()=>{
           req.flash('success', 'Appointment deleted successfully!');
           res.redirect('/bluebird/intermediary/home');
       })
       .catch(err => {
           console.log('Cannot be deleted');
           req.flash('error', 'Appointment cannot be deleted!');
           res.redirect('/bluebird/intermediary/home');
       })
});

module.exports = router;
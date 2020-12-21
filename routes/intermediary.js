const express = require('express');
const router = express.Router();

const requireLogin = require('../utility/necessaryFunctions');

// models
const Appointment = require('../models/appointments');
const Intermediary = require('../models/intermediary');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');

// functions
const findIntermediary = async (id)=>{
    const intermediary = await Intermediary.findById(id);

    const intermediaryEmail = intermediary.email;
    const intermediaryId = intermediary._id;
    const intermediaryName = `${intermediary.firstName} ${intermediary.lastName}`;

    return {intermediaryId, intermediaryName, intermediaryEmail};
};

const findDoctor = async (symptoms) => {
    // setting doctor according to symptoms
    // machine learning model is used here !!!!

    let doctorId = undefined, doctorName = undefined, doctorEmail = undefined;

    // getting symptoms
    const symptomList = symptoms.split(',');

    // finding doctor
    const doctors = await Doctor.find({});

    let isGood = false;
    let doctor = undefined;

    for(let d of doctors){
        let doctorSpeciality = d.speciality;

        for(let symptom of symptomList){
            for(let speciality of doctorSpeciality){
                if(symptom === speciality){
                    isGood = true;
                    break;
                }
            }
        }

        if(isGood)
            doctor = d;
    }

    // if doctor is found
    if(doctor){
        doctorId = doctor._id;
        doctorName = `${doctor.firstName} ${doctor.lastName}`;
        doctorEmail = doctor.email;
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


const setId = async (appointment) => {
    const appointmentId = appointment._id;
    const appointedDoctorId = appointment.doctor.id;
    const intermediaryId = appointment.intermediary.id;

    await Doctor.findOneAndUpdate(
        {_id : appointedDoctorId},
        {$push: {
                    appointments: appointmentId
            }
        });

    await Intermediary.findOneAndUpdate(
        {_id : intermediaryId},
        {$push: {
                appointments: appointmentId
            }
        });
};


// middleware to remove id from doctor and intermediary as well on deleting appointment
const rmDoctorIntermediary = async (req, res, next) => {
    const {id} = req.params;
    const appointment = await Appointment.findById(id);

    await Doctor.updateOne({_id: appointment.doctor.id}, {
        $pull: {
            appointments: id
        }
    });

    await Intermediary.updateOne({_id: appointment.intermediary.id}, {
        $pull: {
            appointments: id
        }
    });

    next();
};


// GET Home
router.get('/home', requireLogin, (req, res)=>{
    res.locals.user = req.session.user;
    res.render('intermediary/home');
});


// POST New Appointment
router.post('/newAppointment/:id', async (req, res)=>{
    const {id} = req.params;
    const {firstName, lastName, email, contact, address, symptoms, date, bluebirdAccount = "off"} = req.body;

    // getting intermediary details
    const {intermediaryId, intermediaryName, intermediaryEmail} = await findIntermediary(id);

    // getting appointed doctor details
    const {doctorId, doctorName, doctorEmail} = await findDoctor(symptoms);

    const bbAccount = (bluebirdAccount === 'on') ? true : false;

    // if doctor is available for current symptoms
    if(doctorId && doctorName && doctorEmail){

        // making appointment
        const new_appointment = new Appointment({
            patient: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                contactNumber: contact,
                address: address,
            },
            bluebirdAccount: bbAccount,
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
            appointmentDate: date,
            symptoms: getSymptomsArray(symptoms)
        });

        await new_appointment.save()
            .then(async (new_appointment)=>{
                if(bbAccount){
                    await Patient.findOneAndUpdate(
                        {email : email},
                        {$push: {
                                appointments: new_appointment._id
                            }
                        });
                }

                console.log('Appointment Done!');
                await setId(new_appointment);
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
router.get('/appointment/show', requireLogin, async (req, res)=>{
    const user_id = req.session.user_id;

    // finding all appointments in the database
    const appointments = await Appointment.find({ "intermediary.id" : user_id, "isPrescribed" : false });

    res.render('intermediary/showAppointments', { appointments });
});


// PUT edit existing appointment
router.put('/appointment/edit/:id', async (req, res)=>{
    const {id} = req.params;
    const {firstName, lastName, email, contact, address, bluebirdAccount} = req.body;

    const bbAccount = (bluebirdAccount === 'on') ? true : false;

    await Appointment.findByIdAndUpdate(id, {
        patient: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            contactNumber: contact,
            address: address,
        },
        bluebirdAccount: bbAccount
    })
        .exec((err, edited_appointment)=>{
            if(!err){
                req.flash('success', 'Appointment details is successfully changed!');
                res.redirect('/bluebird/intermediary/appointment/show');
            }

            else{
                req.flash('error', 'Appointment details cannot be edited !');
                res.redirect('/bluebird/intermediary/appointment/show');
            }
        });
});

// DELETE existing appointment
router.delete('/appointment/:id', rmDoctorIntermediary, async (req, res)=>{
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


// GET all appointments
router.get('/appointment/:id/all', requireLogin, async (req, res)=>{
    const {id} = req.params;

    const appointments = await Appointment.find({'intermediary.id' : id});

    res.render('intermediary/allAppointments', { appointments });
});


module.exports = router;
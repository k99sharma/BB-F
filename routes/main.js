const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


// models

const Intermediary = require('../models/intermediary');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');


// middleware to check before registration if a user already exists or not
const intermediaryExists = async (req, res, next) => {
   const { username, email } = req.body;

   const intermediary = await Intermediary.findOne({username, email});
   if(intermediary){
      console.log('Intermediary already exists');
      req.flash('error', 'Username and email already in use!');
      return res.redirect('/bluebird/register');
   }
   else
      next();
}


const doctorExists = async (req, res, next) => {
   const { username, email } = req.body;

   const doctor = await Doctor.findOne({username, email});
   if(doctor){
      console.log('Doctor already exists');
      req.flash('error', 'Username and email already in use!');
      return res.redirect('/bluebird/register');
   }
   else
      next();
}

const patientExists = async (req, res, next) => {
   const { username, email } = req.body;

   const patient = await Patient.findOne({username, email});
   if(patient){
      console.log('Patient already exists');
      req.flash('error', 'Username and email already in use!');
      return res.redirect('/bluebird/register');
   }
   else
      next();
}



// category redirect function
const categoryRedirect = (category)=>{
  if(category === '0')
     return 'intermediary/home';

  else if(category === '1')
     return 'doctor/home';

   else
      return 'patient/home';
};


// GET bluebird homepage
router.get('/', (req, res)=>{
   res.render('main/homepage');
});


// --------------------- Login Part of Website -----------------------------
// GET login page
router.get('/login', (req, res)=>{
   res.render('main/login');
});

// POST login
router.post('/login' ,async (req, res)=>{
   const { username, password, category } = req.body;

   let user = undefined;

   if(category === '0')
      user = await Intermediary.findOne({username});


   else if(category === '1')
      user = await Doctor.findOne({ username });

   else
      user = await Patient.findOne({ username });


   if(user){
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if(isPasswordCorrect){
         console.log('Password is correct');
         req.session.user_id = user._id;
         req.session.user = user;
         req.flash('success', 'Successfully logged in!');
         res.redirect(`/bluebird/${categoryRedirect(category)}`);
      }

      else{
         console.log('Password is in correct');
         req.flash('success', 'Wrong Credentials');
         res.redirect('/bluebird/login');
      }
   }
   else{
      console.log('User not found');
      req.flash('error', 'User not available!');
      res.redirect('/bluebird/login');
   }

});

// ----------------------------------------------------------------------



// --------------------- Registration routes ----------------------------


// GET register page
router.get('/register', (req, res)=>{
   res.render('main/register');
});


// GET register option page
router.get('/register/registerOptions', (req, res)=>{
   res.render('main/registerOptions');
});


// GET intermediary registration pages
router.get('/register/registerOptions/intermediary', (req, res)=>{
   res.render('main/registerOptions/intermediaryRegistration');
});

// POST intermediary registration
router.post('/register/registerOptions/intermediary', intermediaryExists, async (req, res)=>{
   const {firstName, lastName, username, email, password} = req.body;

   const category = '0';

   // creating hash of password
   const hash = await bcrypt.hash(password, 12);

   // creating new user
   const new_intermediary = new Intermediary({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: hash
   });

   // saving intermediary user in database
   await new_intermediary.save()
       .then(()=>{
          console.log('User Created!');
          req.session.user_id = new_intermediary._id;
          req.session.user = new_intermediary;
          req.flash('success', 'Successfully Registered');
          res.redirect(`/bluebird/${categoryRedirect(category)}`);

       })
       .catch(err => {
          console.log('User cannot be created!');
          console.log(err);
          req.flash('error', 'Registration failed!');
          res.redirect('/bluebird/register');
       })
});


// GET doctor registration pages
router.get('/register/registerOptions/doctor', (req, res)=>{
   res.render('main/registerOptions/doctorRegistration');
});


router.post('/register/registerOptions/doctor', doctorExists, async (req, res)=>{
   const {firstName, lastName, username, email, password, speciality} = req.body;

   const category = '1';

   // creating hash of password
   const hash = await bcrypt.hash(password, 12);

   const specialityList = speciality.split(',');

   // creating new user
   const new_doctor = new Doctor({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: hash,
      speciality: specialityList
   });

   // saving doctor user in database
   await new_doctor.save()
       .then(()=>{
          console.log('User Created!');
          req.session.user_id = new_doctor._id;
          req.session.user = new_doctor;
          req.flash('success', 'Successfully Registered');
          res.redirect(`/bluebird/${categoryRedirect(category)}`);

       })
       .catch(err => {
          console.log('User cannot be created!');
          console.log(err);
          req.flash('error', 'Registration failed!');
          res.redirect('/bluebird/register');
       })
});


// GET patient registration
router.get('/register/registerOptions/patient', (req, res)=>{
   res.render('main/registerOptions/patientRegistration');
});


// POST patient registration
router.post('/register/registerOptions/patient', patientExists, async (req, res)=>{
   const {firstName, lastName, username, password, email, address, contact} = req.body;

   const hash = await bcrypt.hash(password, 12);

   const category = '2';

   const new_patient = new Patient({
      firstName : firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: hash,
      address: address,
      contactNumber: contact
   });

   // saving doctor user in database
   await new_patient.save()
       .then(()=>{
          console.log('User Created!');
          req.session.user_id = new_patient._id;
          req.session.user = new_patient;
          req.flash('success', 'Successfully Registered');
          res.redirect(`/bluebird/${categoryRedirect(category)}`);

       })
       .catch(err => {
          console.log('User cannot be created!');
          console.log(err);
          req.flash('error', 'Registration failed!');
          res.redirect('/bluebird/register');
       })

});


// ----------------------------------------------------------------------


// logout
router.get('/logout', (req, res)=>{
   req.session.destroy();
   res.redirect('/bluebird/login');
});


module.exports = router;
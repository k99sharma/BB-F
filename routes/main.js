const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// models
const User = require('../models/users');

// middleware to check before registration if a user already exists or not
const userExists = async (req, res, next) => {
   const { username, email } = req.body;

   const user = await User.findOne({username, email});
   if(user){
      console.log('User already exists');
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


// GET login page
router.get('/login', (req, res)=>{
   res.render('main/login');
});

// POST login
router.post('/login', async (req, res)=>{
   const { username, password, category } = req.body;
   const user = await User.findOne({username, category})

   if(user){
      console.log('User found');
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if(isPasswordCorrect){
         console.log('Password is correct');
         req.session.user_id = user._id;
         req.session.user = user;
         res.redirect(`/bluebird/${categoryRedirect(category)}`);
      }

      else{
         console.log('Password is incorrect');
         res.redirect('/bluebird/login');
      }
   }
   else{
      console.log('User not found');
      res.redirect('/bluebird/login');
   }

});


// GET register page
router.get('/register', (req, res)=>{
   res.render('main/register');
});


// POST register page
router.post('/register', userExists, async (req, res)=>{
   const {firstName, lastName, username, email, password, category} = req.body;

   // creating hash of password
   const hash = await bcrypt.hash(password, 12);

   // creating new user
   const new_user = new User({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: hash,
      category: category
   });

   // saving user in database
   await new_user.save()
       .then(()=>{
          console.log('User Created!');
          req.session.user_id = new_user._id;
          req.session.user = new_user;
          res.redirect(`/bluebird/${categoryRedirect(category)}`);

       })
       .catch(err => {
          console.log('User cannot be created!');
          console.log(err);
          res.redirect('/bluebird/register');
       })
});

// logout
router.get('/logout', (req, res)=>{
   req.session.destroy();
   res.redirect('/bluebird/login');
});

module.exports = router;
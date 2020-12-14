const express = require('express');
const router = express.Router();

const requireLogin = require('../utility/necessaryFunctions');

// GET Home
router.get('/home', requireLogin, (req, res)=>{
    res.render('patient/home');
});


module.exports = router;
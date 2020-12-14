const express = require('express');
const router = express.Router();

const requireLogin = require('../utility/necessaryFunctions');

// GET Home
router.get('/home', requireLogin, (req, res)=>{
    res.locals.user = req.session.user;
    res.render('intermediary/home');
});


module.exports = router;
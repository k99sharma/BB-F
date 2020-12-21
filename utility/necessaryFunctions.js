// login middleware
const requireLogin = (req, res, next)=>{
    if(!req.session.user_id){
        //console.log('Login Required');
        return res.redirect('/bluebird/login');
    }

    next();
};

module.exports = requireLogin;
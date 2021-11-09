const session = require('express-session')

const auth = async  (req, res, next) =>{
    
    if(!req.session.adminLoggedin){
        res.redirect('/admin-login')
    }
    next()
};

module.exports = auth
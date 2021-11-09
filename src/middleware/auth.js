const auth = async  (req, res, next) =>{
    
    if(!req.session.loggedin){
        return res.redirect('/')
    }
    next()
};

module.exports = auth
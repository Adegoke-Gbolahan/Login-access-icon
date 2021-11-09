const express = require('express')
const con = require('../db/db')
const nodemailer = require('nodemailer');
const Router = express.Router()

Router.post('/login', async (req, res) =>{
    const password = req.body.pwd
    // console.log(req.body)
    try {
       var sql3 = "SELECT * FROM users WHERE email = "+ con.escape(req.body.email) +"";
        con.query(sql3, async function (err, memberResult, fields){
          if(err){
             console.log(err)
             return
         }

         if(memberResult.length < 1){
          return res.status(201).send({success:"incorrect"})
         }
         if(memberResult[0].password == password){
          req.session.loggedin = true;
          req.session.email = req.body.email;
        //   req.session.regname = memberResult[0].sname + " " + memberResult[0].fname;
        //   req.session.level = "updated"
      //   console.log(memberResult[0].staus)
          if(memberResult[0].staus == "Unverified"){
            return res.status(201).send({success:"Unverified"})
         }
          return res.status(201).send({success:"correct"})
         }else{
          return res.status(201).send({success:"incorrect"})
         }
       })
    }catch (e) {
       console.log(e)
       res.render('500')
    }
})
Router.get('/logout', async(req,res) =>{
   req.session.loggedin = false;
   req.session.email = null
   res.redirect('/')
});
module.exports = Router
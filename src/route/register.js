const express = require('express')
const con = require('../db/db')
const nodemailer = require('nodemailer');
const Router = express.Router()
let transporter = nodemailer.createTransport({
    host: 'xlrsounds.com',            //mail server name
    port: 587,                           //TLS port is 587
    secure: false,                      // true for 465, false for other ports
    auth: {
        type: "login",
        user: "info@xlrsounds.com", // username for your mail server
        pass: "Samcrown24."// password                
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    },
    ignoreTLS: false	    // if this is true and secure is false
                                // then TLS is not used
                                // even if the server supports STARTTLS extension
 });

Router.post('/register', async (req, res) =>{
    // console.log(req.body)
       let ts = Date.now();
       let date_ob = new Date(ts);
       let date = date_ob.getDate();
       let month = date_ob.getMonth() + 1;
       let year = date_ob.getFullYear();
       var date_created = year + "-" + month + "-" + date
    
       try {
        var sql3 = "SELECT email FROM users wHERE email = "+ con.escape(req.body.email) +"";
         con.query(sql3, async function (err, existResult){
           if(err){
              console.log(err)
              return
          }
          //console.log(result)
          if( existResult.length  > 0){
           return res.status(200).send({error:"exist"})
           
          }
        var verifyStatus = "activated"
           var sql1 = "INSERT INTO users (email,name,username,password,status,date_created) VALUES (" +con.escape(req.body.inputNext_adminEmail) +"," +con.escape(req.body.inputNext_adminName) +"," +con.escape(req.body.inputNext_adminUseranme) +"," +con.escape(req.body.inputNext_adminPassword) +",'"+verifyStatus+"','"+date_created+"')"
           con.query(sql1, async function (err, result){
            if(err){
               console.log(err)
               return
           }
        //    console.log(result)
           if(result.affectedRows > 0){
                req.session.email = req.body.email
                res.status(201).send({success:"saved"})
           }
        })
     });
     } catch (e) {  
        res.status(500).render('500')
     }
    
})

//Email verification route POST
Router.post('/verifyme', async (req, res) =>{
    try {
        // console.log(req.body)
            if(!req.session.email){
                return  res.send('noemail') 
            }
            var email = req.session.email;
            var verifyStatus = 'verified'
            const sql3 = "SELECT verifyCode FROM users WHERE email = '"+ email +"' ORDER BY id DESC";
            con.query(sql3, async function (err, searchResult, fields){
                if(err){
                console.log(err)
                return
                } 
                if(searchResult[0].verifyCode == req.body.vcode){
                    const sql0 = "UPDATE users SET staus =  '"+ verifyStatus +"' WHERE email  = '"+ email +"'"
                    con.query(sql0, async function (err, updatePass){
                        if(err){
                        console.log(err)
                        return
                        }
                        // console.log(updatePass.affectedRows)
                    if(updatePass.affectedRows > 0){
                        req.session.loggedin = true
                        return  res.status(201).send({success:'updated'})
                    
                    }
                })
                }else{
                    return res.status(201).send({success:'invalid'})
                }
                
            })
    } catch (e) {
        res.render.status(500).render('500')
        console.log(e)       
    }
})

//Email verification code resend
Router.post('/resend', async (req, res) =>{
    var sql3 = "SELECT email FROM users WHERE email = "+ con.escape(req.body.resendEmail) +"";
     con.query(sql3, async function (err, existResult){
       if(err){
          console.log(err)
          return
      }
    //   console.log(req.body.email)
      if( existResult.length  > 0){
        var verifyCode = Math.floor(Math.random() * (999999 - 100000 + 1)) +100000;
        const sql0 = "UPDATE users SET verifyCode =  '"+ verifyCode +"' WHERE email  = "+ con.escape(req.body.resendEmail) +""
        con.query(sql0, async function (err, updateResult){
            if(err){
               console.log(err)
               return false
            }
            // console.log(updateResult.affectedRows)
           if(updateResult.affectedRows  > 0){
            req.session.email = req.body.resendEmail
            sendVerifyMail(req.body.resendEmail,verifyCode)
            res.status(201).send({success:'resend'})
            return
           }
        })
      }else{
          res.send({success:'non'})
      }
    })
})
//SENDING VERIFIFCATION EMAIL
const sendVerifyMail = async(email,verifyCode) =>{
    // console.log(email,verifyCode)
    let info =  transporter.sendMail({
       from: '"XLR" info@xlrsounds.com', // sender address
       to: email, // list of receivers seperated by comma
       subject: 'XLR SOUNDBOARD- Email Verification', // Subject line
       html: '<p>Your registration for XLR SOUNDBOARD is successful.<br> <br>Here is your verification code: <strong>'+verifyCode+'</strong> <br> <br>Regards, <br> XLR SOUNDBOARD.</p>'
       }, (error, info) => {
      if (error) {
       console.log(error)
       return;
       }
       console.log('Message Sent!');
      // console.log(info);
       transporter.close();
       });
 }
 
    module.exports = Router
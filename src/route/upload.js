const express = require('express')
const con = require('../db/db')
const nodemailer = require('nodemailer');
const Router = express.Router()
const multer = require('multer')
const path = require('path');
const auth = require('../middleware/auth')

const musicStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'public/music', 
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now() 
             + path.extname(file.originalname))
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
 });
 
 const musicUpload = multer({
    storage: musicStorage,
    limits: {
      fileSize: 100000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(mp3)$/)) { 
         // upload only png and jpg format
         return cb(null,false)
       }
     cb(undefined, true)
  }
 })

Router.post('/uploadMusic', auth, musicUpload.single('musicFile'), async (req,res) =>{
    try {
       
       const email = req.session.email;

        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        var date_created = year + "-" + month + "-" + date
        var sql0 = "SELECT * FROM music ORDER BY id DESC LIMIT 1"
        con.query(sql0, async function (err, music_idResult){
         if(err){
             console.log(err)
             return
         }
        // console.log(result)
         if(music_idResult == ""){
            var music_id = 1;
         }else{
            var music_id = parseInt(music_idResult[0].id) + 1
         }
        var verifyStatus = "activated"
        const verifyCode = Math.floor(Math.random() * (999999 - 100000 + 1)) +100000;
           var sql1 = "INSERT INTO music (email,music_id,name,category,url,status,date_created) VALUES ('" +email+"','" +music_id+"'," +con.escape(req.body.musictitle) +"," +con.escape(req.body.category) +",'"+req.file.filename+"','"+ verifyStatus +"','"+date_created+"')"
           con.query(sql1, async function (err, result){
            if(err){
               console.log(err)
               return
           }
        //    console.log(result)
           if(result.affectedRows > 0){
               res.redirect('/')
           }
        })
    })
        // console.log(req.body,req.file.filename)
    } catch (e) {
       console.log(e)
    }
 })

module.exports = Router
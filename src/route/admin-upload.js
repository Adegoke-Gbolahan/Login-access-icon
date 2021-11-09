const express = require('express')
const con = require('../db/db')
const Router = express.Router()
const multer = require('multer')
const path = require('path');
const auth = require('../middleware/admin-auth')

const musicStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'public/icon', 
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
      if (!file.originalname.match(/\.(png|jpg)$/)) { 
         // upload only png and jpg format
         return cb(null,false)
       }
     cb(undefined, true)
  }
 })

Router.post('/admin-uploadMusic', musicUpload.single('musicFile'), async (req,res) =>{
   // console.log('here')
    try {

        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        var date_created = year + "-" + month + "-" + date
        var sql0 = "SELECT * FROM icon ORDER BY id DESC LIMIT 1"
        con.query(sql0, async function (err, iconResult){
         if(err){
             console.log(err)
             return
         }
         const status = "activated"
           var sql1 = "INSERT INTO icon (title,link,image_url,status) VALUES (" +con.escape(req.body.iconTitle) +"," +con.escape(req.body.iconLink) +",'"+req.file.filename+"','"+status+"')"
           con.query(sql1, async function (err, result){
            if(err){
               console.log(err)
               return
           }
        //    console.log(result)
           if(result.affectedRows > 0){
               res.redirect('/admin-icon')
           }
        })
    })
        // console.log(req.body,req.file.filename)
    } catch (e) {
       console.log(e)
    }
 })

module.exports = Router
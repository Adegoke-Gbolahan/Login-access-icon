const express = require('express')
const con = require('../db/db')
const nodemailer = require('nodemailer');
const Router = express.Router()
const multer = require('multer')
const path = require('path');
const auth = require('../middleware/auth')

Router.post('/musicCount',  async (req,res) =>{
   const id = req.body.musicId
//    console.log(id)
   var sql3 = "SELECT play FROM music WHERE music_id = '"+ id +"'";
       con.query(sql3, async function (err, existResult){
         if(err){
            console.log(err)
            return
        }
        //console.log(result)
        if( existResult.length  > 0){
            const getPlay = existResult[0].play + 1
            const sql0 = "UPDATE music SET play =  '"+ getPlay +"' WHERE music_id  = '"+ id +"'";
            con.query(sql0, async function (err, updatedResult){
                if(err){
                   console.log(err)
                   return
               }
               if(updatedResult.affectedRows > 0){
                   res.send('worked!!!!')
                //    console.log('yes ')
               }
            })
        }
    })
 })
Router.post('/favorite', auth, (req,res) =>{
    const email = req.session.email
    var sql3 = "SELECT * FROM favorite WHERE music_id = '"+ req.body.id +"' AND email = '"+ email +"'";
    con.query(sql3, async function (err, existResult){
      if(err){
         console.log(err)
         return
     }
     if(existResult.length > 0){
         let sql2 = "DELETE FROM favorite WHERE music_id = '"+ req.body.id +"' AND email = '"+ email +"'"
         con.query(sql2, async function (err, result){
            if(err){
               console.log(err)
               return
           }
        //    console.log(result)
        if(result.affectedRows >0){
            return res.send('already!')
        }
        });
     }else{
        var sql1 = "INSERT INTO favorite (id,email,music_id,name,category,url) VALUES ('" +req.body.id+"','" +email+"','" +req.body.music_id+"'," +con.escape(req.body.name) +"," +con.escape(req.body.category) +",'"+req.body.url+"')"
           con.query(sql1, async function (err, result){
            if(err){
               console.log(err)
               return
           }
        //    console.log(result)
           if(result.affectedRows > 0){
               return res.send('favorite!')
           }
        })
     }
     
    });
})
Router.post('/checkfav', (req, res) =>{
    const email = req.session.email
    if(email == null || email == undefined || email == ""){
        return res.send({success:'login'})
    }
    var sql3 = "SELECT * FROM favorite WHERE music_id = '"+ req.body.id +"' AND email = '"+ email +"'";
    con.query(sql3, async function (err, existResult){
      if(err){
         console.log(err)
         return
     }
    //  console.log(existResult)
     if(existResult.length > 0){
        return res.send({success:'exist'})
     }else{
        return res.send({success:'non'}) 
     }
    })
})
Router.get('/music/:id',(req,res)=>{
    // console.log(req.params.id)
    var category_status = "activated"
    var sql3 = "SELECT * FROM category WHERE category_status='" + category_status + "'";
      con.query(sql3, async function (err, categoryResult){
       if(err){
          console.log(err)
          return
      }   
    const email = req.body.email
    const music_status = "activated"
    var sql0 = "SELECT * FROM music WHERE music_id = '"+ req.params.id +"' AND status='"+ music_status +"' "
        con.query(sql0, async function (err, music_idResult){
         if(err){
             console.log(err)
             return
         }
         if(music_idResult.length > 0){
        var sql3 = "SELECT * FROM music WHERE  status='"+ music_status +"' ORDER BY play  DESC LIMIT 20";
        con.query(sql3, async function (err, existResult){
         if(err){
            console.log(err)
            return
        }
        return res.render('single-music',{categories:categoryResult,music:existResult,musicone:music_idResult,email:email,title:music_idResult[0].name})   
            })
        }else{
            res.redirect('/404')
        }
        })
    })
})
module.exports = Router
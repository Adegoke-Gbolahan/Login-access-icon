const express = require('express')
const Router = express.Router()
const con = require('../db/db')
const auth = require('../middleware/auth')
Router.get('', auth, async (req, res) =>{
    const email = req.session.email
          const music_status = "activated"
    var sql0 = "SELECT * FROM icon  WHERE  status='"+ music_status +"' ORDER BY id  DESC LIMIT 100"
    con.query(sql0, async function (err, music_idResult){
         if(err){
             console.log(err)
             return
         }
         var sql1 = "SELECT * FROM icon  WHERE  status='"+ music_status +"' ORDER BY id  DESC"
        con.query(sql1, async function (err, allResult){
            if(err){
                console.log(err)
                return
            }
            return res.render('home',{all:allResult,music:music_idResult,email:email,title:"Trending",home:'1'})
        });
        //  console.log(email)
        return 
    })
    
    
    
})

Router.get('/login', async (req, res) =>{
      
    try {
        res.render('login')
         } catch(e) {
             console.log(e)
            res.render('500')
         }
})






Router.get('/*',(req,res)=>{
    try{
        res.render('404')
    }catch(e){
        res.render('500')
    }
})
module.exports = Router
const express = require('express')
const Router = express.Router()
const con = require('../db/db')
const auth = require('../middleware/auth')
Router.get('', async (req, res) =>{
    const email = req.session.email
    //general tranding
    var category_status = "activated"
        var sql3 = "SELECT * FROM category WHERE category_status='" + category_status + "'";
         await con.query(sql3, async function (err, categoryResult){
           if(err){
              console.log(err)
              return
          } 
          const music_status = "activated"
    var sql0 = "SELECT * FROM music  WHERE  status='"+ music_status +"' ORDER BY play  DESC LIMIT 20"
    con.query(sql0, async function (err, music_idResult){
         if(err){
             console.log(err)
             return
         }
         var sql1 = "SELECT * FROM music  WHERE  status='"+ music_status +"' ORDER BY id  DESC"
        con.query(sql1, async function (err, allResult){
            if(err){
                console.log(err)
                return
            }
            return res.render('home',{categories:categoryResult,all:allResult,music:music_idResult,email:email,title:"Trending",home:'1'})
        });
        //  console.log(email)
        return 
    })
});
    
    
    
})
Router.get('/news', async (req,res)=>{
    const email = req.session.email
    // console.log(email)
    if(req.query.duration == "new"){
        // console.log(req.query.category)
        var category_status = "activated"
        var sql3 = "SELECT * FROM category WHERE category_status='" + category_status + "'";
         await con.query(sql3, async function (err, categoryResult){
           if(err){
              console.log(err)
              return
          }
          const music_status = "activated"
        var sql0 = "SELECT * FROM music  WHERE  status='"+ music_status +"' ORDER BY id  DESC LIMIT 20 "
        con.query(sql0, async function (err, music_idResult){
         if(err){
             console.log(err)
             return
         }
        //  console.log(email)
        
        var sql1 = "SELECT * FROM music WHERE  status='"+ music_status +"'"
        con.query(sql1, async function (err, allResult){
            if(err){
                console.log(err)
                return
            }
            return res.render('news',{categories:categoryResult,all:allResult,music:music_idResult,email:email,title:"Newest",home:'0'})
        });
        })
    })
        return
    }   
})
Router.get('/category',async (req,res)=>{
    const email = req.session.email
    //Check for category
    if(req.query.category){
        const music_status = "activated"
        var category_status = "activated"
        var sql3 = "SELECT * FROM category WHERE category_status='" + category_status + "'";
         await con.query(sql3, async function (err, categoryResult){
           if(err){
              console.log(err)
              return
          }     

        var sql0 = "SELECT * FROM music  WHERE  status='"+ music_status +"' AND category = '"+req.query.category +"' ORDER BY play  DESC LIMIT 20"
        con.query(sql0, async function (err, music_idResult){
         if(err){
             console.log(err)
             return
         }
        //  console.log(email)
        var sql1 = "SELECT * FROM music WHERE  status='"+ music_status +"'"
        con.query(sql1, async function (err, allResult){
            if(err){
                console.log(err)
                return
            }
            return res.render('category',{categories:categoryResult,all:allResult,music:music_idResult,email:email,title:req.query.category,home:'0'})
        });
    });
        //  console.log(email)
        return 
        })  
        return
    }
})
Router.get('/favourite',auth,async (req,res)=>{
    const email = req.session.email
    // console.log(email)
    //Check for category
    if(req.query.favourite == "1"){
        var category_status = "activated"
        var sql3 = "SELECT * FROM category WHERE category_status='" + category_status + "'";
         await con.query(sql3, async function (err, categoryResult){
           if(err){
              console.log(err)
              return
          }
        
        
       // console.log(req.query.category)
       var sql0 = "SELECT * FROM favorite  WHERE email='" + email + "'"
       con.query(sql0, async function (err, music_idResult){
        if(err){
            console.log(err)
            return
        }
       var sql1 = "SELECT * FROM favorite WHERE  email='"+ email +"'"
        con.query(sql1, async function (err, allResult){
            if(err){
                console.log(err)
                return
            }
            return res.render('favorite',{categories:categoryResult,all:allResult,music:music_idResult,email:email,title:"FAVORITE",home:'0'})
        });
       })
    })
       return  
    }
})
Router.get('/user-dashboard',auth, async (req, res) =>{
    // const email = req.session.email
    // console.log(email)
    var category_status = "activated"
    var sql3 = "SELECT * FROM category WHERE category_status='" + category_status + "'";
     await con.query(sql3, async function (err, categoryResult){
       if(err){
          console.log(err)
          return
      } 
    var sql0 = "SELECT * FROM music WHERE email = '"+req.session.email +"' ORDER BY play  DESC LIMIT 20"
        con.query(sql0, async function (err, music_idResult){
         if(err){
             console.log(err)
             return
         }
         const email = req.session.email
        //  console.log(music_idResult)
        res.render('dashboard.ejs',{categories:categoryResult,music:music_idResult,email:email,title:"Favorites"})
        return
        })
        return
    })
})
Router.get('/user-upload', auth, async (req, res) =>{
    var category_status = "activated"
    const email = req.session.email
    // console.log(email)
    try {
        var sql3 = "SELECT * FROM category WHERE category_status='" + category_status + "'";
         await con.query(sql3, async function (err, categoryResult){
           if(err){
              console.log(err)
              return
          }
          res.render('upload', {categories:categoryResult,email:email})
        
         })
         } catch(e) {
             console.log(e)
            res.render('500')
         }
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
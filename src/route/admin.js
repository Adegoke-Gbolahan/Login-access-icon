const express = require('express')
const Router = express.Router()
const con = require('../db/db')
const auth  = require('../middleware/admin-auth')

Router.get('/admin', auth, async (req, res) =>{
    try{  
        res.render('admin-login',{email:null})
    }catch(e){
        res.render('500')
    }
    
})

Router.get('/admin-login', async (req, res) =>{
    try{
        res.render('admin-login',{email:null})
    }catch(e){  
        res.render('500')
    }
   
})

Router.post('/admin-login', async (req, res) =>{
    const password = req.body.adminpassword
    // console.log(req.body)
    try {
       var sql3 = "SELECT * FROM admin WHERE emai = "+ con.escape(req.body.adminUnameEmail) +" OR username = "+ con.escape(req.body.adminUnameEmail) +" AND pass = "+ con.escape(req.body.adminpassword) +"";
        con.query(sql3, async function (err, theAdminResult, fields){
          if(err){
             console.log(err)
             return
         }
        //  console.log(theAdminResult)
         if(theAdminResult.length < 1){
          return res.status(201).send({error:"doesnotexist"})
         }
         if(theAdminResult[0].pass == password){
        //   req.session.regname = memberResult[0].sname + " " + memberResult[0].fname;
        //   req.session.level = "updated"
          if(theAdminResult[0].status == "suspended"){
            return res.status(201).send({error:"suspended"})
          }
          if(theAdminResult[0].status == "activated"){
            req.session.adminLoggedin = true;
            req.session.adminAppId = theAdminResult[0].id;
            req.session.adminUsername = theAdminResult[0].username;
            req.session.adminEmail =  theAdminResult[0].emai;
            return res.status(201).send({success:"activated"})
          }
          
         }else{
          return res.status(201).send({error:"incorrectPassword"})
         }
       })
    }catch (e) {
       console.log(e)
       res.render('500')
    }
})

Router.get('/admin-logout',  auth, async(req,res) =>{
    req.session.adminLoggedin = false;
    req.session.adminAppId = null;
    req.session.adminUsername = null
    res.redirect('/admin-login')
 });

Router.get('/admin-dashboard', auth, async (req, res) =>{
    try {
        var sql3 = "SELECT * FROM icon";
         await con.query(sql3, async function (err, allIconResult){
           if(err){
              console.log(err)
              return
          }

            //COUNT ADMINS
            var sqladmin = "SELECT count(*) as total FROM admin";
            var query1 =  con.query(sqladmin, function(err, adminresult) {
            adminCount = adminresult[0].total
            

             //COUNT users
             var sqlicon = "SELECT count(*) as total FROM icon";
             var queryIcon =  con.query(sqlicon, function(err, iconResult) {
             iconCount = iconResult[0].total
             var sqluser = "SELECT count(*) as total FROM users";
             var query2 =  con.query(sqluser, function(err, usersResult) {
             userCount = usersResult[0].total
            res.render('admin-dashboard', {icon:allIconResult,adminCount:adminCount,userCount:userCount,iconCount:iconCount})
             });
            });
        });
     });
         } catch(e) {
            res.render('500')
         }
})

Router.get('/admin-user', auth, async (req, res) =>{
    try {
        var sql3 = "SELECT * FROM users";
         await con.query(sql3, async function (err, usersResult){
           if(err){
              console.log(err)
              return
          }
          res.render('admin-user', {users:usersResult})
         })
         } catch(e) {
            res.render('500')
         }
})

Router.get('/admin-icon', auth, async (req, res) =>{
       try {     
        var sql3 = "SELECT * FROM icon";
         await con.query(sql3, async function (err, musicResult){
           if(err){
              console.log(err)
              return
          }
          res.render('admin-music', {icon:musicResult})
         })
         } catch(e) {
            res.render('500')
         }
})


Router.get('/admin-edit-sound/:id', auth, async (req, res) =>{
    try {  
    const email = req.body.email
    const music_status = "activated"
    var sql0 = "SELECT * FROM icon WHERE id = '"+ req.params.id +"'"
        con.query(sql0, async function (err, music_idResult){
         if(err){
             console.log(err)
             return
         }
         if(music_idResult.length > 0){
        var sql3 = "SELECT * FROM icon WHERE  id='"+ req.params.id +"'";
        con.query(sql3, async function (err, existResult){
         if(err){
            console.log(err)
            return
        }
        return res.render('admin-edit-sound',{music:existResult,musicone:music_idResult})   
            })
        }else{
            res.redirect('/404')
        }
        })
        
    
         } catch(e) {
             res.render('500')
         }
})

Router.post('/admin-update-sound',  auth,  async (req,res) =>{
   const id = req.body.iconId
//    console.log(id)
   var sql3 = "SELECT * FROM icon WHERE id = '"+ id +"'";
       con.query(sql3, async function (err, existResult){
         if(err){
            console.log(err)
            return
        }
        // console.log(existResult)
        if( existResult.length  > 0){
            const sql0 = "UPDATE icon SET title	 =  "+ con.escape(req.body.iconName) +", link = "+ con.escape(req.body.iconLink) +" WHERE id  = "+ con.escape(id) +"";
            con.query(sql0, async function (err, updatedResult){
                if(err){
                   console.log(err)
                   return
               }
               if(updatedResult.affectedRows > 0){
                 res.status(201).send({success:"saved"})
               }else{
                    res.status(201).send({error:"error"})
               }
            })
        }
    })
 })

Router.get('/admin-admin',  auth,async (req, res) =>{
    try {  
        var sql3 = "SELECT * FROM admin";
            await con.query(sql3, async function (err, adminResult){
            if(err){
                console.log(err)
                return
            }
            res.render('admin-admin', {admin:adminResult})
    })
    } catch(e) {
        res.render('500')
    }
})

Router.post('/admin-add', auth, async (req, res) =>{
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    var date_created = year + "-" + month + "-" + date
   try{
    var sql3 = "SELECT emai FROM admin wHERE emai = "+ con.escape(req.body.inputNext_adminEmail) +" OR username = " +con.escape(req.body.inputNext_adminUseranme) +"";
    con.query(sql3, async function (err, existResult){
      if(err){
         console.log(err)
         return
     }
     //console.log(result)
     if( existResult.length  > 0){
      return res.status(200).send({error:"exist"})
      
     }
     var status = "activated";
    //  const UserId = Math.floor(Math.random() * (999999 - 100000 + 1)) +100000;
     var sql1 = "INSERT INTO admin (emai,pass,date_created,username,status) VALUES (" +con.escape(req.body.inputNext_adminEmail) +"," +con.escape(req.body.inputNext_adminPassword) +",'" + date_created +"'," +con.escape(req.body.inputNext_adminUseranme) +",'"+status+"')"
     result = con.query(sql1)
     if(result){
          req.session.email = req.body.email
          req.session.username = req.body.sname + " " + req.body.username
          res.status(201).send({success:"saved"})
     }


    })
   } catch(e) {
    console.log(e)
   }
})

Router.post('/admin-action', auth, async (req, res) =>{
    mangeSqlTable = req.body.manageTable

    try {
        if(mangeSqlTable === "admin"){
            var sql2 = "UPDATE admin SET status = "+ con.escape(req.body.manageAction) +" WHERE id = " +  con.escape(req.body.manage_id) + ""
            con.query(sql2, async function (err, action) {
                if(err){
                  console.log(err);
                  return true;
                }
          
                if(action.affectedRows > 0){
                   return res.status(201).send({success: "successAction"});
                }else{
                  return res.status(201).send({error: "errorAction"});
                }
          
            })
        }

        if(mangeSqlTable === "user"){
            var sql2 = "UPDATE users SET status = "+ con.escape(req.body.manageAction) +" WHERE id = " +  con.escape(req.body.manage_id) + ""
            con.query(sql2, async function (err, action) {
                if(err){
                  console.log(err);
                  return true;
                }

              
                if(action.affectedRows > 0){
                   return res.status(201).send({success: "successAction"});
                }else{
                  return res.status(201).send({error: "errorAction"});
                }
          
            })
        }

        if(mangeSqlTable === "music"){
            var sql2 = "UPDATE icon SET status = "+ con.escape(req.body.manageAction) +" WHERE id = " +  con.escape(req.body.manage_id) + ""
            con.query(sql2, async function (err, action) {
                if(err){
                  console.log(err);
                  return true;
                }
          
                if(action.affectedRows > 0){
                   return res.status(201).send({success: "successAction"});
                }else{
                  return res.status(201).send({error: "errorAction"});
                }
          
            })
        }

        if(mangeSqlTable === "category"){
            var sql2 = "UPDATE category SET category_status = "+ con.escape(req.body.manageAction) +" WHERE category_id = " +  con.escape(req.body.manage_id) + ""
            con.query(sql2, async function (err, action) {
                if(err){
                  console.log(err);
                  return true;
                }
          
                if(action.affectedRows > 0){
                   return res.status(201).send({success: "successAction"});
                }else{
                  return res.status(201).send({error: "errorAction"});
                }
          
            })
        }

        if(mangeSqlTable === "deletemusic"){
            var sql2 = "DELETE FROM icon WHERE id = " +  con.escape(req.body.manage_id) + ""
            con.query(sql2, async function (err, action) {
                if(err){
                  console.log(err);
                  return true;
                }
          
                if(action.affectedRows > 0){
                   return res.status(201).send({success: "successAction"});
                }else{
                  return res.status(201).send({error: "errorAction"});
                }
          
            })
        }
        
    } catch(e) {
        res.render('500')
    }
})


Router.get('/admin/*', auth, async (req, res) =>{
    
    try{
        res.redirect('/404')
    }catch(e){
        res.redirect('/500')
    }
})

Router.get('/admin-add/*', auth, async (req, res) =>{
    try{
        res.redirect('/404')
    }catch(e){
        res.redirect('/500')
    }
})

Router.get('/admin-admin/*', auth, async (req, res) =>{
    try{
        res.redirect('/404')
    }catch(e){
        res.redirect('/500')
    }
})

Router.get('/admin-music/*', auth, async (req, res) =>{
    try{
        res.redirect('/404')
    }catch(e){
        res.redirect('/500')
    }
})

Router.get('/admin-user/*', auth, async (req, res) =>{
    try{
        res.redirect('/404')
    }catch(e){
        res.redirect('/500')
    }
})

Router.get('/admin-dashboard/*', auth, async (req, res) =>{
    try{
        res.redirect('/404')
    }catch(e){
        res.redirect('/500')
    }
})

Router.get('/admin-login/*', auth, async (req, res) =>{
    try{
        res.redirect('/404')
    }catch(e){
        res.redirect('/500')
    }
})

module.exports = Router
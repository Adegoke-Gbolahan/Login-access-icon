const express = require('express')
const path = require('path')
const ejs =  require('ejs')
const session = require('cookie-session')
const bodyParser = require('body-parser')


const app = express()

//SET VIEWS AND VIEW ENGINE
app.set("views", "./src/views")//SET VIEWS FOLDER
app.set("view engine", "ejs")//SET VIEW ENGINE(HBS)
// hbs.registerPartials(partialpath)

//SET STATIC FOLDER AND PUBLIC FOLDER
app.use(express.static('public'))//SET AND USE PUBLIC FOLDER
app.use('/css', express.static(__dirname = "./public/css"))//SET STATIC CSS FOLDER
app.use('/fonts', express.static(__dirname = "./public/fonts"))//SET STATIC FONTS FOLDER
app.use('/images', express.static(__dirname = "./public/images"))//SET STATIC IMG FOLDER
app.use('/js', express.static(__dirname = "./public/js"))//SET STATIC JS FOLDER
app.use('/icon', express.static(__dirname = "./public/icon"))//SET STATIC assets FOLDER

//require ROUTER
const indexRouter = require('./src/route/index') //GET INDEX ROUTE PATH
const musicRouter = require('./src/route/music')//Password Reset ROUTE PATH
const adminRouter = require('./src/route/admin')//admin ROUTE PATH
const registerRouter = require('./src/route/register')//GET Register ROUTE PATH
const uploadRouter = require('./src/route/upload')//GET upload ROUTE PATH
const AdminuploadRouter = require('./src/route/admin-upload')//GET upload ROUTE PATH
const loginRouter = require('./src/route/login')//GET login ROUTE PATH

//URL ENCODE
app.use(bodyParser.urlencoded({ extended: true }))
//USE ROUTER
app.use(express.json())
app.use(session({
   secret:"bmtywebsitehere",
   resave:false,
   saveUninitialized:true 
}));
app.use('/', musicRouter)//USE GET music ROUTE
app.use('/', adminRouter)//GET admin ROUTE
app.use('/', registerRouter)//USE GET Resiter ROUTE
app.use('/', uploadRouter)//USE GET Upload ROUTE
app.use('/', AdminuploadRouter)//USE GET Upload ROUTE
app.use('/', loginRouter)//USE GET lOGIN ROUTE
app.use('/music/', musicRouter)
app.use('/', indexRouter)//USE GET INDEX ROUTE

const port = process.env.PORT || 4000//PORT(localhost:5000)

//listen to app and log port to console
app.listen(port, () =>
   console.log("listening to port " + port)
)
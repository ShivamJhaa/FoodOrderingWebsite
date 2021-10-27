const express = require('express')
const path = require('path')
const mysql = require('mysql')
const app = express()
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

dotenv.config({ path: './.env'})

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser())
app.set('view engine','hbs')

db.connect((err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("mysql connected");
    }
})

//Defining routes
app.use('/',require('./routes/pages'))
app.use('/auth',require('./routes/auth'))

app.get('/profile',(req,res)=>{
    
    res.render('profile')
})
app.get('/auth/logout', async (req, res) =>
{
    res.clearCookie('jwt');
    res.redirect('/login')
})
// exports.logout = async (req,res) => {
//     res.clearCookie('jwt');
//     res.redirect('/login');
// };

app.listen(3000,(err)=>{
    if(err){
        console.log(err);
    }
    else {
        console.log('Server is listening at port 3000')
    }
})
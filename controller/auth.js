const jwt = require('jsonwebtoken')
const mysql = require('mysql')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const {promisify} = require('util')

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

exports.signup = (req,res)=>{
    const {
        name,email,phone,password,cpassword
    } = req.body

    db.query('SELECT email FROM users WHERE email = ?',[email],async (err,result)=>{
        if (err){
            console.log(err);
        }
        if(result.length > 0 ){
            return res.render('signup',{
                message: 'Email already in use'
            })
        }
        else if(password !== cpassword){
            return res.render('signup',{
                message: 'Passwords do not match'
            })
        }

        let hpassword = await bcrypt.hash(password,8)
        console.log(hpassword)

        db.query('INSERT INTO users SET ? ',{name: name, email: email, phone: phone, password: hpassword},(err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.status(200).render('login',{
                    message: 'User Registered'
                })
            }
        })
})
}

exports.login = async (req,res)=>{
    try{
        const{email,password}=req.body

        if(!email || !password){
            return res.status(400).render('login',{
                message: 'Please provide the details'
            })
        }

        db.query('SELECT * FROM users WHERE email = ?',[email],async(err,result)=>{
            console.log(result)

            if(!result || !(await bcrypt.compare(password,result[0].password ))){
                res.status(401).render('login',{
                    message: 'Email or password is incorrect'
                })
            } else {
                const id = result[0].email
                const token = jwt.sign({id}, process.env.JWT_SECRET,{
                    expiresIn: process.env.JWT_EXPIRES_IN
                })
                //console.log('The token is' + token);

                const cookieO = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES* 24 * 60 *60* 1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt',token,cookieO)
                res.status(200).redirect("/")
            }
        })

    } catch(err){
        console.log(err);
    }
}

exports.isLoggedIn = async (req,res,next)=>{
    console.log(req.cookies)
    if (req.cookies.jwt){
        try{
            //Verify the token
            const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
            //console.log(decode);

            //Check if the user still exits
            db.query('SELECT * FROM users WHERE email = ?',[decode.id],(err,result)=>{
                //console.log(result)

                if(!result){
                    return next();
                }
                req.user = result[0] 

                return next()
            })

        }
        catch(error){
            console.log(error);
            return next();
        }
    }else {
        next();
    }

 
}


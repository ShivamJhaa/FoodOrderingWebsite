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
exports.placeOrder = (req,res)=>{
    const {
        name,email,phone,address,title,price,category,qty
    } = req.body

    
    const total = qty * price;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

        db.query('INSERT INTO orders SET ? ',{cid: name, cemail:email, cphone: phone, caddress: address,order_date: dateTime, title: title, price: price,qty: qty, total: total, category: category},(err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                return res.redirect('/corders');
            }
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
                // const nm = result[0].name
                // const token2 = jwt.sign({nm}, process.env.JWT_SECRET,{
                //     expiresIn: process.env.JWT_EXPIRES_IN
                // })
                //console.log('The token is' + token);

                const cookieO = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES* 24 * 60 *60* 1000
                    ),
                    httpOnly: true
                }
                // const cookie1 = {
                //     expires: new Date(
                //         Date.now() + process.env.JWT_COOKIE_EXPIRES* 24 * 60 *60* 1000
                //     ),
                //     httpOnly: true
                // }
                res.cookie('jwt',token,cookieO)
                // res.cookie('jwt',token2,cookie1)
                res.status(200).redirect("/")
            }
        })

    } catch(err){
        console.log(err);
    }
}


// exports.view =  (req, res) =>
// {
    
       

//         db.query('Select * from menu', (err, rows) =>
//         {
            

//             if (!err)
//             {
//                 // res.render('home', { rows });
//                 req.data = rows

//             }
//             else
//             {
//                 console.log(err);
//             }
//             console.log('The data from user table : \n', rows);
//         });
   
// }



exports.isLoggedIn = async (req,res,next)=>{
    // console.log(req.cookies)

    db.query('Select * from menu where instock=?',["yes"] ,(err, rows) =>
            {
            //When done with the connection, release it 
            // connection.release();
                // console.log("hello");
                if (err)
                {
                    console.log(err);
                    // res.render('home', { rows });
                    
                }
                else
                {
                    req.data = rows
                }
                // console.log('The data from user table : \n', rows);
            });
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
exports.checkFoodId = async (req,res,next)=>{
    // console.log(req.cookies)
    const { id } = req.body
    // console.log(req.body);
    db.query('Select * from menu where id=?' ,[id],async (err, rows) =>
            {
            //When done with the connection, release it 
            // connection.release();
                // console.log("hello");
                if (err)
                {
                    console.log(err);
                    // res.render('home', { rows });
                    
                }
                else
                {
                    req.data = rows
                }
                console.log('The data from user table : \n', rows);
            });
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
exports.seeOrders = async (req, res, next) =>
{
    
    if (req.cookies.jwt){
        try{
            //Verify the token
            const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
            console.log(decode);
            
            
            //Check if the user still exits
            db.query('SELECT * FROM orders WHERE cemail = ? order by id desc limit 20',[decode.id],(err,result)=>{
                //console.log(result)
                
                if(!result){
                    return next();
                }
                req.data = result
                // req.user = decode.name;
                console.log(req.data);
                // console.log(req.user);
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
exports.manageOrders = async (req, res, next) =>
{
    
    if (req.cookies.jwt){
        try{
            //Verify the token
            const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
            console.log(decode);
            
            
            //Check if the user still exits
            db.query('SELECT * FROM orders WHERE category = ? order by id desc ',[decode.id],(err,result)=>{
                //console.log(result)
                
                if(!result){
                    return next();
                }
                req.data = result
                // req.user = decode.name;
                console.log(req.data);
                // console.log(req.user);
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

exports.uOrders =  (req, res)=>{
    
    const {
        id,
        status
    } = req.body

    
    

        db.query(`Update orders SET status=? where id='${id}'`,[status],(err,result)=>{
            if(err){
                console.log(err);
            }
            else
            {
                console.log(result);
                return res.redirect('/morders');
            }
        })
        


}

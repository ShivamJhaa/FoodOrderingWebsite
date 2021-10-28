const express = require('express')
const authController = require('../controller/auth')

const router = express.Router();

router.get('/', authController.isLoggedIn, (req, res) =>
{
    
    console.log(req.user)
    res.render('index', {
        data :req.data,
        user: req.user
    })
})
router.get('/login',(req,res)=>{
    res.render('login')
})

router.get('/signup',(req,res)=>{
    res.render('signup')
})
router.get('/profile',authController.isLoggedIn,(req,res)=>{
    
    if (req.user)
    {
        if(req.user.type==="admin")
        res.render('admprofile',{
            user: req.user
        })
        else
        res.render('profile',{
            user: req.user
        })
        
    } else {
        res.redirect('/login')
    }
   
})

module.exports = router;
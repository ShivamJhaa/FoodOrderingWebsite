const express = require('express')
const authController = require('../controller/auth')

const router = express.Router();

// // ,authController.view
router.get('/',authController.isLoggedIn, (req, res) =>
{
    
    console.log(req)
    if (req.user)
        res.render('index', {
            data: req.data,
        
            user: req.user
        });
    else
    {
        console.log(req.data)
        res.render('index', {
            data: req.data
        })
    }

    
})
    router.get('/login', (req, res) =>
    {
        res.render('login')
    })

    router.get('/signup', (req, res) =>
    {
        res.render('signup')
    })
    





    router.post('/cart', authController.checkFoodId, (req, res) =>
    {
    
        if (req.user)
        {
           
                res.render('cart', {
                    data: req.data,
                    user: req.user

                })
        
        } else
        {
            res.redirect('/login')
        }
   
    })
    router.post('/menu', authController.isLoggedIn, (req, res) =>
    {
    
        if (req.user)
        {
           
                res.render('menu', {
                    data: req.data,
                    user: req.user

                })
        
        } else
        {
            res.redirect('/login')
        }
   
    })
    router.get('/menu', authController.isLoggedIn, (req, res) =>
    {
    
        if (req.user)
        {
           
                res.render('menu', {
                    data: req.data,
                    user: req.user

                })
        
        } else
        {
            res.redirect('/login')
        }
   
    })
    
    router.post('/corders', authController.seeOrders,  (req, res) =>
    {
    
        // console.log(req.user['name']);
        if (req.user)
        {
            res.render('corders', {
                
                data: req.data,
                user: req.user
                
            })
        
        } else
        {
            res.redirect('/login')
        }
   
    })
    router.get('/corders', authController.seeOrders, (req, res) =>
    {
    
        if (req.data)
        {
            // console.log(req.data);
                res.render('corders', {
                    data: req.data

                })
        
        } else
        {
            res.redirect('/login')
        }
   
    })
    router.get('/morders', authController.manageOrders, (req, res) =>
    {
    
        if (req.data)
        {
            // console.log(req.data);
                res.render('morders', {
                    data: req.data

                })
        
        } else
        {
            res.redirect('/login')
        }
   
    })

router.post('/updateOrders', authController.uOrders);

router.post('/porder', authController.placeOrder);
    router.get('/profile', authController.isLoggedIn, (req, res) =>
    {
    
        if (req.user)
        {
            if (req.user.type === "admin")
                res.render('admprofile', {
                    user: req.user
                })
            else
                res.render('profile', {
                    user: req.user
                })
        
        } else
        {
            res.redirect('/login')
        }
   
    })

    module.exports = router;

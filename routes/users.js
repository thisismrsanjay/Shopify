const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');


router.get('/signup', (req, res, next) => {
    res.render('signup', {
        errors: req.flash('errors')
    })
})
router.get('/login', (req, res) => {
    res.render('login', {
        loginMessage: req.flash('loginMessage')
    });
})

router.get('/profile', (req, res) => {
    User.findOne({ _id: req.user._id }, (err, user) => {
        if (err) throw err;
        res.render('profile', { user: user });
    })

})

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true
}))

router.post('/signup', (req, res, next) => {
    var user = new User();

    user.profile.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.profile.picture = user.gravatar();


    User.find({ email: req.body.email }, (err, data) => {
        if (err) throw err;
        else {
            if (data.length >= 1) {
                req.flash('errors', 'Account with email exists login first');
                return res.redirect('./signup');
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({ error: err, message: 'hashing failed' });
                    } else {
                        //cool
                        user.password=hash;

                        user.save((err, data) => {
                            if (err) {
                                res.status(500).json(err);
                            } else {
                                req.logIn(user, (err) => {
                                    if (err) throw err;
                                    res.redirect('/user/profile');
                                })
                            }
                        })
                    }
                })
            }
        }
    })
})

router.get('/logout', function (req, res) {
    req.logout();

    res.redirect('/user/login');
})

router.get('/edit-profile',(req,res)=>{
    res.render('edit-profile');
})
router.post('/edit-profile',(req,res)=>{
    User.findOne({_id:req.user._id},(err,user)=>{
        if(err)throw err;
        if(req.body.name)user.profile.name = req.body.name;
        if(req.body.address) user.address =req.body.address;
        user.save((err)=>{
            if(err)throw err;
            req.flash('success','Successfully edited');
            return res.redirect('/user/profile');
        })
    })
})



module.exports = router;
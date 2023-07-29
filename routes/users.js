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

router.get('/profile', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        res.render('profile', { user: user });
    } catch (err) {
        // Handle error here - for example, log it and send a response to the user
        console.error(err);
        res.status(500).send("An error occurred");
    }
});


router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true
}))

router.post('/signup', async (req, res, next) => {
    var user = new User();

    user.profile.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.profile.picture = user.gravatar();

    try {
        let existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            req.flash('errors', 'Account with email exists login first');
            return res.redirect('./signup');
        } else {
            try {
                let hash = await bcrypt.hash(req.body.password, 10);
                user.password = hash;

                let savedUser = await user.save();
                req.logIn(savedUser, (err) => {
                    if (err) throw err;
                    res.redirect('/user/profile');
                });
            } catch (err) {
                res.status(500).json({ error: err, message: 'Hashing or saving failed' });
            }
        }
    } catch (err) {
        res.status(500).json({ error: err, message: 'User finding failed' });
    }
})

router.get('/logout', function (req, res) {
    req.logout();

    res.redirect('/user/login');
})

router.get('/edit-profile',(req,res)=>{
    res.render('edit-profile');
})
router.post('/edit-profile', async (req, res) => {
    try {
        let user = await User.findOne({_id: req.user._id});

        if(req.body.name) user.profile.name = req.body.name;
        if(req.body.address) user.address =req.body.address;
        
        try {
            await user.save();
            req.flash('success', 'Successfully edited');
            return res.redirect('/user/profile');
        } catch (err) {
            throw err; // Or handle error as you see fit
        }
    } catch (err) {
        throw err; // Or handle error as you see fit
    }
})




module.exports = router;
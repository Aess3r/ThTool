const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

//User Model
const User = require('../models/User')

// Login Page
router.get('/login', (req, res) => {
    res.render('users/Login')
})


// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dash',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout()
    
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
    //req.session.destroy()
})


// Register Page
router.get('/register', (req, res) => {
        res.render('users/register')
})

// Register Handle
router.post('/register', (req, res) =>{
    const { name, email, password, password2, userlvl } = req.body
    let errors = [];

    //Check required fields
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields'})
    }
    //Check password match
    if(password !== password2) {
        errors.push({ msg: 'Passwords do not match' })
    }
    //Check password lenght
    if(password.lenght < 6){
        errors.push({ msg: 'Password should be at least 6 characters' })
    }

    if(errors.length > 0) {
        res.render('users/register', {
            errors,
            name,
            email,
            password,
            password2,
            userlvl
        })
    } else {
        // Validation passed
        User.findOne({ email: email })
        .then(user => {
            if(user) {
                //User exists
                errors.push({ msg: 'Kyseinen sähköposti on jo lisätty' })
                res.render('users/register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password,
                    userlvl,
            
                })
                
                //Hash Password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err
                    //Set Password to hashed
                    newUser.password = hash
                    //Save user
                    newUser.save()
                    .then(user => {
                        req.flash('success_msg', 'Käyttäjä lisätty')
                        res.redirect('/users/login')
                    })
                    .catch(err => console.log(err))
                }))
                
            }
        })
    }
})

module.exports = router
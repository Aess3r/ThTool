const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { ensureAuthenticated } = require('../config/auth')
const User = require('../models/User')


// Admin Users
router.get('/',ensureAuthenticated, async (req, res) => {
try {
    const users = await User.find({})
    res.render('admin/users', {
        name: req.user.name,
        userlvl: req.user.userlvl,
        userID: req.user.id,
        users: users
    })
} catch {

}

})

// Register Handle
router.post('/',ensureAuthenticated, async (req, res) => {
    const users = await User.find({})
    const { name, email, password, lvl } = req.body
    let errors = []

    //Check required fields
    if(!name || !email || !password || !lvl) {
        errors.push({ msg: 'Täytä kaikki kentät'})
    }
    
    //Check password lenght
    if(password.lenght < 6){
        errors.push({ msg: 'Salasanan pitäisi olla vähintään 6 merkkiä' })
    }

    if(errors.length > 0) {
        res.render('admin/users', {
            errors,
            name: req.user.name,
            userlvl: req.user.userlv,
            users: users
            
        })
    } else {
        // Validation passed
        User.findOne({ email: email })
        .then(user => {
            if(user) {
                //User exists
                errors.push({ msg: 'Kyseinen sähköposti on jo lisätty' })
                res.render('admin/users', {
                    errors,
                    name: req.user.name,
                    userlvl: req.user.userlvl,
                    users: users
                })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password,
                    userlvl: req.body.lvl
            
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
                        res.redirect('/admin')
                    })
                    .catch(err => console.log(err))
                }))
                
            }
        })
    }
})






module.exports = router
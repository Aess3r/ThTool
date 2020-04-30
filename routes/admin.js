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

// Edit User
router.get('/:id/edit', async (req, res) => {
    const user = await User.findById(req.params.id)
    const users = await User.find({}) 
    try{        
        res.render('admin/edituser', {
            userlvl: req.user.userlvl,
            name: req.user.name,
            users: users,
            user: user
     })
    } catch {
        res.redirect('/admin')
    }
    
})

// Update User
router.put('/:id', async (req, res) => {
   let user
    try{
        user = await User.findById(req.params.id)
        user.userlvl = req.body.lvl
        users = await User.find({})
      
        await user.save()
        req.flash('success_msg', 'Käyttäjä luokka muutettu')
        res.redirect('/admin')
         
        
   } catch {
        res.render('admin/edituser', {
            user: user,
            errormessage: 'Käyttäjän päivityksessä virhe',
            name: req.user.name,
            userlvl: req.user.userlvl,
            users: users
        })
    }
   
})

//Reset Password
router.put('/:id/reset', async (req, res) => {
    let user
     try{
         user = await User.findById(req.params.id)
         user.password = "123456"
         users = await User.find({})
      
        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) throw err
                //Set Password to hashed
                 user.password = hash
                 //Save user
                 user.save()
                 .then(user => {
                     req.flash('success_msg', 'Salasana nollattu')
                     res.redirect('/admin')
                 })
                 .catch(err => console.log(err))
             }))
        
         
    } catch {
     if(user == null) {
         res.redirect('/admin')
     } else {
         res.render('admin/edituser', {
             user: user,
             errormessage: 'Käyttäjän päivityksessä virhe',
             name: req.user.name,
             userlvl: req.user.userlvl,
             users: users
         })
     }
    }
 })

 //Update Password

router.put('/:id/upd', async (req, res) => {
    let user
     try{
         user = await User.findById(req.params.id)
         user.password = req.body.password
         users = await User.find({})
      
        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) throw err
                //Set Password to hashed
                 user.password = hash
                 //Save user
                 user.save()
                 .then(user => {
                     req.flash('success_msg', 'Salasana vaihdettu')
                     res.redirect('/admin')
                 })
                 .catch(err => console.log(err))
             }))
        
         
    } catch {
     if(user == null) {
         res.redirect('/admin')
     } else {
         res.render('admin/edituser', {
             user: user,
             errormessage: 'Käyttäjän päivityksessä virhe',
             name: req.user.name,
             userlvl: req.user.userlvl,
             users: users
         })
     }
    }
 })

// Delete User
router.delete('/:id', async (req, res) => {
    let user
    try{
        user = await User.findById(req.params.id)
        await user.remove()
        req.flash('success_msg', 'Käyttäjä poistettu')
        res.redirect('/admin')
   } catch {
    if(user == null) {
        res.redirect('/admin')
    } else {
        res.render('admin/edit', {
            user: user,
            errormessage: 'Käyttäjän päivityksessä virhe'
        })
    }
   }
})


// Create User
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
            userlvl: req.user.userlvl,
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
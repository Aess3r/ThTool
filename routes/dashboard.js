const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')
const Bladders = require('../models/Bladders')
const User = require('../models/User')


// Dashboard
router.get('/',ensureAuthenticated, async (req, res) => {
    try { 
        const user = await User.find({})  
        res.render('dashboard/dash', {
            userlvl: req.user.userlvl,
            name: req.user.name
        })
    } catch {
        res.redirect('/users/login')
    }
})


// New Bladder
router.get('/new',ensureAuthenticated, async (req, res) => {
    try {
        const user = await User.find({})
        const bladders = await Bladders.find({})
         res.render('dashboard/new', {
            user: user,
            name: req.user.name,
            userlvl: req.user.userlvl,
            bladders: bladders

        })
    } catch {
        res.redirect('/dash')
    }
    

})

//Create Bladder
router.post('/',ensureAuthenticated, async (req, res) => {
    const { bladder, stored, line } =req.body
    const bladders = await Bladders.find({})
    let errors = []

    
    if(!bladder || !stored || !line) {
        errors.push({ msg: 'Täytä tähdellä merkityt kentät'})
    }
    
  
    if(errors.length > 0) {
        res.render('dashboard/new', {
            errors,
            name: req.user.name,
            userlvl: req.user.userlvl,
            bladders: bladders,
            itemcode: req.body.itemcode,
            bladder: req.body.bladder,
            qty: req.body.qty,
            unique:req.body.unique,
            line: req.body.line,
            stored: req.body.stored
        })
        console.log(errors)
    } else {
        const newBladder = new Bladders({
            itemcode: req.body.itemcode,
            bladder: req.body.bladder,
            qty: req.body.qty,
            unique: req.body.unique,
            line: req.body.line,
            stored: req.body.stored,
            userid: req.user._id
        })
        newBladder.save()
        .then(bladder => {
            req.flash('success_msg', 'Paketti lisätty')
            res.redirect('/dash/new')
        })
        
    }
})


// Show Bladder
router.get('/:id', (req, res) => {
    res.send('Show Bladder' + req.params.id)
})

//Edit Bladder

router.get('/:id/edit', (req, res) => {
    res.send('Edit Bladder' + req.params.id)
})

// Update Bladder

router.put('/:id', (req, res) => {
    res.send('Update Bladder' + req.params.id)
})

// Delete Bladder

router.delete('/:id', (req, res) => {
    res.send('Delete Bladder' + req.params.id)
})
module.exports = router
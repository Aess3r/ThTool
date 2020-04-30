const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')
const Bladders = require('../models/Bladders')
const User = require('../models/User')
const Stored = require('../models/Storecontrol')
const History = require('../models/history')
const Moment = require('moment')

// Dashboard
router.get('/',ensureAuthenticated, async (req, res) => {
    let query = Bladders.find()
    if (req.query.itemcode != null && req.query.itemcode !== '') {
        query = query.regex('itemcode', new RegExp(req.query.itemcode, 'i'))
    }
    
    if (req.query.unique != null && req.query.unique !== '') {
        query = query.regex('unique', new RegExp(req.query.unique, 'i'))
    }
    try { 
        const user = await User.find({})
        const bladders = await query.exec()
        res.render('dashboard/dash', {
            userlvl: req.user.userlvl,
            name: req.user.name,
            bladders: bladders,
            user: user,
            moment: Moment,
            searchOptions: req.query
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
        const storedb = await Stored.find({})
         res.render('dashboard/new', {
            user: user,
            name: req.user.name,
            userlvl: req.user.userlvl,
            bladders: bladders,
            storedb: storedb,
            moment: Moment

        })
    } catch {
        res.redirect('/dash', {

        })
    }
    

})

//Create Bladder
router.post('/',ensureAuthenticated, async (req, res) => {
    const { bladder, stored, line } =req.body
    const bladders = await Bladders.find({})
    const storedb = await Stored.find({})
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
            stored: req.body.stored,
            storedb: storedb,
            moment: Moment
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
            userid: req.user._id,
            versio: req.body.versio
        })
        newBladder.save()
        .then(bladder => {
            req.flash('success_msg', 'Paketti lisätty')
            res.redirect('/dash')
        })
        
    }
})


// Show Bladder
router.get('/:id', async (req, res) => {

    const bladder = await Bladders.findById(req.params.id)
    const storedb = await Stored.find({})
    try {
        res.render('dashboard/dashedit', {
            userlvl: req.user.userlvl,
            name: req.user.name,
            bladder: bladder,
            storedb: storedb,
            moment: Moment
        })
    } catch {
        res.send('Show Bladder' + req.params.id)
    }
    
})

//Edit Bladder

router.get('/:id/edit', (req, res) => {
    res.send('Edit Bladder' + req.params.id)
})

// Update Bladder

router.put('/:id/upd', async (req, res) => {
    let bladders
    const { itemcode, qtyupd, stored } = req.body
    try {
        bladders = await Bladders.findById(req.params.id)
        bladders.itemcode = itemcode
        bladders.qty = qtyupd
        bladders.stored = stored
        bladders.updatedate = Date.now()
        await bladders.save()
        req.flash('success_msg', 'Tiedot päivitetty')
        res.redirect('/dash/' + req.params.id)
    } catch {
        res.send('Update Bladder' + req.params.id)
    }
    
})

// Delete Bladder

router.delete('/:id', async (req, res) => {
    let bladders
    bladders = await Bladders.findById(req.params.id)
    try {
        
        const newHistory = new History({
            bladder: bladders.bladder,
            qty: bladders.qty,
            createdate: bladders.createdate,
            destroydate: Date.now()
        })

        await newHistory.save()
        await bladders.remove()
        req.flash('success_msg', 'Paketti poistettu ja määrät siirretty historia dataan')
        res.redirect('/dash')
        console.log(newHistory)
    } catch {
        res.send('Update Bladder' + req.params.id)
    }
    
})
module.exports = router
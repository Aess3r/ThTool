const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')
const Stored = require('../models/Storecontrol')
const Cause = require('../models/Cause')

// Setup Page
router.get('/',ensureAuthenticated, async (req, res) => {
    try {
        const storedb = await Stored.find({})
        res.render('setup/setup', {
            name: req.user.name,
            userlvl: req.user.userlvl,
            storedb: storedb
        })
        
    } catch {

    }
})  

// StoreControl Page
router.get('/storectr',ensureAuthenticated, async (req, res) => {
    
    try {
        const storedb = await Stored.find({})
        res.render('setup/stored', {
            name: req.user.name,
            userlvl: req.user.userlvl,
            storedb: storedb
        })
        
    } catch {

    }
})   




// Create New Store Location
router.post('/', ensureAuthenticated, async (req, res) => {

    let { paikka, zone }  = req.body
    let errors = []
    const storedb = await Stored.find({})
    if(!paikka || !zone) {
        errors.push({ msg: 'Täytä molemmat kentät'})       
        }
    
    if(errors.length > 0) {
            res.render('setup/stored', {
                errors,
                name: req.user.name,
                userlvl: req.user.userlvl,
                storedb: storedb
            })
    } else {
        Stored.findOne({ stored: paikka })
        .then(stored => {
            if(stored) {

                errors.push({ msg: 'Käytössä'})

                res.render('setup/stored', {
                    errors,
                    name: req.user.name,
                    userlvl: req.user.userlvl,
                    storedb: storedb
                })

                } else {
                
                    const newStore = new Stored({
                        stored: paikka.toUpperCase(),
                        zone
                    }) 
              
                    newStore.save()
                    res.redirect('/setup/storectr')
                 }
        })
    }
})

// Edit Store Control

router.get('/storectr/:id',ensureAuthenticated, async (req, res) => {
    
    let stored = await Stored.find({})
    let editstore = await Stored.findById(req.params.id)


    try {
        
        res.render('setup/editstore', {
            name: req.user.name,
            userlvl: req.user.userlvl,
            stored: stored,
            editstore: editstore
        })

        
    } catch {

    }
})

// Edit Store Control

router.put('/storectr/:id/upd',ensureAuthenticated, async (req, res) => {
    
    let stored
    let { paikka , zone } = req.body

    try {
        stored = await Stored.findById(req.params.id)
        stored.stored = paikka
        stored.zone = zone
        await stored.save()
        req.flash('success_msg', 'Tiedot muutettu')
        res.redirect('/setup/storectr/' + req.params.id)

        
    } catch {

    }
})

// Delete Store

router.delete('/:id', async (req, res) => {
    
    stored = await Stored.findById(req.params.id)
    try {
       await stored.remove()
       req.flash('success_msg', 'Paikka poistettu')
       res.redirect('/setup/storectr')
       console.log(stored)
    } catch {
        res.send('Update Bladder' + req.params.id)
    }
    
})
// CauseControl Page
router.get('/causectr',ensureAuthenticated, async (req, res) => {
    let causedb = await Cause.find({})
    try {

        res.render('setup/cause', {
            name: req.user.name,
            userlvl: req.user.userlvl,
            causedb: causedb
        })
        
    } catch {

    }
})  

// Create New Cause
router.post('/causectr', ensureAuthenticated, async (req, res) => {

    const { caused }  = req.body
    let errors = []
    let causedb = await Cause.find({})
    
    if(!caused) {
        errors.push({ msg: 'Syy puuttuu'})       
        }

    
    if(errors.length > 0) {
            res.render('setup/cause', {
                errors,
                name: req.user.name,
                userlvl: req.user.userlvl,
                causedb: causedb
            })

    } else {
        Cause.findOne({ cause: caused })
        .then(cause => {
            if(cause) {
                errors.push({ msg: 'Käytössä'})
                res.render('setup/cause', {
                    errors,
                    name: req.user.name,
                    userlvl: req.user.userlvl,
                    causedb: causedb
                })

                } else {
                    const newCause = new Cause({
                        cause: caused
                    }) 
              
                    newCause.save()
                    res.redirect('/setup/causectr')
                    console.log(newCause)
                 }
        })
    }
})
module.exports = router
const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')
const Stored = require('../models/Storecontrol')

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

    const { stored, zone }  = req.body
    let errors = []
    const storedb = await Stored.find({})
    if(!stored || !zone) {
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
        Stored.findOne({ store: stored })
        .then(store => {
            if(store) {
                errors.push({ msg: 'Käytössä'})
                res.render('setup/stored', {
                    errors,
                    name: req.user.name,
                    userlvl: req.user.userlvl,
                    storedb: storedb
                })

                } else {
                    const newStore = new Stored({
                        stored,
                        zone
                    }) 
              
                    newStore.save()
                    res.redirect('/setup')
                 }
        })
    }
})



module.exports = router
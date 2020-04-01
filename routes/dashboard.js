const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')

// Dashboard
router.get('/',ensureAuthenticated, (req, res) => 
res.render('dashboard/dash', {
    name: req.user.name,
    userlvl: req.user.userlvl
}))



module.exports = router
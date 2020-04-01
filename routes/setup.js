const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')

// Setup Page
router.get('/',ensureAuthenticated, (req, res) => 
res.render('setup/setup', {
    name: req.user.name,
    userlvl: req.user.userlvl
}))

module.exports = router
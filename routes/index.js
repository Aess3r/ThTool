const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')



// Welcome Page
router.get('/THtool', (req, res) => 
res.render('welcome',   {  
}))







module.exports = router


const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')
const Task = require('../models/task')


// Welcome Page
router.get('/Mykanban', (req, res) => 
res.render('welcome',   {  
}))







module.exports = router


const express = require('express')
const router = express.Router()
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






module.exports = router
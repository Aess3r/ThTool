const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const methodOverride = require('method-override')

const app = express()

// Passport config
require('./config/passport')(passport)

// DB Config
const db = require('./config/keys').MongoURI

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Mongo DB connected'))
    .catch(err => console.log(err))

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}))

// Method-override
app.use(methodOverride('_method'))

// Bodyparser
app.use(express.urlencoded({ extended: false}))

// Express Session
app.use(session({
    cookie: {maxAge: 6000000},
    secret: 'liisaihmemaassa',
    resave: false,
    saveUninitialized: true
}))
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())



// Connect Flash
app.use(flash())

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})



// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/admin', require('./routes/admin'))
app.use('/setup', require('./routes/setup'))
app.use('/dash', require('./routes/dashboard'))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Servu pystyssä ${PORT}`))
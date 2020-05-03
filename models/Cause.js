const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CauseSchema = new Schema({
    cause: {
        type: String,
        required: false
    }
})

const Cause = mongoose.model('Cause', CauseSchema)

module.exports = Cause
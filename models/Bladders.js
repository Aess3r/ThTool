const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BladderSchema = new Schema({
    itemcode: {
        type: String
    },
    bladder: {
        type: String,
        required:true
    },
    qty: {
        type: String,
        required: false
    },
    line: {
        type: String,
        required: true
    },
    createdate: {
        type: Date,
        default: Date.now
    },
    unique: {
        type: String,
        required: false
    },
    stored: {
        type: String,
        required: true
    },
    updatedate: {
        type: Date,
        default: Date.now
    },
    userid: {
        type: String
    }
})

const Bladders = mongoose.model('Bladders', BladderSchema)

module.exports = Bladders
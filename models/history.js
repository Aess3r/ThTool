const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HistorySchema = new Schema({
    bladder: {
        type: String,
        required:true
    },
    qty: {
        type: String,
        required: true
    },
    createdate: {
        type: Date
    },
    destroydate: {
        type: Date
    },
    cause: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: false
    }


})

const History = mongoose.model('History', HistorySchema)

module.exports = History
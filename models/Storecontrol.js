const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StorecontrolSchema = new Schema({
    stored: {
        type: String,
        required: true
    },
    zone: {
        type: String,
        required: true
    }

})

const Storecontrol = mongoose.model('Storecontrol', StorecontrolSchema)

module.exports = Storecontrol
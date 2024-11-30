const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Cursus = new Schema({
    title: {type: String, required: true},
    theme: [{ type: Schema.Types.ObjectId, ref: 'Theme' }],
    price: { type: Number, required: true}
})

module.exports = mongoose.model('Cursus', Cursus)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Cursus = new Schema({
    title: {type: String, required: true},
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    price: { type: Number, required: true}
})

module.exports = mongoose.model('Cursus', Cursus)
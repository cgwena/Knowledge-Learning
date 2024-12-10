const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Lesson = new Schema({
    title: {type : String, required: true},
    text: { type: String, required: true},
    video_url: { type : String},
    price: { type : Number, required: true},
    cursus: [{ type: Schema.Types.ObjectId, ref: 'Cursus' }],
})

module.exports = mongoose.model('Lesson', Lesson)
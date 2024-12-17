const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Theme = new Schema({
  title: { type: String, required: true },
  cursus: [{ type: Schema.Types.ObjectId, ref: 'Cursus' }],
});

module.exports = mongoose.model("Theme", Theme);

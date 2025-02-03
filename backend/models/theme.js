import mongoose from 'mongoose';

const { Schema } = mongoose;

const ThemeSchema = new Schema({
  title: { type: String, required: true },
  cursus: [{ type: Schema.Types.ObjectId, ref: 'Cursus' }],
});

export default mongoose.model('Theme', ThemeSchema);

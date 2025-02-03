import mongoose from 'mongoose';

const { Schema } = mongoose;

const CursusSchema = new Schema({
  title: { type: String, required: true },
  lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  price: { type: Number, required: true }
});

export default mongoose.model('Cursus', CursusSchema);

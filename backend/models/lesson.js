import mongoose from 'mongoose';

const { Schema } = mongoose;

const LessonSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  video_url: { type: String },
  price: { type: Number, required: true }
});

export default mongoose.model('Lesson', LessonSchema);

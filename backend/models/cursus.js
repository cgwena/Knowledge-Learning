import mongoose from 'mongoose';

const { Schema } = mongoose;

const CursusSchema = new Schema(
  {
    title: { type: String, required: true },
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    price: { type: Number, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    updated_by: { type: Schema.Types.ObjectId, ref: 'User' } 
  },
  { timestamps: true }
);

export default mongoose.model('Cursus', CursusSchema);

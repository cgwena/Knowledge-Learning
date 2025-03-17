import mongoose from "mongoose";

const { Schema } = mongoose;

const LessonSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    video_url: { type: String },
    price: { type: Number, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", LessonSchema);

import mongoose from "mongoose";

const { Schema } = mongoose;

const ThemeSchema = new Schema(
  {
    title: { type: String, required: true },
    cursus: [{ type: Schema.Types.ObjectId, ref: "Cursus" }],
    created_by: { type: Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Theme", ThemeSchema);

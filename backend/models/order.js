import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        type: {
          type: String,
          enum: ["lesson", "cursus"], // Le type d'achat : leçon ou cursus
          required: true,
        },
        itemId: { type: Schema.Types.ObjectId, required: true }, // ID de la leçon ou du cursus
        // price: { type: Number, required: true }, // Prix de l'item
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    created_by: { type: Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);

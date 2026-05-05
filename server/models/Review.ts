import mongoose from "mongoose";
import { comment } from "postcss";

const reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Review ||
  mongoose.model("Review", reviewSchema);

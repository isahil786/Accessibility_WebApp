import { Router } from "express";
import mongoose from "mongoose";
import { comment } from "postcss";

const Review = mongoose.model(
  "Review",
  new mongoose.Schema({
    name: String,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now },
  })
);

const router = Router();

router.post("/", async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (_req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
});

export default router;

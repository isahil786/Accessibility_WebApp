import { Router } from "express";
import mongoose from "mongoose";

const Feedback = mongoose.model(
  "Feedback",
  new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: { type: Date, default: Date.now },
  })
);

const router = Router();

router.post("/", async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (_req, res) => {
  const feedbacks = await Feedback.find().sort({ createdAt: -1 });
  res.json(feedbacks);
});

export default router;

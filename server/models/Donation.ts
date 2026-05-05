import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  name: String,
  email: String,
  amount: Number,
  method: String,
  createdAt: { type: Date, default: Date.now },
});

// ✅ Prevent re-compilation on hot reload
export default mongoose.models.Donation ||
  mongoose.model("Donation", donationSchema);

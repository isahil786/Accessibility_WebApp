import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  issue: String,
  severity: String,
  location: {
    lat: Number,
    lng: Number,
  },
  votes: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
});

export default mongoose.model("Report", reportSchema);
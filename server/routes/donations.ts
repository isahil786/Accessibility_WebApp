import { Router } from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

const donationSchema = new mongoose.Schema({
  name: String,
  email: String,
  amount: Number,
  method: String,
  createdAt: { type: Date, default: Date.now },
});

const Donation =
  mongoose.models.Donation || mongoose.model("Donation", donationSchema);

const router = Router();

// ✅ Create transporter ONCE (outside route)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "thedraculaude@gmail.com",
    pass: "qemuvguxhdwiegup",
  },
});

// ✅ POST donation + send email
router.post("/", async (req, res) => {
  try {
    console.log("🚀 API HIT");

    const donation = new Donation(req.body);
    await donation.save();

    console.log("💾 Saved:", donation);

    if (donation.email) {
      try {
        console.log("📧 Sending email...");

        const info = await transporter.sendMail({
          from: '"Helping Hands" <thedraculaude@gmail.com>',
          to: donation.email,
          subject: "🙏 Thank You for Your Donation!",
          html: `
            <h2>Dear ${donation.name || "Donor"},</h2>
            <p>Thank you for your generous donation of <b>₹${donation.amount}</b> via <b>${donation.method.toUpperCase()}</b>.</p>
            <p>Your contribution helps us continue our mission to support special children with therapy, education, and care.</p>
            <p>Warm regards,<br/>Helping Hands Team</p>
          `,
        });

        console.log("✅ EMAIL SENT:", info.response);
      } catch (err) {
        console.error("❌ EMAIL ERROR:", err);
      }
    }

    res.status(201).json(donation);

  } catch (err) {
    console.error("❌ ROUTE ERROR:", err);
    res.status(400).json({ error: err.message });
  }
});

// ✅ GET all donations
router.get("/", async (_req, res) => {
  const donations = await Donation.find().sort({ createdAt: -1 });
  res.json(donations);
});

export default router;
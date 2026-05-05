import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import User from "./models/User";
import { Server } from "socket.io";
import donateRoutes from "./routes/donations";
import Donation from "./models/Donation";
import reportRoutes from "./routes/report";
import { handleDemo } from "./routes/demo";

// ✅ DECLARE OUTSIDE
let io: Server;

// 🔥 EXPORT HERE (TOP LEVEL)
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/report", reportRoutes);

  // MongoDB
  const mongoUri =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/asd";

  mongoose
    .connect(mongoUri, { dbName: "asd" })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) =>
      console.error("❌ MongoDB connection error:", err)
    );

  // Routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "ping" });
  });

  app.get("/api/demo", handleDemo);

  return app;
}

// 🚀 START SERVER
export function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 🔥 Create server FIRST
  const server = http.createServer(app);

  // 🔥 Initialize IO BEFORE routes
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
  });

  app.use("/api/report", reportRoutes);
  app.use("/api/donation", donateRoutes);

 app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "User registered", user });
  } catch (err: any) {
    console.error("REGISTER ERROR:", err); // 🔥 IMPORTANT

    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(500).json({ error: "Registration failed" });
  }
});

  app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.password !== password)
      return res.status(400).json({ error: "Invalid password" });

    res.status(200).json({ user });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});

  app.post("/api/donation", async (req, res) => {
  try {
    const { name, email, amount, method } = req.body;

    console.log("📥 Donation received:", req.body);

    // ✅ USE MONGOOSE MODEL
    const newDonation = new Donation({
      name,
      email,
      amount,
      method,
    });

    // ✅ SAVE TO DB
    await newDonation.save();

    res.status(200).json({
      message: "Donation saved successfully",
      donation: newDonation,
    });

  } catch (err) {
    console.error("❌ Donation error:", err);
    res.status(500).json({ error: "Failed to save donation" });
  }
});
  // MongoDB
  const mongoUri =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/asd";

  mongoose
    .connect(mongoUri, { dbName: "asd" })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) =>
      console.error("❌ MongoDB connection error:", err)
    );

  app.get("/api/ping", (_req, res) => {
    res.json({ message: "ping" });
  });

  app.get("/api/demo", handleDemo);

  server.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
  });
}

startServer(); // 🔥 THIS IS MISSING
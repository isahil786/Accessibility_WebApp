import express from "express";
import {
  createReport,
  voteReport,
  getReports,
} from "../controllers/reportController";

const router = express.Router();
router.get("/", getReports);
router.post("/", createReport);

router.put("/:id/vote", voteReport); // 🔥 voting route

export default router;
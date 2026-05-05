import { getIO } from "../index";
import Report from "../models/Report";

export const createReport = async (req, res) => {
  try {
    const report = new Report({
      issue: req.body.issue,
      severity: getSeverity(req.body.issue),
      location: req.body.location,
    });

    await report.save(); // ✅ SAVES TO DATABASE

    getIO().emit("new-report", report);

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const voteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.votes += 1;

    if (report.votes >= 5) {
      report.verified = true;
    }

    await report.save(); // ✅ UPDATE IN DATABASE

    getIO().emit("vote-update", report);

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getSeverity = (text: string) => {
  text = text.toLowerCase();
    // ✅ handle NEGATIVE cases FIRST
  if (text.includes("no step") || text.includes("no stairs") || text.includes("no steep")) {
    return "LOW"; // or even "NONE"
  }

  if (
    text.includes("no ramp") ||
    text.includes("wheelchair") ||
    text.includes("cannot enter")
  ) {
    return "HIGH";
  }

  if (
    text.includes("stairs") ||
    text.includes("no lift") ||
    text.includes("steep")
  ) {
    return "MEDIUM";
  }

  if (
    text.includes("step") ||
    text.includes("narrow") ||
    text.includes("small obstacle")
  ) {
    return "LOW";
  }

  return "LOW";
};
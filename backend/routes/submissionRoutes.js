import express from "express";
import { getRecentSubmissions, getUpcomingDeadlines } from "../controllers/submissionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/recent", protect(["student"]), getRecentSubmissions);
router.get("/upcoming", protect(["student"]), getUpcomingDeadlines);

export default router;

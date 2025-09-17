import express from "express";
import {
  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
  getUpcomingDeadlines,
   getRecentSubmissions,
} from "../controllers/assignmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/recent", protect(["student"]), getRecentSubmissions);
router.post("/", protect(["teacher"]), createAssignment);
router.get("/", protect(["teacher", "student"]), getAssignments);
router.put("/:id", protect(["teacher"]), updateAssignment);
router.delete("/:id", protect(["teacher"]), deleteAssignment);
router.get("/upcoming", protect(["student"]), getUpcomingDeadlines);

export default router;

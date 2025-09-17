// models/Assignment.js
import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  deadline: String,
  subject: String,
  maxScore: Number,
  attachments: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // <--- new
});

export default mongoose.model("Assignment", assignmentSchema);

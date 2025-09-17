import Assignment from "../models/Assignment.js";

// Create assignment (teacher only)
export const createAssignment = async (req, res) => {
  try {
    const { title, description, deadline, subject, maxScore, attachments, assignedTo } = req.body;

    const assignment = new Assignment({
      title,
      description,
      deadline,
      subject,
      maxScore,
      attachments,
      createdBy: req.user.id,
      assignedTo, // <--- assign students
    });

    await assignment.save();
    res.json({ message: "Assignment created", assignment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get all assignments (teacher & student)
export const getAssignments = async (req, res) => {
  try {
    let assignments;
    if (req.user.role === "teacher") {
      // Teacher sees only their own assignments
      assignments = await Assignment.find({ createdBy: req.user.id }).populate("createdBy", "name email");
    } else {
      // Student sees all assignments from all teachers
      assignments = await Assignment.find().populate("createdBy", "name email");
    }
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update assignment (only teacher who created it)
export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    if (assignment.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    const { title, description, deadline, subject } = req.body;
    assignment.title = title ?? assignment.title;
    assignment.description = description ?? assignment.description;
    assignment.deadline = deadline ?? assignment.deadline;
    assignment.subject = subject ?? assignment.subject;

    await assignment.save();
    res.json({ message: "Assignment updated", assignment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete assignment (only teacher who created it)
export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    if (assignment.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    await assignment.remove();
    res.json({ message: "Assignment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getUpcomingDeadlines = async (req, res) => {
  try {
    const now = new Date();
    const oneWeekLater = new Date();
    oneWeekLater.setDate(now.getDate() + 7);

    const assignments = await Assignment.find({
      deadline: { $gte: now, $lte: oneWeekLater }
    }).populate("createdBy", "name email");

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get recent assignments (last 5 created)
export const getRecentSubmissions = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get upcoming deadlines (future assignments)

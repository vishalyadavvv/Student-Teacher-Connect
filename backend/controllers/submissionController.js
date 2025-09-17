import Assignment from "../models/Assignment.js";

// Recent submissions (example: last 5 assignments)
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

// Upcoming deadlines (assignments due in future)
export const getUpcomingDeadlines = async (req, res) => {
  try {
    const today = new Date();
    const assignments = await Assignment.find({ deadline: { $gte: today } })
      .sort({ deadline: 1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Auth
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);

// Assignments CRUD
export const createAssignment = (data, token) =>
  API.post("/assignments", data, { headers: { Authorization: `Bearer ${token}` } });

export const getAssignments = (token) =>
  API.get("/assignments", { headers: { Authorization: `Bearer ${token}` } });

export const updateAssignment = (id, data, token) =>
  API.put(`/assignments/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteAssignment = (id, token) =>
  API.delete(`/assignments/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// Recent Submissions
export const getRecentSubmissions = (token) =>
  API.get("/submissions/recent", { headers: { Authorization: `Bearer ${token}` } });

// Upcoming Deadlines
export const getUpcomingDeadlines = (token) =>
  API.get("/assignments/upcoming", { headers: { Authorization: `Bearer ${token}` } });


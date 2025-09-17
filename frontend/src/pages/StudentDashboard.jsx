import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import AssignmentCard from "../components/AssignmentCard";
import { getAssignments, getUpcomingDeadlines, getRecentSubmissions } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });

  useEffect(() => {
    if (!token) return;

    setIsLoading(true);

    Promise.all([
      getAssignments(token),
      getUpcomingDeadlines(token),
      getRecentSubmissions(token)
    ])
      .then(([assignmentsRes, deadlinesRes, submissionsRes]) => {
        const allAssignments = assignmentsRes?.data || [];
        setAssignments(allAssignments);
        setFilteredAssignments(allAssignments);
        console.log("Assignments from API:", allAssignments);

        setUpcomingDeadlines(deadlinesRes?.data || []);
        setRecentSubmissions(submissionsRes?.data || []);

        // Calculate stats
        const now = new Date();
        const completed = (submissionsRes?.data || []).filter(sub => sub.status === "graded").length;

        const overdue = allAssignments.filter(
          a =>
            a.deadline &&
            new Date(a.deadline) < now &&
            !(submissionsRes?.data || []).some(
              sub => sub.assignmentId && sub.assignmentId.toString() === a._id?.toString()
            )
        ).length;

        const pending = allAssignments.length - completed - overdue;

        setStats({
          total: allAssignments.length,
          completed,
          pending,
          overdue
        });
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [token]);

  const handleFilter = filterType => {
    setActiveFilter(filterType);
    const now = new Date();

    switch (filterType) {
      case "completed":
        setFilteredAssignments(
          assignments.filter(a =>
            recentSubmissions.some(
              sub =>
                sub.assignmentId &&
                a._id &&
                sub.assignmentId.toString() === a._id.toString() &&
                sub.status === "graded"
            )
          )
        );
        break;
      case "pending":
        setFilteredAssignments(
          assignments.filter(
            a =>
              !recentSubmissions.some(
                sub => sub.assignmentId && a._id && sub.assignmentId.toString() === a._id.toString()
              ) && new Date(a.deadline) >= now
          )
        );
        break;
      case "overdue":
        setFilteredAssignments(
          assignments.filter(
            a =>
              !recentSubmissions.some(
                sub => sub.assignmentId && a._id && sub.assignmentId.toString() === a._id.toString()
              ) && new Date(a.deadline) < now
          )
        );
        break;
      case "upcoming":
        setFilteredAssignments(
          assignments.filter(
            a =>
              a.deadline &&
              new Date(a.deadline) > now &&
              new Date(a.deadline) < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
          )
        );
        break;
      default:
        setFilteredAssignments(assignments);
    }
  };

  const searchAssignments = query => {
    if (!query) {
      setFilteredAssignments(assignments);
      return;
    }

    const filtered = assignments.filter(
      a =>
        a.title?.toLowerCase().includes(query.toLowerCase()) ||
        a.description?.toLowerCase().includes(query.toLowerCase()) ||
        a.subject?.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredAssignments(filtered);
  };

  if (isLoading) {
    return (
      <div className="flex">
        <Sidebar role="student" />
        <div className="p-6 flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Sidebar role="student" />
      <div className="p-6 flex-1">
        {/* Header Section */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-800 dark:text-white mb-2"
          >
            Welcome back, {user?.name || "Student"}!
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what you need to focus on today.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Assignments" value={stats.total} color="blue" />
          <StatCard title="Completed" value={stats.completed} color="green" />
          <StatCard title="Pending" value={stats.pending} color="yellow" />
          <StatCard title="Overdue" value={stats.overdue} color="red" />
        </div>

        {/* Filters and Assignments */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <FilterSearch
              activeFilter={activeFilter}
              handleFilter={handleFilter}
              searchAssignments={searchAssignments}
            />

            <AssignmentsList
              assignments={filteredAssignments}
              recentSubmissions={recentSubmissions}
              activeFilter={activeFilter}
            />
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <UpcomingDeadlines deadlines={upcomingDeadlines} />
            <RecentSubmissions submissions={recentSubmissions} assignments={assignments} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Components --- */

const StatCard = ({ title, value, color }) => {
  const borderColors = {
    blue: "border-blue-500",
    green: "border-green-500",
    yellow: "border-yellow-500",
    red: "border-red-500"
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border-l-4 ${borderColors[color]}`}
    >
      <h3 className="text-gray-500 dark:text-gray-400 text-sm">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
    </motion.div>
  );
};

const FilterSearch = ({ activeFilter, handleFilter, searchAssignments }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md mb-6">
    <div className="flex flex-col md:flex-row gap-4 justify-between">
      <div className="flex flex-wrap gap-2">
        {["all", "pending", "completed", "overdue", "upcoming"].map(filter => (
          <button
            key={filter}
            onClick={() => handleFilter(filter)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeFilter === filter
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search assignments..."
          onChange={e => searchAssignments(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  </div>
);

const AssignmentsList = ({ assignments, recentSubmissions, activeFilter }) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
      {activeFilter === "all"
        ? "All Assignments"
        : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Assignments`}
      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({assignments.length})</span>
    </h2>

    {assignments.length > 0 ? (
      <div className="space-y-4">
        {assignments.map(a => (
          <AssignmentCard
            key={a._id}
            assignment={a}
            isOwner={false}
            submission={recentSubmissions.find(
              sub =>
                sub.assignmentId && a._id &&
                sub.assignmentId.toString() === a._id.toString()
            )}
          />
        ))}
      </div>
    ) : (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No assignments found</h3>
        <p className="text-gray-500 dark:text-gray-400">
          {activeFilter === "all"
            ? "You don't have any assignments yet."
            : `You don't have any ${activeFilter} assignments.`}
        </p>
      </div>
    )}
  </div>
);

const UpcomingDeadlines = ({ deadlines }) => {
  const now = new Date();
  const upcoming = (deadlines || [])
    .filter(a => a.deadline && new Date(a.deadline) >= now)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
      <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Upcoming Deadlines
      </h3>

      {upcoming.length > 0 ? (
        <div className="space-y-3">
          {upcoming.map(a => (
            <div key={a._id} className="flex items-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-sm mr-3">
                {new Date(a.deadline).getDate()}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate">{a.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(a.deadline).toLocaleDateString()} • {a.subject}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming deadlines</p>
      )}
    </div>
  );
};

const RecentSubmissions = ({ submissions, assignments }) => {
  const recent = (submissions || [])
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
      <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Recent Submissions
      </h3>

      {recent.length > 0 ? (
        <div className="space-y-3">
          {recent.map(sub => {
            const assignment = (assignments || []).find(
              a => a._id && sub.assignmentId && a._id.toString() === sub.assignmentId.toString()
            );
            return (
              <div key={sub._id} className="flex items-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mr-3 ${
                  sub.status === "graded"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                }`}>
                  {sub.status === "graded" ? sub.grade : "✓"}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate">
                    {assignment?.title || "Unknown Assignment"}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {sub.status === "graded" ? `Graded: ${sub.grade}` : "Submitted"} • {new Date(sub.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No recent submissions</p>
      )}
    </div>
  );
};

import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../components/Sidebar";
import AssignmentCard from "../components/AssignmentCard";
import { createAssignment, getAssignments, updateAssignment, deleteAssignment } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { FiPlus, FiSearch, FiFilter, FiCalendar, FiBook, FiRefreshCw, FiX } from "react-icons/fi";
// import { FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast"; // if you use react-hot-toast


import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

export default function TeacherDashboard() {
  const { user } = useContext(AuthContext);
  const token = user?.token;
 const [form, setForm] = useState({ 
  title: "", 
  description: "", 
  deadline: "", 
  subject: "", 
  maxScore: 100,
  attachments: [],
  assignedTo: []  // new field
});

  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [editing, setEditing] = useState(null);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [attachmentInput, setAttachmentInput] = useState("");

  // Fetch assignments
  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const res = await getAssignments(token);
      setAssignments(res.data);
      setFilteredAssignments(res.data);
      
      // Extract unique subjects for filter
      const uniqueSubjects = [...new Set(res.data.map(a => a.subject))];
      setSubjects(uniqueSubjects);
    } catch (err) { 
      console.error(err);
      toast.error("Failed to load assignments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAssignments();
  }, [token]);

  // Filter assignments based on search and filters
  useEffect(() => {
    let result = assignments;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(assignment => 
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply subject filter
    if (filterSubject !== "all") {
      result = result.filter(assignment => assignment.subject === filterSubject);
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      const now = new Date();
      if (filterStatus === "active") {
        result = result.filter(assignment => new Date(assignment.deadline) > now);
      } else if (filterStatus === "expired") {
        result = result.filter(assignment => new Date(assignment.deadline) <= now);
      }
    }
    
    setFilteredAssignments(result);
  }, [assignments, searchTerm, filterSubject, filterStatus]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.deadline || !form.subject) {
      toast.error("Please fill in required fields (Title, Deadline, Subject)");
      return;
    }

    try {
      if (editing) {
        await updateAssignment(editing._id, form, token);
        toast.success("Assignment updated successfully");
        setEditing(null);
      } else {
        await createAssignment(form, token);
        toast.success("Assignment created successfully");
      }
      setForm({ title: "", description: "", deadline: "", subject: "", maxScore: 100, attachments: [] });
      setIsFormExpanded(false);
      fetchAssignments();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (assignment) => {
    setEditing(assignment);
    setForm({
      title: assignment.title,
      description: assignment.description,
      deadline: assignment.deadline.split('T')[0],
      subject: assignment.subject,
      maxScore: assignment.maxScore || 100,
      attachments: assignment.attachments || []
    });
    setIsFormExpanded(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await deleteAssignment(id, token);
      toast.success("Assignment deleted successfully");
      fetchAssignments();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ title: "", description: "", deadline: "", subject: "", maxScore: 100, attachments: [] });
    setIsFormExpanded(false);
  };

  const addAttachment = () => {
    if (attachmentInput.trim()) {
      setForm({
        ...form,
        attachments: [...form.attachments, attachmentInput.trim()]
      });
      setAttachmentInput("");
    }
  };

  const removeAttachment = (index) => {
    const newAttachments = [...form.attachments];
    newAttachments.splice(index, 1);
    setForm({ ...form, attachments: newAttachments });
  };

  const toggleForm = () => {
    setIsFormExpanded(!isFormExpanded);
    if (editing && !isFormExpanded) {
      cancelEdit();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar role="teacher" />
      
      <div className="p-6 flex-1 lg:ml-64">
        <ToastContainer position="top-right" autoClose={3000} />
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Teacher Dashboard</h1>
          <button 
            onClick={fetchAssignments}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search assignments..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <FiBook className="absolute left-3 top-3 text-gray-400" />
                <select 
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white appearance-none"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <FiFilter className="absolute left-3 top-3 text-gray-400" />
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredAssignments.length} of {assignments.length} assignments
            </p>
            <button 
              onClick={toggleForm}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FiPlus />
              {isFormExpanded ? "Close Form" : "New Assignment"}
            </button>
          </div>
        </div>

        {/* Create/Edit Assignment Form */}
        {isFormExpanded && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-6 animate-fade-in">
            <h3 className="font-semibold text-xl mb-4 text-gray-800 dark:text-white">
              {editing ? "Edit Assignment" : "Create New Assignment"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                <input 
                  name="title" 
                  value={form.title} 
                  onChange={handleChange} 
                  placeholder="Assignment title" 
                  className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject *</label>
                <input 
                  name="subject" 
                  value={form.subject} 
                  onChange={handleChange} 
                  placeholder="Subject" 
                  className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                placeholder="Assignment description and instructions..." 
                rows="4"
                className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline *</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="date" 
                    name="deadline" 
                    value={form.deadline} 
                    onChange={handleChange} 
                    className="w-full pl-10 border border-gray-200 dark:border-gray-700 p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Maximum Score</label>
                <input 
                  type="number" 
                  name="maxScore" 
                  value={form.maxScore} 
                  onChange={handleChange} 
                  min="0"
                  className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attachments (URLs)</label>
              <div className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  value={attachmentInput} 
                  onChange={(e) => setAttachmentInput(e.target.value)}
                  placeholder="Paste resource URL" 
                  className="flex-1 border border-gray-200 dark:border-gray-700 p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
                <button 
                  onClick={addAttachment}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Add
                </button>
              </div>
              
              {form.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.attachments.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      <span className="text-sm truncate max-w-xs">{url}</span>
                      <button onClick={() => removeAttachment(index)} className="text-red-500">
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleSubmit} 
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <FiPlus />
                {editing ? "Update Assignment" : "Create Assignment"}
              </button>
              {editing && (
                <button 
                  onClick={cancelEdit} 
                  className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {/* Assignments List */}
        <div>
          <h3 className="font-bold text-xl mb-4 text-gray-800 dark:text-white">Your Assignments</h3>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">
              <FiBook className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {assignments.length === 0 
                  ? "You haven't created any assignments yet." 
                  : "No assignments match your search criteria."}
              </p>
              {assignments.length === 0 && (
                <button 
                  onClick={toggleForm}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Your First Assignment
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAssignments.map(a => (
                <AssignmentCard
                  key={a._id}
                  assignment={a}
                  isOwner={a.createdBy?._id === user?.id || a.createdBy?._id === user?.userId || a.createdBy?._id === user?.id}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
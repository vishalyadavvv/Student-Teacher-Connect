// src/App.jsx
import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";

import Navbar from "./components/Navbar";
// import DarkModeToggle from "./components/DarkModeToggle";
import Sidebar from "./components/Sidebar";
import AssignmentCard from "./components/AssignmentCard";

import { motion } from "framer-motion";
import "./index.css";

export default function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <BrowserRouter>
      {/* Navbar and DarkMode toggle visible only when logged in */}
      {user && (
        <>
          <Navbar role={user.role} onLogout={logout} />
          {/* <DarkModeToggle /> */}
        </>
      )}

      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public routes */}
        <Route
          path="/login"
          element={
            user ? <Navigate to={`/${user.role}-dashboard`} /> : <Login />
          }
        />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/teacher-dashboard"
          element={
            user?.role === "teacher" ? (
              <TeacherDashboard token={user.token} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/student-dashboard"
          element={
            user?.role === "student" ? (
              <StudentDashboard token={user.token} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

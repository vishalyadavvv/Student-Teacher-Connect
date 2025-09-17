// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4">
      {/* Hero Section */}
      <section className="text-center py-16">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Student-Teacher Connect
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          A platform where teachers post assignments and students stay updated.
        </motion.p>
        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow transition"
          >
            Register
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded shadow text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="font-semibold text-xl mb-2">Post Assignments</h3>
            <p>Teachers can easily post assignments with deadlines and subjects.</p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded shadow text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="font-semibold text-xl mb-2">View Assignments</h3>
            <p>Students can view all assignments and filter by subject or deadline.</p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded shadow text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="font-semibold text-xl mb-2">Role-Based Access</h3>
            <p>Login as teacher or student to access your personalized dashboard.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// A simple dashboard component to render content for each route


// Inline SVG icons to replace react-icons
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);
const TasksIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2h-4.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 009.586 1H4a2 2 0 00-2 2zM6 9a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);
const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
    <path fillRule="evenodd" d="M4 5a2 2 0 012-2h2V1a1 1 0 112 0v2h2a2 2 0 012 2v15a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3.707 5.707a1 1 0 00-1.414-1.414l-2 2a1 1 0 000 1.414l2 2a1 1 0 001.414-1.414L6.414 12H10a1 1 0 100-2H6.414l1.293-1.293z" clipRule="evenodd" />
  </svg>
);
const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.414L14.586 5A2 2 0 0115 6.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm6 6a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);
const GraduationCapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
    <path d="M12.986 2.012l3.414 3.414c.78.78.78 2.047 0 2.828L12.986 11H16a2 2 0 012 2v3a2 2 0 01-2 2H4a2 2 0 01-2-2v-3a2 2 0 012-2h3.014L3.6 8.254a2 2 0 010-2.828L7.014 2.012a2 2 0 012.828 0l3.144 3.145c.77.77.77 2.015 0 2.784L12.986 11z" />
  </svg>
);
const TeacherIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM2 17a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1zM16 17a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1h-2a1 1 0 01-1-1v-1zM6 10a4 4 0 018 0v2a1 1 0 01-1 1H7a1 1 0 01-1-1v-2z" />
  </svg>
);
const HamburgerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// The main Sidebar component with updated styling
const Sidebar = ({ role, setRole }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768; // Changed to standard mobile breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false); // Expand sidebar on desktop by default
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar function
  const toggleSidebar = () => {
    if (isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Teacher navigation items
  const teacherLinks = [
    { to: "/teacher", label: "Dashboard", icon: "📊" },
    { to: "/assignments", label: "Assignments", icon: "📝" },
    { to: "/students", label: "Students", icon: "👨‍🎓" },
    { to: "/grades", label: "Grades", icon: "📊" },
    { to: "/resources", label: "Resources", icon: "📚" },
  ];

  // Student navigation items
  const studentLinks = [
    { to: "/student", label: "Dashboard", icon: "📊" },
    { to: "/assignments", label: "Assignments", icon: "📝" },
    { to: "/submissions", label: "My Submissions", icon: "📤" },
    { to: "/grades", label: "My Grades", icon: "📊" },
    { to: "/resources", label: "Resources", icon: "📚" },
  ];

  const links = role === "teacher" ? teacherLinks : studentLinks;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCollapsed(true)}
            className="fixed inset-0 bg-black z-40 lg:hidden"
          ></motion.div>
        )}
      </AnimatePresence>

      {/* Mobile toggle button (hamburger menu) */}
      {isMobile && isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-indigo-600 dark:bg-indigo-700 text-white shadow-xl transition-all lg:hidden hover:scale-105"
          aria-label="Open sidebar"
        >
          <HamburgerIcon />
        </button>
      )}

      <motion.aside
        initial={false}
        animate={{
          x: isMobile ? (isCollapsed ? '-100%' : '0%') : 0,
          width: isMobile ? '75%' : (isCollapsed ? 80 : 256),
        }}
        transition={{ duration: 0.3, type: "spring", damping: 25 }}
        className={`fixed lg:relative top-0 left-0 z-50 flex flex-col h-screen bg-gray-900 shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl font-bold text-white whitespace-nowrap"
              >
                {role === "teacher" ? "Teacher Portal" : "Student Portal"}
              </motion.h2>
            )}
          </AnimatePresence>
          {isMobile && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Close sidebar"
            >
              <CloseIcon />
            </button>
          )}
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-full text-white bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-300"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {links.map((link) => {
              const isActive = location.pathname === link.to;

              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`flex items-center p-3 rounded-xl transition-all duration-200 group relative
                      ${isActive
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    onClick={toggleSidebar}
                  >
                    <span className="text-xl flex-shrink-0 transition-transform duration-300 transform group-hover:scale-110">
                      {link.icon}
                    </span>

                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="font-medium whitespace-nowrap ml-4"
                        >
                          {link.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer with role toggle */}
        {/* <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => setRole(role === 'teacher' ? 'student' : 'teacher')}
            className="flex items-center justify-center w-full py-2 px-4 rounded-xl bg-gray-800 text-gray-300 hover:bg-indigo-600 hover:text-white transition-all duration-300"
          >
            <span className={`text-xl ${isCollapsed ? 'hidden' : ''}`}>Switch to {role === 'teacher' ? 'Student' : 'Teacher'}</span>
            <span className="text-xl ml-2">
              {role === 'teacher' ? <UserIcon /> : <TeacherIcon />}
            </span>
          </button>
        </div> */}
      </motion.aside>
    </>
  );
};



export default Sidebar;

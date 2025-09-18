# TASK#

This project is a full-stack assignment management system designed for teachers and students. It consists of a backend (Node.js/Express) and a frontend (React/Vite).

## Features
- User authentication (students & teachers)
- Assignment creation and management (teachers)
- Assignment submission (students)
- Dashboard views for both roles
- Secure API endpoints

## Project Structure
```
backend/      # Node.js/Express REST API
frontend/     # React/Vite web application
```

### Backend
- Handles authentication, assignment CRUD, and submission logic
- Organized into controllers, models, routes, and middleware
- Uses a database (see `backend/config/db.js`)

### Frontend
- Built with React and Vite
- Pages for login, registration, dashboards, and assignment views
- Context for authentication state
- Components for UI (Navbar, Sidebar, AssignmentCard)

## Getting Started

### Prerequisites
- Node.js & npm installed

### Backend Setup
1. Navigate to `backend/`
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure database in `backend/config/db.js`
4. Start the server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Usage
- Register as a teacher or student
- Teachers can create assignments
- Students can view and submit assignments
- Dashboards show relevant data for each role

## Folder Details
- `backend/controllers/` - API logic
- `backend/models/` - Mongoose models
- `backend/routes/` - API routes
- `frontend/src/pages/` - Main app pages
- `frontend/src/components/` - Reusable UI components
- `frontend/src/context/` - React context for auth
- `frontend/src/services/` - API service functions

## License
MIT


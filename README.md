# Mentor Management System

A comprehensive system for managing mentor activities, classroom feedback, and student doubts.

## Features

### Authentication

- Role-based authentication (Mentor and Recruitment Partner)
- Secure login with JWT tokens
- Protected routes based on user roles
- Secure cookie-based session management

### Mentor Dashboard

- Quick access to key features
- Navigation to Schedule, Doubts, and Feedback sections
- User profile display with avatar
- Responsive design for all screen sizes

### Daily Classroom Feedback

- Interactive calendar view for feedback submission
- Visual indicators for dates with submitted feedback
- Rating system for student engagement and performance
- Concern status tracking (Critical, General, Positive)
- Detailed feedback sections:
  - Positive Notes
  - Suggestions
  - Additional Feedback
- Feedback history view by date
- Real-time feedback submission

### Doubts Management

- Track student doubts by section and subject
- Resolution status tracking (Resolved, In Progress, Unresolved)
- Date-based organization
- Delete functionality for doubts
- Section and subject filtering

### Schedule Management

- View and manage class schedules
- Add new sessions
- Calendar integration

## Tech Stack

### Frontend

- React 19
- React Router v7
- Axios for API calls
- Date-fns for date manipulation
- CSS Modules for styling
- React Icons for UI elements
- PropTypes for type checking

### Backend

- Node.js
- Express.js
- PostgreSQL
- JWT for authentication
- Bcrypt for password hashing
- CORS enabled
- Environment variables support

## API Endpoints

### Authentication

- POST /auth/login - User login

### Feedback

- POST /feedback/ - Submit feedback
- GET /feedback/history - Get feedback history
- GET /feedback/dates - Get all feedback dates

### Doubts

- GET /doubts/ - Get all doubts
- POST /doubts/ - Create new doubt
- DELETE /doubts/:id - Delete doubt

### Options

- GET /options/sections - Get section options
- GET /options/subjects - Get subject options

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   # Frontend
   cd mentor-management-frontend
   npm install

   # Backend
   cd mentor-management-backend
   npm install
   ```

3. Set up environment variables:

   - Create .env file in backend directory
   - Add required environment variables:
     ```
     PORT=4000
     JWT_SECRET=your_jwt_secret
     DATABASE_URL=your_database_url
     ```

4. Start the development servers:

   ```bash
   # Frontend
   npm run dev

   # Backend
   npm run dev
   ```

## Project Structure

### Frontend

```
mentor-management-frontend/
├── src/
│   ├── assets/
│   │   └── styles/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   └── utils/
```

### Backend

```
mentor-management-backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
```

## Recent Updates

### Feedback System

- Added calendar integration for feedback submission
- Implemented feedback history view
- Added visual indicators for feedback dates
- Enhanced feedback form with ratings and status selection
- Added validation for future dates
- Improved error handling and loading states

### Doubts Management

- Added section and subject filtering
- Implemented resolution status tracking
- Added date-based organization
- Enhanced UI with responsive design
- Added delete functionality
- Improved form validation

### UI/UX Improvements

- Added loading states
- Implemented error handling
- Enhanced responsive design
- Added success/error notifications
- Improved navigation
- Added back buttons
- Enhanced form layouts

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Database Setup

### Prerequisites

- PostgreSQL (version 12 or higher)
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation Steps

1. **Install PostgreSQL**

   ```bash
   # For Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib

   # For macOS using Homebrew
   brew install postgresql
   ```

2. **Create Database**

   ```sql
   CREATE DATABASE mentor_management;
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the `mentor-management-backend` directory with the following content:

   ```env
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=mentor_management
   DB_PASSWORD=your_password
   DB_PORT=5432
   JWT_SECRET=your-secret-key
   JWT_EXPIRATION=48h
   ```

4. **Create Database Tables**
   Run the following SQL commands to create the required tables:

   ```sql
   -- Users table
   CREATE TABLE users_profile (
       id SERIAL PRIMARY KEY,
       email VARCHAR(255) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL,
       role VARCHAR(50) NOT NULL,
       first_name VARCHAR(100),
       last_name VARCHAR(100),
       phone_number VARCHAR(20),
       profile_picture TEXT,
       is_active BOOLEAN DEFAULT true,
       last_login TIMESTAMP,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Section options table
   CREATE TABLE section_options (
       section_id SERIAL PRIMARY KEY,
       section_name VARCHAR(100) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Subject options table
   CREATE TABLE subject_options (
       subject_id SERIAL PRIMARY KEY,
       subject_name VARCHAR(100) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Student doubts table
   CREATE TABLE student_doubts (
       doubt_id SERIAL PRIMARY KEY,
       description TEXT NOT NULL,
       section_id INTEGER REFERENCES section_options(section_id),
       subject_id INTEGER REFERENCES subject_options(subject_id),
       resolution_status VARCHAR(50) NOT NULL,
       mentor_id INTEGER REFERENCES users_profile(id),
       date DATE DEFAULT CURRENT_DATE,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Feedback table
   CREATE TABLE feedback (
       feedback_id SERIAL PRIMARY KEY,
       mentor_id INTEGER REFERENCES users_profile(id),
       section_id INTEGER REFERENCES section_options(section_id),
       date DATE NOT NULL,
       student_engagement INTEGER CHECK (student_engagement BETWEEN 1 AND 5),
       overall_performance INTEGER CHECK (overall_performance BETWEEN 1 AND 5),
       concern_status VARCHAR(50) NOT NULL,
       positive_notes TEXT,
       suggestions TEXT,
       additional_feedback TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

5. **Seed Sample Data**
   Run the following SQL commands to insert sample data:

   ```sql
   -- Insert sample sections
   INSERT INTO section_options (section_name) VALUES
   ('Section A'),
   ('Section B'),
   ('Section C');

   -- Insert sample subjects
   INSERT INTO subject_options (subject_name) VALUES
   ('Java'),
   ('Python'),
   ('JavaScript'),
   ('React'),
   ('Node.js');

   -- Insert sample user (password: admin123)
   INSERT INTO users_profile (email, password, role, first_name, last_name, phone_number, is_active)
   VALUES (
       'admin@example.com',
       '$2b$10$YourHashedPasswordHere', -- Use bcrypt to generate this
       'RP',
       'Admin',
       'User',
       '1234567890',
       true
   );

   -- Insert sample mentor (password: mentor123)
   INSERT INTO users_profile (email, password, role, first_name, last_name, phone_number, is_active)
   VALUES (
       'mentor@example.com',
       '$2b$10$YourHashedPasswordHere', -- Use bcrypt to generate this
       'mentor',
       'John',
       'Doe',
       '9876543210',
       true
   );
   ```

### Running the Application

1. **Install Dependencies**

   ```bash
   # In mentor-management-backend directory
   npm install

   # In mentor-management-frontend directory
   npm install
   ```

2. **Start the Backend Server**

   ```bash
   # In mentor-management-backend directory
   npm run dev
   ```

3. **Start the Frontend Development Server**
   ```bash
   # In mentor-management-frontend directory
   npm run dev
   ```

### Default Login Credentials

- Admin User:
  - Email: admin@example.com
  - Password: admin123
- Mentor User:
  - Email: mentor@example.com
  - Password: mentor123

### Notes

- Make sure PostgreSQL service is running before starting the application
- The backend server runs on port 4000 by default
- The frontend development server runs on port 5173 by default
- For production deployment, make sure to change the JWT_SECRET to a secure value
- Update the database credentials in the `.env` file according to your PostgreSQL setup

CREATE TABLE issues (
id SERIAL PRIMARY KEY,
type VARCHAR(20) NOT NULL, -- 'content', 'technical', 'general'
title VARCHAR(255) NOT NULL,
description TEXT,
status VARCHAR(30) NOT NULL, -- 'In Progress', 'Resolved', 'Not Completed'
date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
page_link TEXT, -- (Content only)
category VARCHAR(100), -- (Content only)
subject VARCHAR(100), -- (Content only)
issue_type VARCHAR(100), -- (Technical only)
student_id VARCHAR(50), -- (General only)
student_name VARCHAR(100), -- (General only)
reported_by INTEGER REFERENCES users_profile(id) -- Who reported
);

CREATE TABLE issue_media (
id SERIAL PRIMARY KEY,
issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
media_link TEXT NOT NULL,
media_type VARCHAR(20) -- 'image', 'video', etc. (optional)
);

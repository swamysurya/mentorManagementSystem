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

## Database Tables

### Core Tables

#### 1. **users_profile**

```sql
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
```

#### 2. **section_options**

```sql
CREATE TABLE section_options (
    section_id SERIAL PRIMARY KEY,
    section_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. **subject_options**

```sql
CREATE TABLE subject_options (
    subject_id SERIAL PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Feedback System Tables

#### 4. **feedback**

```sql
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

### Doubts Management Tables

#### 5. **student_doubts**

```sql
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
```

### Issues Management Tables

#### 6. **issues**

```sql
CREATE TABLE issues (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('content', 'technical', 'general')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
    page_link TEXT,
    category_id INTEGER NOT NULL REFERENCES category_options(category_id),
    subject_id INTEGER NOT NULL REFERENCES subject_options(subject_id),
    issue_type VARCHAR(50),
    student_id VARCHAR(50),
    student_name VARCHAR(100),
    reported_by INTEGER NOT NULL REFERENCES users_profile(id),
    date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 7. **issue_media**

```sql
CREATE TABLE issue_media (
    id SERIAL PRIMARY KEY,
    issue_id INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    media_link TEXT NOT NULL,
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video', 'other')),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 8. **issue_options**

```sql
CREATE TABLE issue_options (
    id SERIAL PRIMARY KEY,
    option_type VARCHAR(50) NOT NULL CHECK (option_type IN ('category', 'type', 'status')),
    option_value VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(option_type, option_value)
);
```

### Database Indexes

```sql
-- Performance indexes
CREATE INDEX idx_issues_reported_by ON issues(reported_by);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_type ON issues(type);
CREATE INDEX idx_issues_date_submitted ON issues(date_submitted);
CREATE INDEX idx_issue_media_issue_id ON issue_media(issue_id);
CREATE INDEX idx_issue_options_type ON issue_options(option_type);
CREATE INDEX idx_issue_options_active ON issue_options(is_active);
CREATE INDEX idx_feedback_mentor_date ON feedback(mentor_id, date);
CREATE INDEX idx_doubts_mentor_date ON student_doubts(mentor_id, date);
```

### Triggers

```sql
-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at columns
CREATE TRIGGER update_issues_updated_at
    BEFORE UPDATE ON issues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_issue_options_updated_at
    BEFORE UPDATE ON issue_options
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Sample Data for Issues System

```sql
-- Insert issue categories
INSERT INTO issue_options (option_type, option_value, display_name, sort_order) VALUES
('category', 'cheatsheet', 'Cheatsheet', 1),
('category', 'questions', 'Questions', 2),
('category', 'video_content', 'Video Content', 3),
('category', 'classroom_quiz', 'Classroom Quiz', 4),
('category', 'daily_quiz', 'Daily Quiz', 5),
('category', 'mcqs', 'MCQs', 6),
('category', 'docker', 'Docker', 7),
('category', 'database', 'Database', 8),
('category', 'api', 'API', 9),
('category', 'authentication', 'Authentication', 10),
('category', 'deployment', 'Deployment', 11),
('category', 'other', 'Other', 12);

-- Insert issue types
INSERT INTO issue_options (option_type, option_value, display_name, sort_order) VALUES
('type', 'error', 'Error', 1),
('type', 'bug', 'Bug', 2),
('type', 'clarification', 'Clarification', 3),
('type', 'feature_request', 'Feature Request', 4),
('type', 'improvement', 'Improvement', 5),
('type', 'other', 'Other', 6);

-- Insert statuses
INSERT INTO issue_options (option_type, option_value, display_name, sort_order) VALUES
('status', 'open', 'Open', 1),
('status', 'in_progress', 'In Progress', 2),
('status', 'resolved', 'Resolved', 3);
```

## Table Relationships

- `users_profile` → `issues` (reported_by)
- `users_profile` → `feedback` (mentor_id)
- `users_profile` → `student_doubts` (mentor_id)
- `section_options` → `feedback` (section_id)
- `section_options` → `student_doubts` (section_id)
- `subject_options` → `student_doubts` (subject_id)
- `issues` → `issue_media` (issue_id) - CASCADE DELETE

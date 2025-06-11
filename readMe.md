# 🎓 Mentor Management System

A full-stack web application for managing mentor-student interactions, built with React and Node.js. The system facilitates session scheduling, doubt resolution, and feedback management between mentors and students.

## ✨ Key Features

### 🔐 Authentication & Security
- **JWT-based Authentication**
  - Secure token generation and validation
  - Role-based access control (Admin/Mentor)
  - Token storage in localStorage
  - Automatic role-based redirects

- **Protected Routes**
  - Route guards for authenticated access
  - Role-specific navigation
  - Persistent sessions
  - Secure logout mechanism

### 📊 Dashboard Features
- **Schedule Management**
  - Daily session overview
  - Status tracking (Upcoming/Completed)
  - Session duration and timing
  - Quick session creation

- **Doubts Tracker**
  - Priority levels (High/Medium/Low)
  - Status management (Pending/In-Progress/Resolved)
  - Filtering capabilities
  - Quick response system

- **Feedback System**
  - Star rating implementation
  - Detailed feedback collection
  - Historical feedback tracking
  - Performance metrics

### 🎨 UI Components
- **Modern Navigation**
  - Responsive navbar
  - Profile information display
  - Role-based menu items
  - Smooth logout process

- **Interactive Dashboard**
  - Tabbed interface
  - Card-based layout
  - Status indicators
  - Action buttons

- **Notification System**
  - Toast notifications
  - Error handling
  - Success messages
  - Loading states

## 🛠️ Technical Stack

### Frontend (mentor-management-frontend)
- React 19.1.0
- React Router DOM 7.6.2
- Axios 1.9.0
- Vite 6.3.5
- ESLint 9.25.0

### Backend (mentor-management-backend)
- Node.js
- Express
- JWT for authentication
- CORS enabled

## 🚀 Getting Started

### Prerequisites
- Node.js v22.14.0 or higher
- pnpm package manager
- Modern web browser

### Installation

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd mentor-management-system
   ```

2. **Frontend Setup**
   ```bash
   cd mentor-management-frontend
   pnpm install
   pnpm dev
   ```
   Access at: http://localhost:5173

3. **Backend Setup**
   ```bash
   cd mentor-management-backend
   pnpm install
   pnpm dev
   ```
   Server runs at: http://localhost:4000

## 🔌 API Endpoints

### Authentication
- POST /api/login
  - Authenticates users
  - Returns: JWT token & user role
  - Handles: Invalid credentials

### Protected Routes
- GET /api/protected
  - Requires: Valid JWT token
  - Returns: User data
  - Handles: Authorization

## 💅 Styling Features
- Responsive design
- Modern UI components
- Interactive elements
- Form validation styles
- Loading animations
- Mobile-first approach

## 🔒 Security Measures
- JWT authentication
- Protected endpoints
- Secure password handling
- CORS configuration
- HTTP-only cookies (planned)

## 🛣️ Roadmap
- [ ] User registration system
- [ ] Password reset functionality
- [ ] Enhanced profile management
- [ ] Advanced session handling
- [ ] Real-time notifications
- [ ] File sharing capabilities
- [ ] Video call integration

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Submit a pull request

## 👥 Contributors
- Saketh
- Charan
- Reddy Raju
- Kushal
- Manikanta

## 📄 License
This project is licensed under the ISC License.

## 🐛 Known Issues
- Session timezone handling improvements needed
- Mobile view optimizations pending
- Real-time updates to be implemented

## 📞 Support
For support or queries:
- Create an issue in the repository
- Contact: [support-email]
- Join our developer community

## 🙏 Acknowledgments
- UI design inspiration from modern dashboards
- Open source community
- All contributors and testers

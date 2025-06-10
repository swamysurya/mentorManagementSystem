
## Features Implemented

### Authentication Flow
1. User enters credentials
2. Backend validates credentials
3. JWT token generated on successful login
4. Token stored in localStorage
5. Role-based redirect (Admin → /admin, Mentor → /mentor)

### Protected Routes
- Unauthorized users redirected to login
- Role-specific access control
- Persistent sessions using localStorage

### Error Handling
- Invalid credentials
- Network errors
- Server connection issues
- Timeout handling

## API Endpoints

### POST /api/login
- Authenticates users
- Returns JWT token and user role
- Handles invalid credentials

### GET /api/protected
- Example protected route
- Requires valid JWT token
- Returns user data from token

## Running the Project

### Frontend
```bash
cd mentor-management-frontend
pnpm install
pnpm run dev
```
Frontend runs on: http://localhost:5173

### Backend
```bash
cd mentor-management-backend
pnpm install
pnpm dev
```
Backend runs on: http://localhost:5000

## Environment Setup
- Node.js v22.14.0 or higher
- npm or pnpm package manager
- Modern web browser

## Styling
- Custom CSS with modern design principles
- Responsive layout
- Interactive elements with hover states
- Form validation feedback
- Loading states for better UX

## Security Features
- JWT-based authentication
- Protected API endpoints
- Secure password handling
- CORS configuration
- HTTP-only cookies (planned)

## Planned Features
- User registration
- Password reset functionality
- Profile management
- Session management
- Enhanced security measures

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
This project is licensed under the ISC License.

@contributors
### kushal kumar terli
### saketh kasyap
### meka charan
### manikanta swamy amjuri
### reddy raju
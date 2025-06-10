import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 4000;
const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

// Mock user data
const users = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'admin123',
    role: 'RP'  // RP = Recruitment Partner (Admin)
  },
  {
    id: 2,
    email: 'mentor@example.com',
    password: 'mentor123',
    role: 'mentor'
  }
];

app.use(cors());
app.use(express.json());

// Error messages
const ERROR_MESSAGES = {
  MISSING_FIELDS: 'Email and password are required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'No user found with this email',
  WRONG_PASSWORD: 'Incorrect password',
  SERVER_ERROR: 'An error occurred on the server',
  UNAUTHORIZED: 'You are not authorized to access this resource',
  TOKEN_EXPIRED: 'Your session has expired. Please login again',
  INVALID_TOKEN: 'Invalid authentication token',
  MISSING_TOKEN: 'Authentication token is required'
};

// Validation middleware
const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: ERROR_MESSAGES.MISSING_FIELDS
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: 'error',
      message: ERROR_MESSAGES.INVALID_EMAIL
    });
  }

  next();
};

// Login endpoint with improved error handling
app.post('/api/login', validateLoginInput, (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: ERROR_MESSAGES.USER_NOT_FOUND
      });
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).json({
        status: 'error',
        message: ERROR_MESSAGES.WRONG_PASSWORD
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send success response
    res.json({
      status: 'success',
      data: {
        token,
        role: user.role
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: ERROR_MESSAGES.SERVER_ERROR
    });
  }
});

// Protected route with better error handling
app.get('/api/protected', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: ERROR_MESSAGES.MISSING_TOKEN
      });
    }

    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      res.json({
        status: 'success',
        data: { user: decoded },
        message: 'Protected data retrieved successfully'
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: ERROR_MESSAGES.TOKEN_EXPIRED
        });
      }
      res.status(401).json({
        status: 'error',
        message: ERROR_MESSAGES.INVALID_TOKEN
      });
    }
  } catch (error) {
    console.error('Protected route error:', error);
    res.status(500).json({
      status: 'error',
      message: ERROR_MESSAGES.SERVER_ERROR
    });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
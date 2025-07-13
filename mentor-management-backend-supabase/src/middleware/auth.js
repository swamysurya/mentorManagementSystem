import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Authentication token is required",
    });
  }

  try {
    // Verify token
    const user = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(user);
    // Add user info to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }
};

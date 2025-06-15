import express from "express";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import cors from "cors";
import doubtRoutes from "./src/routes/doubtRoutes.js";
import optionRoutes from "./src/routes/optionRoutes.js";
import feedbackRoutes from "./src/routes/feedbackRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

// routes related to users
app.use("/users", userRoutes);

// routes related to auth
app.use("/auth", authRoutes);

// routes related to doubts
app.use("/doubts", doubtRoutes);

// routes realted to get options
app.use("/options/", optionRoutes);

// routess realted to feedback
app.use("/feedback/", feedbackRoutes);

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

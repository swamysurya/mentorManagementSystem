import express from "express";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import cors from "cors";
import doubtRoutes from "./src/routes/doubtRoutes.js";
import optionRoutes from "./src/routes/optionRoutes.js";
import feedbackRoutes from "./src/routes/feedbackRoutes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";
import issueRoutes from "./src/routes/issueRoutes.js";

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

// routes relate to uploads
app.use("/api", uploadRoutes);

app.use("/api", issueRoutes);

app.get("/", (req, res) => res.send("API running"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

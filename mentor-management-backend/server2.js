import express from "express";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

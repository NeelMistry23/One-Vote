import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pollRoutes from "./routes/polls.js";

dotenv.config();

const app = express();

// CORS setup
app.use(cors({
  origin: process.env.FRONTEND_URL || "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());

// Health check route
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "onevote-api" });
});

// Routes
app.use("/api/polls", pollRoutes);

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});


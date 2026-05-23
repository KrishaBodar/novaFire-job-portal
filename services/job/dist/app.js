import express from "express";
import jobRoutes from "./routes/job.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const allowedOrigins = (process.env.CORS_ORIGIN ||
    process.env.FRONTEND_URL ||
    "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim());
const app = express();
app.get("/health", (_req, res) => {
    res.json({ service: "job", status: "ok" });
});
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/job", jobRoutes);
export default app;

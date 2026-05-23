import express from "express";
import authRoutes from "./routes/auth.js";
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
    res.json({ service: "auth", status: "ok" });
});
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
export default app;

import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import cors from "cors";
import { testDatabaseConnection } from "./utils/db.js";
dotenv.config();
const allowedOrigins = (process.env.CORS_ORIGIN ||
    process.env.FRONTEND_URL ||
    "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim());
const app = express();
app.get("/health", (_req, res) => {
    res.json({ service: "user", status: "ok" });
});
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userRoutes);
const port = Number(process.env.PORT || 5002);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const startServer = async () => {
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await testDatabaseConnection();
            app.listen(port, () => {
                console.log(`User service is running on http://localhost:${port}`);
            });
            return;
        }
        catch (error) {
            console.error(`User service startup failed (attempt ${attempt}/${maxRetries})`, error);
            if (attempt < maxRetries) {
                await wait(2000 * attempt);
            }
        }
    }
    console.error("User service could not start after multiple retries.");
};
void startServer();

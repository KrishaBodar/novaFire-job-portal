import express from "express";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import cors from "cors";
import paymentRoutes from "./routes/payment.js";
import { testDatabaseConnection } from "./utils/db.js";
dotenv.config();
const allowedOrigins = (process.env.CORS_ORIGIN ||
    process.env.FRONTEND_URL ||
    "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim());
const razorpayKey = process.env.Razorpay_Key || process.env.RAZORPAY_KEY;
const razorpaySecret = process.env.Razorpay_Secret || process.env.RAZORPAY_SECRET;
export const instance = razorpayKey && razorpaySecret
    ? new Razorpay({
        key_id: razorpayKey,
        key_secret: razorpaySecret,
    })
    : null;
const app = express();
app.get("/health", (_req, res) => {
    res.json({ service: "payment", status: "ok" });
});
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/payment", paymentRoutes);
const port = Number(process.env.PORT || 5004);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const startServer = async () => {
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await testDatabaseConnection();
            app.listen(port, () => {
                console.log(`Payment service is running on http://localhost:${port}`);
            });
            return;
        }
        catch (error) {
            console.error(`Payment service startup failed (attempt ${attempt}/${maxRetries})`, error);
            if (attempt < maxRetries) {
                await wait(2000 * attempt);
            }
        }
    }
    console.error("Payment service could not start after multiple retries.");
};
void startServer();

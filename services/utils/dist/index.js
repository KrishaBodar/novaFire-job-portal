import express from "express";
import dotenv from "dotenv";
import routes from "./routes.js";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
//import { startSendMailConsumer } from "./consumer.js";
dotenv.config();
const allowedOrigins = (process.env.CORS_ORIGIN ||
    process.env.FRONTEND_URL ||
    "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim());
//startSendMailConsumer();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const app = express();
app.get("/health", (_req, res) => {
    res.json({ service: "utils", status: "ok" });
});
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api/utils", routes);
app.listen(process.env.PORT, () => {
    console.log(`Utils Service is running on http://localhost:${process.env.PORT}`);
});

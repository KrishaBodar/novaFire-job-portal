import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();
const databaseUrl = process.env.DATABASE_URL || process.env.DB_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL missing for auth service");
}
let parsedDatabaseUrl;
try {
    parsedDatabaseUrl = new URL(databaseUrl);
}
catch (error) {
    throw new Error("DATABASE_URL for auth service is not a valid URL");
}
if (!parsedDatabaseUrl.hostname || databaseUrl.includes("Your db url")) {
    throw new Error("DATABASE_URL for auth service is not configured correctly");
}
export const sql = neon(databaseUrl);
export const testDatabaseConnection = async () => {
    await sql `SELECT 1`;
};

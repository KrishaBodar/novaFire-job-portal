import app from "./app.js";
import dotenv from "dotenv";
import { sql, testDatabaseConnection } from "./utils/db.js";
import { createClient } from "redis";
import { connectKafka } from "./producer.js";
dotenv.config();
export const redisClient = createClient({
    url: process.env.REDIS_URL || process.env.Redis_url,
});
redisClient.on("error", (err) => {
    console.error("Redis Client Error:", err);
});
const port = Number(process.env.PORT || 5000);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function initDb() {
    await testDatabaseConnection();
    await sql `
  DO $$
  BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('jobseeker', 'recruiter');
     END IF;
  END$$;
  `;
    await sql `
    CREATE TABLE IF NOT EXISTS users (
       user_id SERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL,
       phone_number VARCHAR(20) NOT NULL,
       role user_role NOT NULL,
       bio TEXT,
       resume VARCHAR(255),
       resume_public_id VARCHAR(255),
       profile_pic VARCHAR(255),
       profile_pic_public_id VARCHAR(255),
       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
       subscription TIMESTAMPTZ
    )
  `;
    await sql `
   CREATE TABLE IF NOT EXISTS skills (
     skill_id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL UNIQUE
   )
  `;
    await sql `
  CREATE TABLE IF NOT EXISTS user_skills(
     user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
     skill_id INTEGER NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
     PRIMARY KEY (user_id, skill_id)
  )
  `;
    console.log("Auth database tables checked/created successfully.");
}
const startServer = async () => {
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            if (!redisClient.isOpen) {
                await redisClient.connect();
                console.log("Auth service connected to redis.");
            }
            await connectKafka();
            await initDb();
            app.listen(port, () => {
                console.log(`Auth service is running on http://localhost:${port}`);
            });
            return;
        }
        catch (error) {
            console.error(`Auth service startup failed (attempt ${attempt}/${maxRetries})`, error);
            if (attempt < maxRetries) {
                await wait(2000 * attempt);
            }
        }
    }
    console.error("Auth service could not start after multiple retries.");
};
void startServer();

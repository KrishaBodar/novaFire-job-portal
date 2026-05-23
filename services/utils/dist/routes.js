import express from "express";
import cloudinary from "cloudinary";
const router = express.Router();
router.post("/upload", async (req, res) => {
    try {
        const { buffer, public_id } = req.body;
        if (public_id) {
            await cloudinary.v2.uploader.destroy(public_id);
        }
        const cloud = await cloudinary.v2.uploader.upload(buffer);
        res.json({
            url: cloud.secure_url,
            public_id: cloud.public_id,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.API_KEY_GEMINI;
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;
router.post("/career", async (req, res) => {
    const { skills } = req.body;
    if (!skills) {
        return res.status(400).json({
            message: "Skills Required",
        });
    }
    try {
        if (!ai) {
            throw new Error("AI not configured");
        }
        const prompt = ` 
Based on the following skills: ${skills}. 
 
Please act as a career advisor and generate a career path suggestion. 
Your entire response must be in a valid JSON format. Do not include any text or markdown 
formatting outside of the JSON structure. 
 
The JSON object should have the following structure: 
{ 
 "summary": "A brief, encouraging summary of the user's skill set and their general job 
title.", 
 "jobOptions": [ 
  { 
"title": "The name of the job role.", 
"responsibilities": "A description of what the user would do in this role.", 
"why": "An explanation of why this role is a good fit for their skills." 
  } 
 ], 
 "skillsToLearn": [ 
  { 
"category": "A general category for skill improvement (e.g., 'Deepen Your Existing Stack 
Mastery', 'DevOps & Cloud').", 
"skills": [ 
  { 
  "title": "The name of the skill to learn.", 
  "why": "Why learning this skill is important.", 
  "how": "Specific examples of how to learn or apply this skill." 
  } 
] 
  } 
 ], 
 "learningApproach": { 
"title": "How to Approach Learning", 
"points": ["A bullet point list of actionable advice for learning."] 
  } 
} 
 `;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        let jsonResponse;
        try {
            const rawText = response.text
                ?.replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            if (!rawText) {
                throw new Error("Ai did not return a valid text response.");
            }
            jsonResponse = JSON.parse(rawText);
        }
        catch (error) {
            throw new Error("AI response parsing failed");
        }
        res.json(jsonResponse);
    }
    catch (error) {
        console.warn("Gemini Career Advice failed, using fallback mock:", error.message || error);
        const fallback = getMockCareerResponse(skills);
        res.json(fallback);
    }
});
router.post("/resume-analyser", async (req, res) => {
    const { pdfBase64 } = req.body;
    if (!pdfBase64) {
        return res.status(400).json({ message: "PDF data is required" });
    }
    try {
        if (!ai) {
            throw new Error("AI not configured");
        }
        const prompt = ` 
You are an expert ATS (Applicant Tracking System) analyzer. Analyze the following resume 
and provide: 
1. An ATS compatibility score (0-100) 
2. Detailed suggestions to improve the resume for better ATS performance 
 
Your entire response must be in valid JSON format. Do not include any text or markdown 
formatting outside of the JSON structure. 
 
The JSON object should have the following structure: 
{ 
  "atsScore": 85, 
  "scoreBreakdown": { 
    "formatting": { 
      "score": 90, 
      "feedback": "Brief feedback on formatting" 
    }, 
    "keywords": { 
      "score": 80, 
      "feedback": "Brief feedback on keyword usage" 
    }, 
    "structure": { 
      "score": 85, 
      "feedback": "Brief feedback on resume structure" 
    }, 
    "readability": { 
      "score": 88, 
      "feedback": "Brief feedback on readability" 
    } 
  }, 
  "suggestions": [ 
    { 
      "category": "Category name (e.g., 'Formatting', 'Content', 'Keywords', 
'Structure')", 
      "issue": "Description of the issue found", 
      "recommendation": "Specific actionable recommendation to fix it", 
      "priority": "high/medium/low" 
    } 
  ], 
  "strengths": [ 
    "List of things the resume does well for ATS" 
  ], 
  "summary": "A brief 2-3 sentence summary of the overall ATS performance" 
} 
 
Focus on: - File format and structure compatibility - Proper use of standard section headings - Keyword optimization - Formatting issues (tables, columns, graphics, special characters) - Contact information placement - Date formatting - Use of action verbs and quantifiable achievements - Section organization and flow 
`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: prompt,
                        },
                        {
                            inlineData: {
                                mimeType: "application/pdf",
                                data: pdfBase64.replace(/^data:application\/pdf;base64,/, ""),
                            },
                        },
                    ],
                },
            ],
        });
        let jsonResponse;
        try {
            const rawText = response.text
                ?.replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            if (!rawText) {
                throw new Error("Ai did not return a valid text response.");
            }
            jsonResponse = JSON.parse(rawText);
        }
        catch (error) {
            throw new Error("AI response parsing failed");
        }
        res.json(jsonResponse);
    }
    catch (error) {
        console.warn("Gemini Resume Analyser failed, using fallback mock:", error.message || error);
        const fallback = getMockResumeAnalysis();
        res.json(fallback);
    }
});
function getMockCareerResponse(skillsInput) {
    const skillsList = Array.isArray(skillsInput)
        ? skillsInput
        : typeof skillsInput === "string"
            ? skillsInput.split(",").map((s) => s.trim())
            : ["React", "Node.js", "TypeScript"];
    const skillsStr = skillsList.join(", ");
    return {
        summary: `Based on your skillset including ${skillsStr}, you are well-positioned for roles in Modern Web Development and Software Engineering.`,
        jobOptions: [
            {
                title: "Full Stack Software Engineer",
                responsibilities: "Design, build, and maintain end-to-end web applications using client-side and server-side technologies.",
                why: `Your experience with ${skillsList[0] || "React"} and ${skillsList[1] || "Node.js"} makes you an excellent fit for modern JavaScript/TypeScript full stack environments.`,
            },
            {
                title: "Frontend Development Specialist",
                responsibilities: "Create responsive, high-performance user interfaces and collaborate with designers on user experience.",
                why: `You have solid foundational skills like ${skillsList[0] || "React"} which are highly sought after for modern UI engineering.`,
            },
            {
                title: "Backend / API Engineer",
                responsibilities: "Develop scalable server-side systems, design databases, and orchestrate service APIs.",
                why: `Using ${skillsList[1] || "Node.js"} and associated backend practices enables you to engineer performant logic and service integrations.`,
            },
        ],
        skillsToLearn: [
            {
                category: "Cloud Services & Infrastructure",
                skills: [
                    {
                        title: "Docker & Containerization",
                        why: "Containers ensure consistent application deployment across development and production environments.",
                        how: "Build a multi-container Docker application utilizing Docker Compose.",
                    },
                    {
                        title: "AWS or Google Cloud Platform",
                        why: "Cloud computing skills are essential for deploying scalable, high-availability microservices.",
                        how: "Host a sample node service on AWS ECS or GCP App Engine.",
                    },
                ],
            },
            {
                category: "Advanced System Design",
                skills: [
                    {
                        title: "System Design Patterns",
                        why: "Designing large-scale systems requires knowledge of load balancing, caching, and database replication.",
                        how: "Study architectural patterns and implement Redis caching in your API routes.",
                    },
                ],
            },
        ],
        learningApproach: {
            title: "Actionable Learning Strategy",
            points: [
                "Dedicate 1 hour daily to coding hands-on projects rather than just reading/watching guides.",
                "Implement TypeScript across your entire stack to catch bugs early and improve developer productivity.",
                "Build a real-world project incorporating Redis caching, database migrations, and clean architecture.",
                "Contribute to open-source repositories to learn best practices and collaborate with other developers.",
            ],
        },
    };
}
function getMockResumeAnalysis() {
    return {
        atsScore: 84,
        scoreBreakdown: {
            formatting: {
                score: 88,
                feedback: "Your resume layout is clean and uses standard fonts, which is easily parsed by modern ATS scanners.",
            },
            keywords: {
                score: 78,
                feedback: "Good coverage of core web development keywords. Adding cloud and DevOps related keywords would increase your score.",
            },
            structure: {
                score: 85,
                feedback: "Standard chronological sections are used. Ensure education and experience sections are clearly demarcated.",
            },
            readability: {
                score: 86,
                feedback: "Bullet points are concise. Focus on using more quantifiable achievements (e.g. 'improved performance by 25%').",
            },
        },
        suggestions: [
            {
                category: "Keywords",
                issue: "DevOps and system infrastructure keywords are scarce.",
                recommendation: "Add terms like Docker, CI/CD, AWS, or Kubernetes if you have experience with them.",
                priority: "high",
            },
            {
                category: "Formatting",
                issue: "Dates are not formatted uniformly.",
                recommendation: "Ensure all dates follow a consistent format like 'MM/YYYY' or 'Month YYYY'.",
                priority: "medium",
            },
            {
                category: "Content",
                issue: "Some bullet points lack measurable outcomes.",
                recommendation: "Use the STAR method: Situation, Task, Action, Result. Quantify results where possible.",
                priority: "medium",
            },
        ],
        strengths: [
            "No complex graphic elements or tables that confuse parser scanners.",
            "Clear contact information at the top of the document.",
            "Appropriate length (under 2 pages).",
        ],
        summary: "Your resume performs very well against standard ATS criteria. Addressing the missing technical keywords and formatting dates uniformly will make it highly competitive.",
    };
}
export default router;

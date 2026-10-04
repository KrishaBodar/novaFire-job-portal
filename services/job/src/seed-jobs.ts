import { sql } from "./utils/db.js";
import dotenv from "dotenv";

dotenv.config();

async function seed() {
  console.log("🌱 Starting seed for companies and 10 jobs...");

  // 1. Ensure at least one recruiter user exists
  let recruiterId = 1;
  const existingUsers = await sql`SELECT user_id FROM users LIMIT 1`;
  if (existingUsers.length > 0) {
    recruiterId = existingUsers[0].user_id;
  } else {
    const [newUser] = await sql`
      INSERT INTO users (name, email, password, phone_number, role)
      VALUES ('NovaRecruiter', 'recruiter@novahire.com', '$2b$10$xyz', '9998887770', 'recruiter')
      RETURNING user_id
    `;
    recruiterId = newUser.user_id;
  }

  // 2. Insert Companies
  const companiesData = [
    {
      name: "NovaTech Labs",
      description: "Leading enterprise cloud and AI platform building next-generation web tools.",
      website: "https://novatechlabs.io",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
      logo_public_id: "novatech_logo"
    },
    {
      name: "CyberPulse Systems",
      description: "Cybersecurity and SaaS engineering firm pioneering zero-trust cloud products.",
      website: "https://cyberpulse.dev",
      logo: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=150&auto=format&fit=crop&q=80",
      logo_public_id: "cyberpulse_logo"
    },
    {
      name: "DataWave Global",
      description: "Global data science & analytics company powering real-time streaming pipelines.",
      website: "https://datawave.ai",
      logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&auto=format&fit=crop&q=80",
      logo_public_id: "datawave_logo"
    },
    {
      name: "AetherAI Innovations",
      description: "Cutting-edge artificial intelligence lab integrating LLMs into modern web software.",
      website: "https://aetherai.tech",
      logo: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=150&auto=format&fit=crop&q=80",
      logo_public_id: "aether_logo"
    }
  ];

  const companyMap: Record<string, number> = {};

  for (const comp of companiesData) {
    const existingComp = await sql`SELECT company_id FROM companies WHERE name = ${comp.name}`;
    if (existingComp.length > 0) {
      companyMap[comp.name] = existingComp[0].company_id;
    } else {
      const [inserted] = await sql`
        INSERT INTO companies (name, description, website, logo, logo_public_id, recruiter_id)
        VALUES (${comp.name}, ${comp.description}, ${comp.website}, ${comp.logo}, ${comp.logo_public_id}, ${recruiterId})
        RETURNING company_id
      `;
      companyMap[comp.name] = inserted.company_id;
    }
  }

  // 3. Insert 10 Jobs
  const jobsData = [
    {
      title: "Senior Full Stack Engineer",
      description: "Build high-performance scalable web applications using React, Node.js, TypeScript, and microservices architecture.",
      salary: 1800000,
      location: "Bangalore, India",
      job_type: "Full-time",
      work_location: "Hybrid",
      role: "Senior Software Engineer",
      openings: 3,
      company: "NovaTech Labs"
    },
    {
      title: "Lead Frontend Architect (React / Next.js)",
      description: "Lead the UI architecture of high-traffic SaaS products, craft design systems, and optimize Core Web Vitals.",
      salary: 2400000,
      location: "Remote, India",
      job_type: "Full-time",
      work_location: "Remote",
      role: "Frontend Architect",
      openings: 2,
      company: "CyberPulse Systems"
    },
    {
      title: "Backend Engineer (Node.js & Microservices)",
      description: "Develop resilient REST & gRPC microservices, manage PostgreSQL & Redis clusters, and engineer high-throughput APIs.",
      salary: 1500000,
      location: "Hyderabad, India",
      job_type: "Full-time",
      work_location: "Hybrid",
      role: "Backend Engineer",
      openings: 5,
      company: "DataWave Global"
    },
    {
      title: "AI/ML Integration Specialist",
      description: "Integrate Large Language Models (LLMs), Gemini APIs, and vector embeddings into production workflow tools.",
      salary: 2200000,
      location: "Pune, India",
      job_type: "Full-time",
      work_location: "Remote",
      role: "AI Engineer",
      openings: 2,
      company: "AetherAI Innovations"
    },
    {
      title: "Cloud DevOps & Infrastructure Specialist",
      description: "Manage Kubernetes clusters, CI/CD automated deployments, Terraform infrastructure as code, and AWS cloud security.",
      salary: 2000000,
      location: "Mumbai, India",
      job_type: "Full-time",
      work_location: "Hybrid",
      role: "DevOps Engineer",
      openings: 4,
      company: "NovaTech Labs"
    },
    {
      title: "Product UI/UX Designer",
      description: "Craft intuitive user journeys, wireframes, high-fidelity Figma prototypes, and design systems for enterprise applications.",
      salary: 1200000,
      location: "Bangalore, India",
      job_type: "Full-time",
      work_location: "On-site",
      role: "UI/UX Designer",
      openings: 2,
      company: "CyberPulse Systems"
    },
    {
      title: "Full Stack Developer (Next.js & PostgreSQL)",
      description: "End-to-end feature development using Next.js App Router, Tailwind CSS, Node.js express APIs, and database migrations.",
      salary: 1400000,
      location: "Gurgaon, India",
      job_type: "Full-time",
      work_location: "Hybrid",
      role: "Software Engineer",
      openings: 4,
      company: "NovaTech Labs"
    },
    {
      title: "Mobile Application Developer (React Native)",
      description: "Build cross-platform iOS & Android apps with React Native, Redux Toolkit, animated transitions, and native module bridges.",
      salary: 1600000,
      location: "Noida, India",
      job_type: "Full-time",
      work_location: "Remote",
      role: "Mobile Developer",
      openings: 3,
      company: "DataWave Global"
    },
    {
      title: "Software Quality Assurance Engineer",
      description: "Develop automated E2E test suites with Playwright and Jest, perform load testing, and maintain test execution pipelines.",
      salary: 900000,
      location: "Ahmedabad, India",
      job_type: "Full-time",
      work_location: "Hybrid",
      role: "QA Automation Engineer",
      openings: 3,
      company: "CyberPulse Systems"
    },
    {
      title: "Junior Web Developer (Internship)",
      description: "Great opportunity for fresh graduates! Gain hands-on experience building modern web pages with React, TypeScript, and Git.",
      salary: 450000,
      location: "Remote, India",
      job_type: "Internship",
      work_location: "Remote",
      role: "Junior Web Developer",
      openings: 5,
      company: "AetherAI Innovations"
    }
  ];

  for (const job of jobsData) {
    const companyId = companyMap[job.company];
    const existingJob = await sql`SELECT job_id FROM jobs WHERE title = ${job.title} AND company_id = ${companyId}`;
    
    if (existingJob.length === 0) {
      await sql`
        INSERT INTO jobs (title, description, salary, location, job_type, work_location, role, openings, company_id, posted_by_recuriter_id, is_active)
        VALUES (
          ${job.title},
          ${job.description},
          ${job.salary},
          ${job.location},
          ${job.job_type}::job_type,
          ${job.work_location}::work_location,
          ${job.role},
          ${job.openings},
          ${companyId},
          ${recruiterId},
          true
        )
      `;
      console.log(`✅ Inserted job: ${job.title}`);
    } else {
      console.log(`ℹ️ Job already exists: ${job.title}`);
    }
  }

  console.log("🎉 Seeding complete! 10 jobs are present in database.");
}

seed().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});

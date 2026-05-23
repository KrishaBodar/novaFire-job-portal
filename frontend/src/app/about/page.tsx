import { Button } from "@/components/ui/button";
import { ArrowRight, BriefcaseBusiness, Globe, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7ed_0%,#f8fafc_45%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_top,#1f2937_0%,#0f172a_45%,#020617_100%)]">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[0.95fr_1.05fr] md:items-center md:py-24">
        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
          <img
            src="/about.png"
            className="h-full w-full object-cover"
            alt="Team discussing hiring goals"
          />
        </div>

        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur dark:bg-white/5">
            <Sparkles size={16} className="text-orange-500" />
            Built for job seekers and recruiters
          </div>

          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            A better hiring experience for both sides of the market.
          </h1>

          <p className="text-lg leading-8 text-muted-foreground">
            NovaHire is designed to reduce the noise in hiring. We help
            candidates present themselves more clearly and give recruiters a
            simpler, faster way to discover strong talent and manage job
            pipelines.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Candidate-first",
                body: "Sharper profiles, resume tools, and smoother application journeys.",
              },
              {
                icon: BriefcaseBusiness,
                title: "Recruiter-ready",
                body: "Cleaner employer pages, job management, and application review.",
              },
              {
                icon: Globe,
                title: "Scalable",
                body: "A modular platform ready to grow into a real production workflow.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border bg-white/70 p-5 shadow-sm backdrop-blur dark:bg-white/5"
              >
                <item.icon size={20} className="mb-3 text-indigo-500" />
                <h3 className="mb-2 font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>

          <Link href="/jobs">
            <Button size="lg" className="h-12 gap-2 px-8 text-base">
              Explore opportunities
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;

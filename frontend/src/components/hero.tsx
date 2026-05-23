import { ArrowRight, Briefcase, Search, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[slate-50] dark:bg-[#030712] py-20 lg:py-28 border-b border-muted/30">
      {/* Futuristic Grid & Glow Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] animate-pulse" />
        <div className="absolute right-[-5%] top-[10%] h-[600px] w-[600px] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[20%] h-[400px] w-[400px] rounded-full bg-pink-500/10 dark:bg-pink-500/5 blur-[110px]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-16 px-4 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div className="space-y-8 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-950/30 px-4.5 py-1.5 text-xs sm:text-sm font-medium shadow-[0_0_15px_rgba(99,102,241,0.05)] backdrop-blur text-indigo-600 dark:text-indigo-400">
            <Sparkles size={14} className="text-indigo-500 animate-pulse" />
            AI-Powered Career & Placement OS
          </div>

          {/* Heading */}
          <div className="space-y-6">
            <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white">
              Discover opportunities that match your{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(99,102,241,0.1)]">
                potential.
              </span>
            </h1>
            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              NovaHire bridges the gap between top talent and elite organizations. 
              Accelerate your job search with deep resume analysis, real-time AI guidance, 
              and verified listings.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/jobs">
              <Button size="lg" className="h-13 gap-2.5 px-8 text-base bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 dark:shadow-none hover:translate-y-[-1px] transition-all">
                <Search size={18} />
                Find Opportunities
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="h-13 gap-2.5 px-8 text-base rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:translate-y-[-1px] transition-all"
              >
                <Briefcase size={18} />
                Explore Platform
              </Button>
            </Link>
          </div>

          {/* Stat Cards */}
          <div className="grid gap-4 grid-cols-3 pt-4">
            {[
              { value: "15k+", label: "Active Jobs", glow: "rgba(99,102,241,0.15)" },
              { value: "3.8k+", label: "Verified Firms", glow: "rgba(168,85,247,0.15)" },
              { value: "98.2%", label: "Match Rate", glow: "rgba(236,72,153,0.15)" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="group relative rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-4.5 shadow-sm backdrop-blur hover:border-indigo-500/30 transition-all duration-300"
                style={{
                  boxShadow: `0 4px 30px rgba(0,0,0,0.02)`
                }}
              >
                {/* Background glow hover */}
                <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" style={{ backgroundColor: stat.glow }} />
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
              <TrendingUp size={14} className="text-emerald-500" />
              Direct-to-Recruiter Channels
            </span>
            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-sky-500/5 text-sky-600 dark:text-sky-400 border border-sky-500/10">
              <TrendingUp size={14} className="text-sky-500" />
              Verified Company Profiles
            </span>
          </div>
        </div>

        {/* Right side Visual - Futuristic UI Card Mockup */}
        <div className="relative flex justify-center items-center">
          {/* Neon gradient outer glow ring */}
          <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-20 dark:opacity-15 blur-2xl animate-pulse" />

          {/* Tiny Floating Card 1 */}
          <div className="absolute -left-6 top-12 z-20 hidden rounded-2xl bg-white/90 dark:bg-slate-950/90 border border-slate-100 dark:border-slate-800 p-4 shadow-xl backdrop-blur md:block hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold">
                AI
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Ats scanner</p>
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Resume Optimized: 98%</p>
              </div>
            </div>
          </div>

          {/* Tiny Floating Card 2 */}
          <div className="absolute -right-4 bottom-14 z-20 hidden rounded-2xl bg-white/90 dark:bg-slate-950/90 border border-slate-100 dark:border-slate-800 p-4 shadow-xl backdrop-blur md:block hover:scale-105 transition-transform duration-300">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Salary insights</p>
            <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">$140k - $175k</p>
          </div>

          {/* Main Visual Frame */}
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-100 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-2xl backdrop-blur-md max-w-[450px] w-full p-2">
            <div className="overflow-hidden rounded-[1.7rem]">
              <img
                src="/hero.png"
                className="h-full w-full object-cover aspect-[4/5] hover:scale-105 transition-transform duration-700 ease-out"
                alt="Professionals collaborating over a hiring dashboard"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

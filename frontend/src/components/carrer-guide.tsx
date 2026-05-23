"use client";

import { CareerGuideResponse } from "@/type";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Lightbulb,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { getErrorMessage } from "@/lib/api";
import { utilsApi } from "@/lib/http";
import toast from "react-hot-toast";

const CareerGuide = () => {
  const [open, setOpen] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CareerGuideResponse | null>(null);

  const addSkill = () => {
    const skill = currentSkill.trim();

    if (skill && !skills.includes(skill)) {
      setSkills((current) => [...current, skill]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((current) => current.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      addSkill();
    }
  };

  const getCareerGuidance = async () => {
    if (skills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }

    setLoading(true);

    try {
      const { data } = await utilsApi.post(`/api/utils/career`, {
        skills,
      });

      setResponse(data);
      toast.success("Career guidance generated");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to generate guidance"));
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setSkills([]);
    setCurrentSkill("");
    setResponse(null);
    setOpen(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4.5 py-1.5 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
          <Sparkles size={16} className="text-indigo-500 animate-pulse" />
          <span className="text-sm font-semibold tracking-wide">AI-Powered Career Guidance</span>
        </div>
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight md:text-4xl text-slate-900 dark:text-white">
          Discover your next career direction
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          Turn your current skill set into tailored job paths and an action
          plan for what to learn next.
        </p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="h-12 gap-2 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 dark:shadow-none hover:translate-y-[-1px] transition-all">
              <Sparkles size={18} />
              Get Career Guidance
              <ArrowRight size={18} />
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl shadow-2xl">
            {!response ? (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                    <Sparkles className="text-indigo-500" />
                    Tell us about your skills
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 dark:text-slate-400">
                    Add your technical skills to receive personalized career
                    guidance from our AI agent.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="skill" className="font-semibold text-slate-700 dark:text-slate-300">Add skills</Label>
                    <div className="flex gap-2">
                      <Input
                        id="skill"
                        placeholder="React, Node.js, Product Design..."
                        value={currentSkill}
                        onChange={(event) => setCurrentSkill(event.target.value)}
                        onKeyDown={handleKeyPress}
                        className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"
                      />
                      <Button onClick={addSkill} className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">Add</Button>
                    </div>
                  </div>

                  {skills.length > 0 && (
                    <div className="space-y-2">
                      <Label className="font-semibold text-slate-700 dark:text-slate-300">Your skills ({skills.length})</Label>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <div
                            key={skill}
                            className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-3.5 py-1.5 dark:border-indigo-900/50 dark:bg-indigo-950/30"
                          >
                            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{skill}</span>
                            <button
                              onClick={() => removeSkill(skill)}
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-red-500 dark:hover:bg-red-500 hover:text-white text-slate-500 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={getCareerGuidance}
                    disabled={loading || skills.length === 0}
                    className="h-11 w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl mt-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Analyzing your skills...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Generate career guidance
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                    <Target className="text-indigo-500" />
                    Your personalized career guide
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5 dark:border-indigo-900/30 dark:bg-indigo-950/20">
                    <div className="flex items-start gap-3.5">
                      <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                        <Lightbulb size={20} />
                      </div>
                      <div>
                        <h3 className="mb-1 font-bold text-slate-900 dark:text-white">Career Summary</h3>
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-350">
                          {response.summary}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                      <Briefcase size={20} className="text-indigo-500" />
                      Recommended career paths
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {response.jobOptions.map((job) => (
                        <div
                          className="rounded-2xl border border-slate-100 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/30 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/[0.02] dark:hover:bg-slate-900/60 transition-all duration-300"
                          key={job.title}
                        >
                          <h4 className="mb-3 text-base font-bold text-slate-900 dark:text-white">{job.title}</h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-0.5">
                                Responsibilities
                              </p>{" "}
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {job.responsibilities}
                              </p>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-0.5">
                                Why it fits
                              </p>{" "}
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {job.why}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                      <TrendingUp size={20} className="text-indigo-500" />
                      Skills to strengthen next
                    </h3>
                    <div className="space-y-4">
                      {response.skillsToLearn.map((category) => (
                        <div className="space-y-2.5" key={category.category}>
                          <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                            {category.category}
                          </h4>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {category.skills.map((skill) => (
                              <div
                                key={`${category.category}-${skill.title}`}
                                className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20 p-4 text-sm"
                              >
                                <p className="mb-1.5 font-bold text-slate-900 dark:text-white">{skill.title}</p>
                                <p className="mb-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                  <span className="font-semibold text-slate-800 dark:text-slate-200">Why:</span>{" "}
                                  {skill.why}
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                  <span className="font-semibold text-slate-800 dark:text-slate-200">How:</span>{" "}
                                  {skill.how}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-indigo-100/50 bg-indigo-500/[0.02] dark:border-indigo-900/20 p-5">
                    <h3 className="mb-3.5 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                      <BookOpen size={20} className="text-indigo-500" />
                      {response.learningApproach.title}
                    </h3>
                    <ul className="space-y-2.5">
                      {response.learningApproach.points.map((point, index) => (
                        <li
                          key={`${point}-${index}`}
                          className="flex items-start gap-2.5 text-sm"
                        >
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button onClick={resetDialog} variant="outline" className="w-full h-11 rounded-xl">
                    Start new analysis
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CareerGuide;

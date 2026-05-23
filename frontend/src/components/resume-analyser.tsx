"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Loader2,
  ArrowRight,
  FileCheck,
  Zap,
} from "lucide-react";
import { ResumeAnalysisResponse } from "@/type";
import { getErrorMessage } from "@/lib/api";
import { utilsApi } from "@/lib/http";
import toast from "react-hot-toast";

const ResumeAnalyzer = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ResumeAnalysisResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setFile(selectedFile);
  };

  const convertToBase64 = (selectedFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const analyzeResume = async () => {
    if (!file) {
      toast.error("Please upload a resume");
      return;
    }

    setLoading(true);

    try {
      const base64 = await convertToBase64(file);
      const { data } = await utilsApi.post(
        `/api/utils/resume-analyser`,
        {
          pdfBase64: base64,
        }
      );

      setResponse(data);
      toast.success("Resume analyzed successfully");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to analyze resume"));
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setFile(null);
    setResponse(null);
    setOpen(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500/5 border-emerald-500/20";
    if (score >= 60) return "bg-amber-500/5 border-amber-500/20";
    return "bg-rose-500/5 border-rose-500/20";
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "high") {
      return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    }

    if (priority === "medium") {
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    }

    return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
  };

  return (
    <div className="mx-auto max-w-7xl bg-[radial-gradient(circle_at_bottom_right,#fff1f2_0%,#f8fafc_45%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_bottom_right,#2a1215_0%,#090d16_45%,#030712_100%)] border-t border-slate-100 dark:border-slate-800/80 px-4 py-16">
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/5 px-4.5 py-1.5 dark:bg-rose-950/30 text-rose-500">
          <FileCheck size={16} className="text-rose-500" />
          <span className="text-sm font-semibold tracking-wide">AI-Powered ATS Analysis</span>
        </div>
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight md:text-4xl text-slate-900 dark:text-white">
          Optimize your resume for ATS
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          Get instant feedback on how your resume performs with applicant
          tracking systems.
        </p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="h-12 gap-2 px-8 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg shadow-rose-600/20 dark:shadow-none hover:translate-y-[-1px] transition-all">
              <FileText size={18} />
              Analyze My Resume
              <ArrowRight size={18} />
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl shadow-2xl">
            {!response ? (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                    <FileText className="text-rose-500" />
                    Upload Your Resume
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 dark:text-slate-400">
                    Upload your resume in PDF format to get a comprehensive AI ATS compatibility review.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center transition-all hover:border-rose-500/50 bg-slate-50/50 dark:bg-slate-900/10 hover:bg-rose-500/[0.01]"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                        <Upload size={30} />
                      </div>
                      <div>
                        <p className="mb-1 font-bold text-slate-900 dark:text-white">
                          {file ? file.name : "Click to upload your resume"}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          PDF format only, maximum 5MB
                        </p>
                      </div>
                      {file && (
                        <div className="flex items-center gap-2 text-emerald-500">
                          <CheckCircle2 size={18} />
                          <span className="text-sm font-semibold">
                            File uploaded successfully
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <Button
                    onClick={analyzeResume}
                    disabled={loading || !file}
                    className="h-11 w-full gap-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Analyzing Your Resume...
                      </>
                    ) : (
                      <>
                        <Zap size={18} />
                        Analyze Resume
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                    <FileCheck className="text-rose-500" />
                    Your Resume Analysis
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <div
                    className={`rounded-2xl border p-6 flex flex-col items-center justify-center ${getScoreBgColor(
                      response.atsScore
                    )}`}
                  >
                    <p className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      ATS Compatibility Score
                    </p>
                    <div
                      className={`text-6xl font-extrabold tracking-tight ${getScoreColor(
                        response.atsScore
                      )}`}
                    >
                      {response.atsScore}
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">out of 100 points</p>
                  </div>

                  <div className="rounded-2xl border border-rose-100 bg-rose-50/20 p-5 dark:border-rose-900/20">
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{response.summary}</p>
                  </div>

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                      <TrendingUp size={20} className="text-rose-500" />
                      Detailed score breakdown
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {Object.entries(response.scoreBreakdown).map(([key, value]) => (
                        <div key={key} className="rounded-xl border border-slate-100 dark:border-slate-800 p-4 bg-white dark:bg-slate-900/30">
                          <div className="mb-2.5 flex items-center justify-between">
                            <p className="font-bold capitalize text-slate-900 dark:text-white">{key}</p>
                            <span
                              className={`text-lg font-extrabold ${getScoreColor(
                                value.score
                              )}`}
                            >
                              {value.score}%
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{value.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-500/[0.01] p-5 dark:border-emerald-900/20">
                    <h3 className="mb-3.5 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                      What your resume does well
                    </h3>
                    <ul className="space-y-2.5">
                      {response.strengths.map((strength) => (
                        <li key={strength} className="flex items-start gap-2.5 text-sm">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="text-slate-700 dark:text-slate-350 leading-relaxed">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                      <AlertTriangle size={20} className="text-rose-500" />
                      Recommendations for improvement
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {response.suggestions.map((suggestion, index) => (
                        <div
                          key={`${suggestion.category}-${index}`}
                          className="rounded-2xl border border-slate-100 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/30 hover:border-rose-500/30 transition-all duration-300"
                        >
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {suggestion.category}
                            </h4>
                            <span
                              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${getPriorityColor(
                                suggestion.priority
                              )}`}
                            >
                              {suggestion.priority}
                            </span>
                          </div>
                          <div className="space-y-2 text-xs sm:text-sm">
                            <div>
                              <p className="font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider mb-0.5">Issue</p>
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{suggestion.issue}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider mb-0.5">Recommendation</p>
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {suggestion.recommendation}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={resetDialog} variant="outline" className="w-full h-11 rounded-xl">
                    Analyze Another Resume
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

export default ResumeAnalyzer;

"use client";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/api";
import { Application } from "@/type";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  DollarSign,
  Eye,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React from "react";

interface AppliedJobsProps {
  applications: Application[];
}

const AppliedJobs: React.FC<AppliedJobsProps> = ({ applications }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "hired":
        return {
          icon: CheckCircle2,
          color: "text-green-600",
          bg: "bg-green-100 dark:bg-green-900/30",
          border: "border-green-200 dark:border-green-800",
        };
      case "rejected":
        return {
          icon: XCircle,
          color: "text-red-600",
          bg: "bg-red-100 dark:bg-red-900/30",
          border: "border-red-200 dark:border-red-800",
        };
      default:
        return {
          icon: Clock,
          color: "text-yellow-600",
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
          border: "border-yellow-200 dark:border-yellow-800",
        };
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Card className="overflow-hidden border-0 bg-card/90 shadow-xl ring-1 ring-black/5">
        <div className="border-b bg-slate-950 p-6 text-white">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Briefcase size={20} />
            </div>
            <h1 className="text-2xl font-bold">Your Applied Jobs</h1>
          </div>
          <p className="text-sm text-white/70">
            {applications.length} applications submitted
          </p>
        </div>

        <div className="p-6">
          {applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((application) => {
                const statusConfig = getStatusConfig(application.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={application.application_id}
                    className="rounded-2xl border bg-background/85 p-5 transition-all hover:shadow-lg"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="mb-3 text-xl font-semibold">
                          {application.job_title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
                            <DollarSign size={14} />
                            <span className="font-medium">
                              {formatCurrency(application.job_salary)}
                            </span>
                          </div>

                          <div
                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 ${statusConfig.bg} ${statusConfig.border}`}
                          >
                            <StatusIcon size={14} className={statusConfig.color} />
                            <span
                              className={`text-sm font-medium ${statusConfig.color}`}
                            >
                              {application.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/jobs/${application.job_id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
                      >
                        <Eye size={16} />
                        View Job
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              No applications yet.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AppliedJobs;

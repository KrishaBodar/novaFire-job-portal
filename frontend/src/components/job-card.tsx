"use client";

import { useAppData } from "@/context/AppContext";
import { formatCurrency } from "@/lib/api";
import { Job } from "@/type";
import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle,
  DollarSign,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { user, btnLoading, applyJob, applications } = useAppData();

  const applied = applications.some((item) => item.job_id === job.job_id);

  return (
    <Card className="w-full max-w-[380px] border-0 bg-card/90 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-blue-500/20">
      <CardHeader className="space-y-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
              <Briefcase size={12} />
              {job.job_type}
            </div>
            <h3 className="mb-2 line-clamp-2 text-xl font-bold tracking-tight transition-colors hover:text-blue-600">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 size={16} />
              <span>{job.company_name}</span>
            </div>
          </div>

          <Link href={`/company/${job.company_id}`} className="shrink-0">
            <div className="h-14 w-14 overflow-hidden rounded-2xl bg-background ring-1 ring-black/10 transition-transform hover:scale-105">
              <img
                src={job.company_logo}
                alt={`${job.company_name} logo`}
                className="h-full w-full object-cover"
              />
            </div>
          </Link>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-secondary-foreground">
              <MapPin size={14} />
              <span className="font-medium">{job.location || "Flexible"}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200">
              <span className="font-medium">{job.work_location}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-base font-semibold">
            <DollarSign size={18} className="text-emerald-600" />
            <span>{formatCurrency(job.salary)} per year</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 border-t pt-4">
        <div className="flex w-full gap-2">
          <Link href={`/jobs/${job.job_id}`} className="flex-1">
            <Button variant="outline" className="w-full gap-2 group/btn">
              View Details
              <ArrowRight
                size={16}
                className="transition-transform group-hover/btn:translate-x-1"
              />
            </Button>
          </Link>

          {user?.role === "jobseeker" &&
            (applied ? (
              <div className="flex flex-1 items-center justify-center gap-2 rounded-md bg-green-100 px-3 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-200">
                <CheckCircle size={15} />
                Applied
              </div>
            ) : (
              job.is_active !== false && (
                <Button
                  disabled={btnLoading}
                  onClick={() => applyJob(job.job_id)}
                  className="flex-1 gap-2"
                >
                  <Briefcase size={16} />
                  Easy Apply
                </Button>
              )
            ))}
        </div>

        {job.is_active === false && (
          <div className="w-full rounded-md bg-red-100 px-3 py-2 text-center text-sm font-medium text-red-700 dark:bg-red-900/30 dark:text-red-200">
            Position closed
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobCard;

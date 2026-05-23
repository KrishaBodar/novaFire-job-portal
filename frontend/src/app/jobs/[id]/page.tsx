"use client";

import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppData } from "@/context/AppContext";
import {
  formatCurrency,
  getErrorMessage,
} from "@/lib/api";
import { Application, Job } from "@/type";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  MapPin,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { jobApi } from "@/lib/http";

type StatusUpdateMap = Record<number, string>;

const JobPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, applyJob, applications, btnLoading } = useAppData();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobApplications, setJobApplications] = useState<Application[]>([]);
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdateMap>({});

  const applied = useMemo(
    () => applications.some((item) => item.job_id.toString() === id),
    [applications, id]
  );

  const isRecruiterOwner =
    Boolean(user) && Boolean(job) && user?.user_id === job?.posted_by_recuriter_id;

  async function fetchSingleJob() {
    try {
      const { data } = await jobApi.get(`/api/job/${id}`);
      setJob(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to load job details"));
    } finally {
      setLoading(false);
    }
  }

  async function fetchJobApplications() {
    try {
      const { data } = await jobApi.get(`/api/job/application/${id}`);

      setJobApplications(data);
      setStatusUpdates(
        Object.fromEntries(
          data.map((application: Application) => [
            application.application_id,
            application.status,
          ])
        )
      );
    } catch (error) {
      console.log(getErrorMessage(error, "Unable to load job applications"));
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchSingleJob();
  }, [id]);

  useEffect(() => {
    if (isRecruiterOwner) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchJobApplications();
    }
  }, [isRecruiterOwner, id]);

  const updateApplicationHandler = async (applicationId: number) => {
    const status = statusUpdates[applicationId];

    if (!status) {
      toast.error("Please select a valid status");
      return;
    }

    try {
      const { data } = await jobApi.put(
        `/api/job/application/update/${applicationId}`,
        { status }
      );

      toast.success(data.message);
      await fetchJobApplications();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to update application"));
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="max-w-lg p-8 text-center">
          <h1 className="mb-2 text-2xl font-semibold">Job not found</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            This listing may have been removed or is no longer available.
          </p>
          <Button onClick={() => router.push("/jobs")}>Browse jobs</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f8fafc_0%,#eef4ff_42%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_top,#132033_0%,#08111e_45%,#020617_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => router.back()}>
          <ArrowLeft size={18} />
          Back to jobs
        </Button>

        <Card className="mb-8 overflow-hidden border-0 shadow-2xl ring-1 ring-black/5">
          <div className="bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_45%,#38bdf8_100%)] p-8 text-white">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-3xl">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
                    {job.is_active ? "Open role" : "Closed role"}
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
                    {job.job_type}
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
                    {job.work_location}
                  </span>
                </div>

                <h1 className="mb-4 text-3xl font-bold md:text-5xl">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-white/85">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} />
                    <span>{job.company_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{job.location || "Flexible location"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} />
                    <span>{formatCurrency(job.salary)}</span>
                  </div>
                </div>
              </div>

              {user?.role === "jobseeker" && (
                <div className="shrink-0">
                  {applied ? (
                    <div className="flex items-center gap-2 rounded-2xl bg-green-100 px-6 py-3 font-medium text-green-700">
                      <CheckCircle2 size={20} />
                      Already applied
                    </div>
                  ) : (
                    job.is_active && (
                      <Button
                        onClick={() => applyJob(job.job_id)}
                        disabled={btnLoading}
                        className="h-12 rounded-xl bg-white px-8 text-slate-900 hover:bg-white/90"
                      >
                        {btnLoading ? "Applying..." : "Easy Apply"}
                      </Button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-8 p-8 lg:grid-cols-[1.6fr_0.8fr]">
            <div className="space-y-8">
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-2xl font-semibold">
                  <Briefcase size={22} className="text-blue-600" />
                  Job overview
                </h2>
                <div className="rounded-2xl border bg-background/80 p-6 leading-7 text-muted-foreground">
                  <p className="whitespace-pre-line">{job.description}</p>
                </div>
              </section>
            </div>

            <div className="space-y-4">
              <Card className="border-0 bg-card/85 p-5 shadow-lg ring-1 ring-black/5">
                <h3 className="mb-4 text-lg font-semibold">Quick facts</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-blue-600" size={18} />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">
                        {job.location || "Flexible"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-emerald-600" size={18} />
                    <div>
                      <p className="font-medium">Compensation</p>
                      <p className="text-muted-foreground">
                        {formatCurrency(job.salary)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="text-violet-600" size={18} />
                    <div>
                      <p className="font-medium">Openings</p>
                      <p className="text-muted-foreground">
                        {job.openings} positions
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {job.company_website && (
                <Card className="border-0 bg-card/85 p-5 shadow-lg ring-1 ring-black/5">
                  <h3 className="mb-3 text-lg font-semibold">
                    About the company
                  </h3>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Explore the employer profile and website before applying.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/company/${job.company_id}`}>
                        <Button variant="outline">View company</Button>
                      </Link>
                      <Link href={job.company_website} target="_blank">
                        <Button className="gap-2">
                          Visit website
                          <ExternalLink size={16} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </Card>

        {isRecruiterOwner && (
          <Card className="border-0 bg-card/90 p-6 shadow-xl ring-1 ring-black/5">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold">Applications</h2>
                <p className="text-sm text-muted-foreground">
                  Review candidates and update their progress.
                </p>
              </div>
            </div>

            {jobApplications.length > 0 ? (
              <div className="space-y-4">
                {jobApplications.map((application) => (
                  <div
                    key={application.application_id}
                    className="rounded-2xl border bg-background/80 p-5"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{application.applicant_email}</p>
                        <p className="text-sm text-muted-foreground">
                          Applied on{" "}
                          {new Date(application.applied_at).toLocaleDateString(
                            "en-IN",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
                        {application.status}
                      </span>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-3 text-sm">
                      <Link
                        target="_blank"
                        href={application.resume}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        View resume
                      </Link>
                      <Link
                        target="_blank"
                        href={`/account/${application.applicant_id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        View profile
                      </Link>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <select
                        value={statusUpdates[application.application_id] ?? application.status}
                        onChange={(event) =>
                          setStatusUpdates((current) => ({
                            ...current,
                            [application.application_id]: event.target.value,
                          }))
                        }
                        className="h-11 flex-1 rounded-xl border bg-background px-3"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <Button
                        disabled={btnLoading}
                        onClick={() =>
                          updateApplicationHandler(application.application_id)
                        }
                      >
                        Update status
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">
                No applications yet for this role.
              </p>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default JobPage;

"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Company, Job } from "@/type";
import Loading from "@/components/loading";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Building2,
  Clock3,
  DollarSign,
  Eye,
  FileText,
  Globe,
  Laptop,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppData } from "@/context/AppContext";
import {
  formatCurrency,
  getErrorMessage,
} from "@/lib/api";
import { jobApi } from "@/lib/http";

type JobFormState = {
  title: string;
  description: string;
  role: string;
  salary: string;
  location: string;
  openings: string;
  job_type: string;
  work_location: string;
  is_active: boolean;
};

const initialJobForm: JobFormState = {
  title: "",
  description: "",
  role: "",
  salary: "",
  location: "",
  openings: "",
  job_type: "",
  work_location: "",
  is_active: true,
};

const CompanyPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAppData();

  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [formState, setFormState] = useState<JobFormState>(initialJobForm);

  const isRecruiterOwner = useMemo(
    () => Boolean(user && company && user.user_id === company.recruiter_id),
    [user, company]
  );

  const updateField = <K extends keyof JobFormState>(
    key: K,
    value: JobFormState[K]
  ) => {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const hydrateJobForm = (job?: Job | null) => {
    if (!job) {
      setFormState(initialJobForm);
      return;
    }

    setFormState({
      title: job.title,
      description: job.description,
      role: job.role,
      salary: job.salary ? String(job.salary) : "",
      location: job.location || "",
      openings: String(job.openings),
      job_type: job.job_type,
      work_location: job.work_location,
      is_active: job.is_active,
    });
  };

  async function fetchCompany() {
    try {
      setLoading(true);
      const { data } = await jobApi.get(`/api/job/company/${id}`);
      setCompany(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to load company"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchCompany();
  }, [id]);

  const buildPayload = () => ({
    title: formState.title.trim(),
    description: formState.description.trim(),
    role: formState.role.trim(),
    salary: Number(formState.salary),
    location: formState.location.trim(),
    openings: Number(formState.openings),
    job_type: formState.job_type,
    work_location: formState.work_location,
    company_id: Number(id),
    is_active: formState.is_active,
  });

  const validateForm = () => {
    const payload = buildPayload();

    if (
      !payload.title ||
      !payload.description ||
      !payload.role ||
      !payload.location ||
      !payload.job_type ||
      !payload.work_location ||
      !payload.salary ||
      !payload.openings
    ) {
      toast.error("Please complete all job details");
      return false;
    }

    return true;
  };

  const addJobHandler = async () => {
    if (!validateForm()) {
      return;
    }

    setBtnLoading(true);
    try {
      await jobApi.post(`/api/job/new`, buildPayload());

      toast.success("New job posted successfully");
      setCreateOpen(false);
      hydrateJobForm(null);
      await fetchCompany();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to create job"));
    } finally {
      setBtnLoading(false);
    }
  };

  const updateJobHandler = async () => {
    if (!selectedJob) {
      toast.error("Please choose a job to edit");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setBtnLoading(true);
    try {
      await jobApi.put(`/api/job/${selectedJob.job_id}`, buildPayload());

      toast.success("Job updated successfully");
      setEditOpen(false);
      setSelectedJob(null);
      hydrateJobForm(null);
      await fetchCompany();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to update job"));
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteHandler = async (jobId: number) => {
    setBtnLoading(true);
    try {
      const { data } = await jobApi.delete(`/api/job/${jobId}`);

      toast.success(data.message);
      await fetchCompany();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete job"));
    } finally {
      setBtnLoading(false);
    }
  };

  const openEditDialog = (job: Job) => {
    setSelectedJob(job);
    hydrateJobForm(job);
    setEditOpen(true);
  };

  const closeEditDialog = () => {
    setEditOpen(false);
    setSelectedJob(null);
    hydrateJobForm(null);
  };

  if (loading) {
    return <Loading />;
  }

  if (!company) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f5f9ff_0%,#edf3ff_35%,#ffffff_100%)] px-4 py-8 dark:bg-[radial-gradient(circle_at_top,#132033_0%,#08111e_45%,#020617_100%)]">
      <div className="mx-auto max-w-6xl space-y-8">
        <Card className="overflow-hidden border-0 shadow-2xl ring-1 ring-black/5">
          <div className="h-36 bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_45%,#38bdf8_100%)]" />
          <div className="px-8 pb-8">
            <div className="-mt-16 flex flex-col gap-6 md:flex-row md:items-end">
              <div className="h-32 w-32 overflow-hidden rounded-3xl bg-white shadow-2xl ring-4 ring-white">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h1 className="mb-2 text-3xl font-bold">{company.name}</h1>
                <p className="max-w-3xl text-muted-foreground">
                  {company.description}
                </p>
              </div>

              <Link href={company.website} target="_blank">
                <Button className="gap-2">
                  <Globe size={18} />
                  Visit Website
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden border-0 bg-card/90 shadow-xl ring-1 ring-black/5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-slate-950 px-6 py-5 text-white">
            <div>
              <h2 className="text-2xl font-semibold">Open Positions</h2>
              <p className="text-sm text-white/70">
                {company.jobs?.length || 0} roles at this company
              </p>
            </div>

            {isRecruiterOwner && (
              <Button
                className="gap-2 bg-white text-slate-900 hover:bg-white/90"
                onClick={() => {
                  hydrateJobForm(null);
                  setCreateOpen(true);
                }}
              >
                <Plus size={18} />
                Post New Job
              </Button>
            )}
          </div>

          <div className="p-6">
            {company.jobs && company.jobs.length > 0 ? (
              <div className="space-y-4">
                {company.jobs.map((job) => (
                  <div
                    key={job.job_id}
                    className="rounded-2xl border bg-background/85 p-5 transition-all hover:shadow-lg"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
                            {job.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2 xl:grid-cols-4">
                          <div className="flex items-center gap-2">
                            <Building2 size={16} />
                            <span>{job.role}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign size={16} />
                            <span>{formatCurrency(job.salary)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>{job.location || "Flexible"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Laptop size={16} />
                            <span>
                              {job.work_location} · {job.job_type}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={16} />
                            <span>{job.openings} openings</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link href={`/jobs/${job.job_id}`}>
                          <Button variant="outline" className="gap-2">
                            <Eye size={16} />
                            View
                          </Button>
                        </Link>

                        {isRecruiterOwner && (
                          <>
                            <Button
                              variant="outline"
                              className="gap-2"
                              onClick={() => openEditDialog(job)}
                            >
                              <Pencil size={16} />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              className="gap-2"
                              onClick={() => void deleteHandler(job.job_id)}
                            >
                              <Trash2 size={16} />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <Briefcase className="opacity-40" size={30} />
                </div>
                <p className="font-medium">No jobs posted yet</p>
                <p className="text-sm text-muted-foreground">
                  Add your first role to start receiving applications.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[680px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Post a new job</DialogTitle>
          </DialogHeader>
          <JobForm formState={formState} updateField={updateField} />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button disabled={btnLoading} onClick={addJobHandler}>
              {btnLoading ? "Posting..." : "Post job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[680px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit job</DialogTitle>
          </DialogHeader>
          <JobForm formState={formState} updateField={updateField} />
          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button disabled={btnLoading} onClick={updateJobHandler}>
              {btnLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

type JobFormProps = {
  formState: JobFormState;
  updateField: <K extends keyof JobFormState>(
    key: K,
    value: JobFormState[K]
  ) => void;
};

const JobForm = ({ formState, updateField }: JobFormProps) => {
  return (
    <div className="space-y-5 py-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="flex items-center gap-2">
          <Briefcase size={16} />
          Job Title
        </Label>
        <Input
          id="title"
          value={formState.title}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="Senior Product Designer"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center gap-2">
          <FileText size={16} />
          Description
        </Label>
        <textarea
          id="description"
          value={formState.description}
          onChange={(event) => updateField("description", event.target.value)}
          className="min-h-32 w-full rounded-xl border bg-background px-3 py-3 text-sm"
          placeholder="Describe responsibilities, expectations, and outcomes."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="role" className="flex items-center gap-2">
            <Building2 size={16} />
            Department / Role
          </Label>
          <Input
            id="role"
            value={formState.role}
            onChange={(event) => updateField("role", event.target.value)}
            placeholder="Design"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salary" className="flex items-center gap-2">
            <DollarSign size={16} />
            Salary
          </Label>
          <Input
            id="salary"
            type="number"
            value={formState.salary}
            onChange={(event) => updateField("salary", event.target.value)}
            placeholder="1200000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="openings" className="flex items-center gap-2">
            <Users size={16} />
            Openings
          </Label>
          <Input
            id="openings"
            type="number"
            value={formState.openings}
            onChange={(event) => updateField("openings", event.target.value)}
            placeholder="3"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin size={16} />
            Location
          </Label>
          <Input
            id="location"
            value={formState.location}
            onChange={(event) => updateField("location", event.target.value)}
            placeholder="Bengaluru"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock3 size={16} />
            Job Type
          </Label>
          <Select
            value={formState.job_type}
            onValueChange={(value) => updateField("job_type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Laptop size={16} />
            Work Model
          </Label>
          <Select
            value={formState.work_location}
            onValueChange={(value) => updateField("work_location", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select work model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="On-site">On-site</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={formState.is_active ? "true" : "false"}
            onValueChange={(value) => updateField("is_active", value === "true")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;

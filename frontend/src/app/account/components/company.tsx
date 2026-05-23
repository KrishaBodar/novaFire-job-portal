"use client";

import { useAppData } from "@/context/AppContext";
import {
  getErrorMessage,
} from "@/lib/api";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Loading from "@/components/loading";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Building2,
  Eye,
  FileText,
  Globe,
  Image as ImageIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Company as CompanyType } from "@/type";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { jobApi } from "@/lib/http";

const Company = () => {
  const { loading } = useAppData();

  const addRef = useRef<HTMLButtonElement | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const [companyLoading, setCompanyLoading] = useState(true);

  const clearData = () => {
    setName("");
    setDescription("");
    setWebsite("");
    setLogo(null);
  };

  async function fetchCompanies() {
    try {
      const { data } = await jobApi.get(`/api/job/company/all`);

      setCompanies(data);
    } catch (error) {
      console.log(getErrorMessage(error, "Unable to fetch companies"));
    } finally {
      setCompanyLoading(false);
    }
  }

  async function addCompanyHandler() {
    if (!name || !description || !website || !logo) {
      toast.error("Please provide all company details");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("website", website);
    formData.append("file", logo);

    try {
      setBtnLoading(true);
      const { data } = await jobApi.post(`/api/job/company/new`, formData);

      toast.success(data.message);
      clearData();
      addRef.current?.click();
      await fetchCompanies();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to add company"));
    } finally {
      setBtnLoading(false);
    }
  }

  async function deleteCompany(id: number) {
    try {
      setBtnLoading(true);
      const { data } = await jobApi.delete(`/api/job/company/${id}`);

      toast.success(data.message);
      await fetchCompanies();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete company"));
    } finally {
      setBtnLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchCompanies();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Card className="overflow-hidden border-0 bg-card/90 shadow-xl ring-1 ring-black/5">
        <div className="border-b bg-slate-950 p-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Building2 size={20} />
                </div>
                <CardTitle className="text-2xl text-white">
                  My Companies
                </CardTitle>
              </div>
              <CardDescription className="text-white/70">
                Manage your employer profiles and publish roles faster.
              </CardDescription>
            </div>

            {companies.length < 3 && (
              <Button
                onClick={() => addRef.current?.click()}
                className="gap-2 bg-white text-slate-900 hover:bg-white/90"
              >
                <Plus size={18} />
                Add Company
              </Button>
            )}
          </div>
        </div>

        {companyLoading ? (
          <Loading />
        ) : (
          <div className="p-6">
            {companies.length > 0 ? (
              <div className="grid gap-4">
                {companies.map((company) => (
                  <div
                    key={company.company_id}
                    className="flex flex-col gap-4 rounded-2xl border bg-background/80 p-5 md:flex-row md:items-center"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-background ring-1 ring-black/10">
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 text-lg font-semibold">{company.name}</h3>
                      <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                        {company.description}
                      </p>
                      <a
                        href={company.website}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                      >
                        <Globe size={12} />
                        {company.website}
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/company/${company.company_id}`}>
                        <Button variant="outline" size="icon" className="h-10 w-10">
                          <Eye size={16} />
                        </Button>
                      </Link>

                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-10 w-10"
                        disabled={btnLoading}
                        onClick={() => void deleteCompany(company.company_id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <Building2 size={32} className="opacity-40" />
                </div>
                <CardDescription className="text-base">
                  No companies registered yet
                </CardDescription>
                <p className="text-sm text-muted-foreground">
                  Add your first company to start posting jobs.
                </p>
              </div>
            )}
          </div>
        )}
      </Card>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="hidden" ref={addRef} />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Building2 className="text-blue-600" />
              Add New Company
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Briefcase size={16} />
                Company Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Acme Labs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText size={16} />
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Tell candidates what your company does"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe size={16} />
                Website
              </Label>
              <Input
                id="website"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo" className="flex items-center gap-2">
                <ImageIcon size={16} />
                Company Logo
              </Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setLogo(event.target.files?.[0] || null)
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              disabled={btnLoading}
              onClick={addCompanyHandler}
              className="w-full"
            >
              {btnLoading ? "Adding Company..." : "Add Company"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Company;

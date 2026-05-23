"use client";

import { AppContextType, Application, AppProviderProps, User } from "@/type";
import {
  authServiceUrl,
  getAuthHeaders,
  getAuthToken,
  getErrorMessage,
  jobServiceUrl,
  paymentServiceUrl,
  userServiceUrl,
  utilsServiceUrl,
} from "@/lib/api";
import { userApi } from "@/lib/http";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

export const utils_service = utilsServiceUrl;
export const auth_service = authServiceUrl;
export const user_service = userServiceUrl;
export const job_service = jobServiceUrl;
export const payment_service = paymentServiceUrl;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  async function fetchUser() {
    const headers = getAuthHeaders();

    if (!headers) {
      setUser(null);
      setIsAuth(false);
      setLoading(false);
      return;
    }

    try {
      const { data } = await userApi.get("/api/user/me", { headers });

      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.log(error);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfilePic(formData: FormData) {
    const headers = getAuthHeaders();

    if (!headers) {
      toast.error("Please login again");
      return;
    }

    setLoading(true);
    try {
      const { data } = await userApi.put("/api/user/update/pic", formData, {
        headers,
      });

      toast.success(data.message);
      await fetchUser();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to update profile picture"));
    } finally {
      setLoading(false);
    }
  }

  async function updateResume(formData: FormData) {
    const headers = getAuthHeaders();

    if (!headers) {
      toast.error("Please login again");
      return;
    }

    setLoading(true);
    try {
      const { data } = await userApi.put(
        "/api/user/update/resume",
        formData,
        { headers }
      );

      toast.success(data.message);
      await fetchUser();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to update resume"));
    } finally {
      setLoading(false);
    }
  }

  async function updateUser(name: string, phoneNumber: string, bio: string) {
    const headers = getAuthHeaders();

    if (!headers) {
      toast.error("Please login again");
      return;
    }

    setBtnLoading(true);
    try {
      const { data } = await userApi.put(
        "/api/user/update/profile",
        { name, phoneNumber, bio },
        { headers }
      );
      toast.success(data.message);
      await fetchUser();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to update profile"));
    } finally {
      setBtnLoading(false);
    }
  }

  async function logoutUser() {
    Cookies.remove("token");
    setUser(null);
    setIsAuth(false);
    toast.success("Logged out successfully");
  }

  async function addSkill(
    skill: string,
    setSkill: React.Dispatch<React.SetStateAction<string>>
  ) {
    const headers = getAuthHeaders();

    if (!headers) {
      toast.error("Please login again");
      return;
    }

    setBtnLoading(true);
    try {
      const { data } = await userApi.post(
        "/api/user/skill/add",
        { skillName: skill },
        { headers }
      );
      toast.success(data.message);
      setSkill("");
      await fetchUser();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to add skill"));
    } finally {
      setBtnLoading(false);
    }
  }

  async function removeSkill(skill: string) {
    const headers = getAuthHeaders();

    if (!headers) {
      toast.error("Please login again");
      return;
    }

    try {
      const { data } = await userApi.put(
        "/api/user/skill/delete",
        { skillName: skill },
        { headers }
      );
      toast.success(data.message);
      await fetchUser();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to remove skill"));
    }
  }

  async function applyJob(job_id: number) {
    const headers = getAuthHeaders();

    if (!headers) {
      toast.error("Please login again");
      return;
    }

    setBtnLoading(true);
    try {
      const { data } = await userApi.post(
        "/api/user/apply/job",
        { job_id },
        { headers }
      );

      toast.success(data.message);
      await fetchApplications();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to apply for job"));
    } finally {
      setBtnLoading(false);
    }
  }

  const [applications, setApplications] = useState<Application[]>([]);

  async function fetchApplications() {
    const headers = getAuthHeaders();

    if (!headers) {
      setApplications([]);
      return;
    }

    try {
      const { data } = await userApi.get("/api/user/application/all", {
        headers,
      });

      setApplications(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const bootstrapApp = async () => {
      const token = getAuthToken();

      if (!token) {
        setLoading(false);
        setApplications([]);
        return;
      }

      await fetchUser();
      await fetchApplications();
    };

    void bootstrapApp();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        btnLoading,
        setUser,
        isAuth,
        setIsAuth,
        setLoading,
        logoutUser,
        updateProfilePic,
        updateResume,
        updateUser,
        addSkill,
        removeSkill,
        applyJob,
        applications,
        fetchApplications,
      }}
    >
      {children}
      <Toaster />
    </AppContext.Provider>
  );
};

export const useAppData = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppData must be used within AppProvider");
  }
  return context;
};

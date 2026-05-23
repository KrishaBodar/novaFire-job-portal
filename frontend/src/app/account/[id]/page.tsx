"use client";
import { getErrorMessage } from "@/lib/api";
import { User } from "@/type";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "@/components/loading";
import Info from "../components/info";
import Skills from "../components/skills";
import { userApi } from "@/lib/http";

const UserAccount = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  async function fetchUser() {
    try {
      const { data } = await userApi.get(`/api/user/${id}`);

      setUser(data);
    } catch (error) {
      console.log(getErrorMessage(error, "Unable to load user profile"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchUser();
  }, [id]);

  if (loading) return <Loading />;
  return (
    <>
      {user && (
        <div className="w-[90%] md:w-[60%] m-auto">
          <Info user={user} isYourAccount={false} />
          {user.role === "jobseeker" && (
            <Skills user={user} isYourAccount={false} />
          )}
        </div>
      )}
    </>
  );
};

export default UserAccount;

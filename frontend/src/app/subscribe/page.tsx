"use client";

import useRazorpay from "@/components/scriptLoader";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAppData } from "@/context/AppContext";
import toast from "react-hot-toast";
import Loading from "@/components/loading";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Crown, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getErrorMessage,
} from "@/lib/api";
import { paymentApi } from "@/lib/http";

const SubscriptionPage = () => {
  const razorpayLoaded = useRazorpay();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setUser } = useAppData();

  const handleSubscribe = async () => {
    setLoading(true);

    try {
      const {
        data: { order, razorpayKey, isMock },
      } = await paymentApi.post(`/api/payment/checkout`, {});

      if (isMock) {
        toast.loading("Demo Mode: Processing mock payment...", { duration: 1500 });
        setTimeout(async () => {
          try {
            const { data } = await paymentApi.post(
              `/api/payment/verify`,
              {
                razorpay_order_id: order.id,
                razorpay_payment_id: "pay_mock_" + Math.random().toString(36).substring(2, 9),
                razorpay_signature: "mock_signature_valid",
                isMock: true,
              }
            );

            toast.success(data.message);
            setUser(data.updatedUser);
            router.push(`/payment/success/mock_${order.id}`);
          } catch (error) {
            toast.error(getErrorMessage(error, "Payment verification failed"));
          } finally {
            setLoading(false);
          }
        }, 1500);
        return;
      }

      if (!razorpayLoaded || !window.Razorpay) {
        toast.error("Payment gateway is still loading. Please try again.");
        setLoading(false);
        return;
      }

      const options = {
        key:
          razorpayKey ||
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
          "rzp_test_RaL8PDo9YBejEW",
        amount: order.amount,
        currency: order.currency,
        name: "NovaHire Premium",
        description: "Priority application subscription",
        order_id: order.id,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const { data } = await paymentApi.post(
              `/api/payment/verify`,
              response
            );

            toast.success(data.message);
            setUser(data.updatedUser);
            router.push(`/payment/success/${response.razorpay_payment_id}`);
          } catch (error) {
            toast.error(getErrorMessage(error, "Payment verification failed"));
          } finally {
            setLoading(false);
          }
        },
        theme: {
          color: "#0f172a",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setLoading(false);
      toast.error(getErrorMessage(error, "Unable to start checkout"));
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff8ef_0%,#f6f7fb_45%,#ffffff_100%)] px-4 py-12 dark:bg-[radial-gradient(circle_at_top,#1f2937_0%,#0f172a_45%,#020617_100%)]">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] bg-[linear-gradient(145deg,#111827_0%,#0f3c80_40%,#14b8a6_100%)] p-8 text-white shadow-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
            <Sparkles size={16} />
            Premium Candidate Advantage
          </div>

          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Stand out in every recruiter inbox.
          </h1>
          <p className="max-w-2xl text-base text-white/80 md:text-lg">
            Upgrade to premium to push your applications higher, unlock faster
            responses, and make your profile more discoverable.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <Zap className="mb-3 text-amber-300" size={22} />
              <h3 className="mb-2 font-semibold">Priority visibility</h3>
              <p className="text-sm text-white/75">
                Your application appears earlier for participating recruiters.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <ArrowRight className="mb-3 text-cyan-300" size={22} />
              <h3 className="mb-2 font-semibold">Faster momentum</h3>
              <p className="text-sm text-white/75">
                Reduce waiting time and move from application to interview
                quicker.
              </p>
            </div>
          </div>
        </div>

        <Card className="border-0 bg-card/90 p-8 shadow-2xl ring-1 ring-black/5">
          <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/30 dark:text-amber-200">
            <Crown size={32} />
          </div>

          <h2 className="mb-2 text-3xl font-bold">Premium Subscription</h2>
          <p className="mb-8 text-sm text-muted-foreground">
            A simple monthly plan for serious job seekers.
          </p>

          <div className="mb-8 rounded-3xl bg-slate-950 p-6 text-white">
            <p className="text-sm text-white/70">Monthly price</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-5xl font-bold">Rs. 119</span>
              <span className="pb-1 text-white/70">/ month</span>
            </div>
          </div>

          <div className="mb-8 space-y-4">
            {[
              "Applications can be surfaced earlier to recruiters",
              "Better visibility in competitive hiring pipelines",
              "Priority support for billing and subscription issues",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <CheckCircle
                  size={20}
                  className="mt-0.5 shrink-0 text-green-600"
                />
                <p className="text-sm text-muted-foreground">{feature}</p>
              </div>
            ))}
          </div>

          <Button onClick={handleSubscribe} className="h-12 w-full text-base">
            Subscribe Now
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPage;

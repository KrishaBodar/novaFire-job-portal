import axios from "axios";
import Cookies from "js-cookie";

export const utilsServiceUrl =
  process.env.NEXT_PUBLIC_UTILS_SERVICE_URL ?? "http://localhost:5001";
export const authServiceUrl =
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL ?? "http://localhost:5000";
export const userServiceUrl =
  process.env.NEXT_PUBLIC_USER_SERVICE_URL ?? "http://localhost:5002";
export const jobServiceUrl =
  process.env.NEXT_PUBLIC_JOB_SERVICE_URL ?? "http://localhost:5003";
export const paymentServiceUrl =
  process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL ?? "http://localhost:5004";

type ApiErrorResponse = {
  message?: string;
};

export const getAuthToken = () => Cookies.get("token");

export const getAuthHeaders = () => {
  const token = getAuthToken();

  if (!token) {
    return undefined;
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const formatCurrency = (amount: number | string | null | undefined) => {
  if (amount === null || amount === undefined || amount === "") {
    return "Not disclosed";
  }

  const numericAmount =
    typeof amount === "number" ? amount : Number.parseFloat(amount);

  if (Number.isNaN(numericAmount)) {
    return "Not disclosed";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

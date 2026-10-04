import axios from "axios";
import Cookies from "js-cookie";

const getServiceUrl = (
  envUrl: string | undefined,
  productionFallback: string,
  localPort: number
) => {
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
      return envUrl;
    }
    return productionFallback;
  }
  return envUrl || `http://localhost:${localPort}`;
};

export const utilsServiceUrl = getServiceUrl(
  process.env.NEXT_PUBLIC_UTILS_SERVICE_URL,
  "https://novafire-job-portal-utils.onrender.com",
  5001
);
export const authServiceUrl = getServiceUrl(
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
  "https://novafire-job-portal-auth.onrender.com",
  5000
);
export const userServiceUrl = getServiceUrl(
  process.env.NEXT_PUBLIC_USER_SERVICE_URL,
  "https://novafire-job-portal-user.onrender.com",
  5002
);
export const jobServiceUrl = getServiceUrl(
  process.env.NEXT_PUBLIC_JOB_SERVICE_URL,
  "https://novafire-job-portal-job.onrender.com",
  5003
);
export const paymentServiceUrl = getServiceUrl(
  process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL,
  "https://novafire-job-portal-payment.onrender.com",
  5004
);

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

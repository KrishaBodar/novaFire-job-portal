import axios from "axios";
import Cookies from "js-cookie";
import {
  authServiceUrl,
  jobServiceUrl,
  paymentServiceUrl,
  userServiceUrl,
  utilsServiceUrl,
} from "./api";

const createClient = (baseURL: string) => {
  const client = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 10000,
  });

  client.interceptors.request.use((config) => {
    const token = Cookies.get("token");

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  return client;
};

export const authApi = createClient(authServiceUrl);
export const userApi = createClient(userServiceUrl);
export const jobApi = createClient(jobServiceUrl);
export const paymentApi = createClient(paymentServiceUrl);
export const utilsApi = createClient(utilsServiceUrl);

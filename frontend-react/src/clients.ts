import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const commonConfig = {
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

export const publicApi = axios.create(commonConfig);
export const privateApi = axios.create(commonConfig);

privateApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API_URL;

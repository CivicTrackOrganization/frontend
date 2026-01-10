import axios from "axios";
import type { Report, CreateReportRequest } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const getReport = async (reportID: string): Promise<Report> => {
  const res = await axios.get<Report>(`${API_URL}/reports/${reportID}`);
  return res.data;
};

export const createReport = async (
  report: CreateReportRequest,
  image: File | null
): Promise<Report> => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Authentication required: No accessToken found.");
  }

  const formData = new FormData();

  Object.entries(report).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  if (image) {
    formData.append("image", image);
  }

  const res = await axios.post<Report>(`${API_URL}/reports/`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const getReports = async (): Promise<Report[]> => {
  const res = await axios.get<Report[]>(`${API_URL}/reports/`);
  return res.data;
};

export const getMyReports = async (): Promise<Report[]> => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Authentication required: No accessToken found.");
  }
  const res = await axios.get<Report[]>(`${API_URL}/reports/me/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
};

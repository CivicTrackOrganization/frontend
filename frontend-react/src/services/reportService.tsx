import { privateApi } from "../clients";
import type { CreateReportRequest, Report, ReportDetailed } from "../types";

export const getReport = async (reportId: number): Promise<ReportDetailed> => {
  const res = await privateApi.get(`/reports/${reportId}/`);
  return res.data;
};

export const createReport = async (
  report: CreateReportRequest,
  image: File | null
): Promise<Report> => {
  const formData = new FormData();

  Object.entries(report).forEach(([key, value]) => {
    // Skip latitude and longitude, we'll send them as coordinates
    if (key === "latitude" || key === "longitude") {
      return;
    }
    
    if (value !== undefined) {
      formData.append(key, String(value));
    }
  });

  // Send coordinates as individual array elements if both are present
  if (report.latitude !== undefined && report.longitude !== undefined) {
    formData.append("coordinates[0]", String(report.longitude));
    formData.append("coordinates[1]", String(report.latitude));
  }

  if (image) {
    formData.append("image", image);
  }

  try {
    const res = await privateApi.post<Report>("/reports/", formData, {
      headers: {
        "Content-Type": undefined,
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("Backend error response:", error.response?.data);
    throw error;
  }
};

export const getReports = async (): Promise<Report[]> => {
  const res = await privateApi.get<Report[]>("/reports/");
  return res.data;
};

export const getMyReports = async (): Promise<Report[]> => {
  const res = await privateApi.get<Report[]>("/reports/me/");
  return res.data;
};

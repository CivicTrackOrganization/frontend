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
    formData.append(key, value);
  });

  if (image) {
    formData.append("image", image);
  }

  const res = await privateApi.post<Report>("/reports/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getReports = async (): Promise<Report[]> => {
  const res = await privateApi.get<Report[]>("/reports/");
  return res.data;
};

export const getMyReports = async (): Promise<Report[]> => {
  const res = await privateApi.get<Report[]>("/reports/me/");
  return res.data;
};

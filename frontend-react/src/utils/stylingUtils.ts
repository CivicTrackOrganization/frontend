import type { PriorityType, StatusType } from "../types";

export const findReportStatusStyle = (status: StatusType) => {
  switch (status) {
    case "in_progress":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "new":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "resolved":
      return "bg-green-100 text-green-800 border-green-200";
  }
};

export const findPriorityStyle = (priority: PriorityType) => {
  switch (priority) {
    case "low":
      return "text-green-700 bg-green-100";
    case "normal":
      return "text-amber-700 bg-amber-100";
    case "high":
      return "text-red-700 bg-red-100";
  }
};

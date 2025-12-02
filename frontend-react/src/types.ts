export type StatusType = "New" | "In Progress" | "Resolved" | "Rejected";

export type PriorityType = "Low" | "Normal" | "High";

export type ReportType = "infrastructure" | "safety" | "environment" | "other";

export type AssignedUnit =
  | "maintenance"
  | "police"
  | "environmental"
  | "general";

export interface Report {
  reportID: string;
  title: string;
  description: string;
  location: string;
  priority: PriorityType;
  status: StatusType;
  author: string;
  reportType: ReportType;
  assignedUnit: AssignedUnit;
  createdAt: Date;
}

export type UserRole = "user" | "moderator" | "admin";

export interface User {
  username: string;
  reputation: number;
  reports: number;
  role: UserRole;
}

export interface GlobalStats {
  totalReports: number;
  resolvedReports: number;
}

export interface CreateReportRequest {
  title: string;
  description: string;
  location: string;
  priority: PriorityType;
  reportType: ReportType;
  assignedUnit: AssignedUnit; // TODO remove in the future, it should be assigned by moderator instead
}

export function createReportRequest(
  createReportRequest: CreateReportRequest
): Report {
  const response: Report = {
    reportID: crypto.randomUUID(),
    title: createReportRequest.title,
    description: createReportRequest.description,
    location: createReportRequest.location,
    priority: createReportRequest.priority,
    status: "New",
    author: "Paweł Kowalski",
    reportType: createReportRequest.reportType,
    assignedUnit: createReportRequest.assignedUnit,
    createdAt: new Date(),
  };
  return response;
}

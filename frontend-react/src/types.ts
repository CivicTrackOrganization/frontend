export type StatusType = "new" | "in_progress" | "resolved" | "rejected";

export type PriorityType = "low" | "normal" | "high";

export type ReportType = "infrastructure" | "safety" | "environment" | "other";

export type AssignedUnit =
  | "maintenance"
  | "police"
  | "environmental"
  | "general";

export interface Report {
  id: string;
  title: string;
  description: string;
  location: string;
  priority: PriorityType;
  status: StatusType;
  author: string;
  type: ReportType;
  assignedUnit: AssignedUnit;
  createdAt: string;
}

export type UserRole = "user" | "moderator" | "admin";

export interface User {
  username: string;
  reputation: number;
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
  type: ReportType;
}
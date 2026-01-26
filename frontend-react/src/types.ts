export type StatusType = "new" | "in_progress" | "resolved" | "rejected";

export type PriorityType = "low" | "normal" | "high";

export type ReportType = "infrastructure" | "safety" | "environment" | "other";

export type AssignedUnit =
  | "maintenance"
  | "police"
  | "environmental"
  | "general";

export interface Report {
  id: number;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  userVoteType: number | null;
  commentCount: number;
  image: string | null;
  location: string;
  priority: PriorityType;
  status: StatusType;
  author: string;
  type: ReportType;
  assignedUnit: AssignedUnit;
  createdAt: string;
  latitude?: number;
  longitude?: number;
}

export interface Comment {
  id: number;
  report: number;
  content: string;
  isOfficialResponse: boolean;
  createdAt: string;
  createdBy: string;
  authorId: number;
}

export interface CommentCreationRequest {
  report: number;
  content: string;
}

export interface ReportDetailed extends Report {
  comments: Array<Comment>;
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
  latitude?: number;
  longitude?: number;
}

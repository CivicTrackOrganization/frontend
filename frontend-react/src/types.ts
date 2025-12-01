export type StatusType = 'New' | 'In Progress' | 'Resolved' | 'Rejected';

export type PriorityType = 'Low' | 'Normal' | 'High';

export type ReportType = 'infrastructure' | 'safety' | 'environment' | 'other';

export type AssignedUnit = 'maintenance' | 'police' | 'environmental' | 'general';

export interface Report {
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

export type UserRole = 'user' | 'moderator' | 'admin';

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

export interface CreateReportRequest extends Report {}

export function createReportRequest(user: User): CreateReportRequest {
  return {
    title: "",
    description: "",
    location: "",
    priority: "Normal",
    status: "New",
    author: user.username,
    reportType: "other",
    assignedUnit: "general",
    createdAt: new Date(),
  } as CreateReportRequest;
}

export function createReportRequestFromPartial(user: User, partial: Partial<Report>): CreateReportRequest {
  const base = createReportRequest(user);
  return { ...base, ...partial, createdAt: new Date() } as CreateReportRequest;
}
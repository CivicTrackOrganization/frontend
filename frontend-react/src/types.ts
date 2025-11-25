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

export class CreateReportRequest {
  report: Report;

  constructor(user: User) {
    this.report = {} as Report;
    this.report.title = "";
    this.report.description = "";
    this.report.location = "";
    this.report.priority = "Normal";
    this.report.status = "New";
    this.report.author = user.username;
    this.report.reportType = "other";
    this.report.assignedUnit = "general";
    this.report.createdAt = new Date();
  }
}
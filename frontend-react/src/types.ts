export interface Report {
  title: string;
  description: string;
  location: string;
  priority: string;
  status: string;
  author?: string;
}

export interface User {
  username: string;
  reputation: number;
  reports: number;
  isModerator: boolean;
}

export interface GlobalStats {
  totalReports: number;
  resolvedReports: number;
}
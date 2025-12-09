import ReportItem from "./ReportItem";
import type { Report } from "../types";

interface ReportsListProps {
  reports: Report[];
  title?: string;
  isLoading?: boolean;
}

function ReportsList({ reports, title = "Reports in your area", isLoading = false }: ReportsListProps) {
  return (
    <div className="h-full bg-white shadow-sm rounded-xl">
      <div className="px-4 py-3 border-b">
        <h2 className="font-semibold">{title}</h2>
        <p className="text-xs text-gray-500">Confirm and comment on reports from other users</p>
      </div>
      <div className="p-4 overflow-y-auto h-72">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading reports...</p>
          </div>
        ) : reports.length > 0 ? (
          reports.map((report) => (
            <ReportItem key={report.reportID} report={report} />
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No reports found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportsList;
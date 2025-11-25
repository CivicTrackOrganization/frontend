import ReportItem from "./ReportItem";
import type { Report } from "../types";

interface ReportsListProps {
  reports: Report[];
  title?: string;
}

function ReportsList({ reports, title = "Reports in your area" }: ReportsListProps) {
  return (
    <div className="h-full bg-white shadow-sm rounded-xl">
      <div className="px-4 py-3 border-b">
        <h2 className="font-semibold">{title}</h2>
        <p className="text-xs text-gray-500">Confirm and comment on reports from other users</p>
      </div>
      <div className="p-4 overflow-y-auto h-72">
        {reports.map((report, index) => (
          <ReportItem key={index} report={report} />
        ))}
      </div>
    </div>
  );
}

export default ReportsList;
import type { Report } from "../types";

interface ReportItemProps {
  report: Report;
}

function ReportItem({ report }: ReportItemProps) {
  return (
    <div className="p-4 mb-3 bg-white rounded-lg shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block px-2 py-0.5 text-xs text-gray-700 bg-gray-100 rounded">
              {report.type}
            </span>
            <span className="inline-block px-2 py-0.5 text-xs text-red-700 bg-red-100 rounded">
              {report.priority}
            </span>
          </div>
          <p className="font-semibold">{report.title}</p>
          <p className="text-sm text-gray-600">{report.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span>{report.location}</span>
            <span>{report.createdAt}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="px-3 py-1 text-xs text-yellow-800 bg-yellow-100 rounded">
            {report.status}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ReportItem;

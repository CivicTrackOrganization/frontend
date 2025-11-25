import type {Report} from "../types";
function ModeratorPanel({ reports, onApprove, onReject }: { reports: Report[]; onApprove: (i: number) => void; onReject: (i: number) => void; }) {
  return (
    <div className="h-full bg-white shadow-sm rounded-xl">
      <div className="px-4 py-3 border-b">
        <h2 className="font-semibold">Moderator Panel</h2>
        <p className="text-xs text-gray-500">Review and moderate incoming reports</p>
      </div>
      <div className="p-4 space-y-3 overflow-y-auto h-72">
        {reports.map((report, index) => (
          <div key={index} className="p-3 border rounded-md bg-gray-50">
            <p className="font-medium">{report.title}</p>
            <p className="text-sm text-gray-600">{report.description}</p>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={() => onApprove(index)} className="px-3 py-1 text-sm text-white bg-green-600 rounded cursor-pointer">Approve</button>
              <button onClick={() => onReject(index)} className="px-3 py-1 text-sm text-white bg-red-600 rounded cursor-pointer">Reject</button>
              <span className="ml-auto text-xs text-gray-500">{report.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModeratorPanel;
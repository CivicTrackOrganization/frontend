import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { PiChatCircle } from "react-icons/pi";
import { useReportVotes } from "../hooks/useReportVotes";
import type { Report } from "../types";
import clsx from "clsx";
import { displayDate } from "../utils/dateUtils";

interface ReportItemProps {
  report: Report;
  onClick: () => void;
}

function ReportItem({ report, onClick }: ReportItemProps) {
  const { handleVoteAction, isPending } = useReportVotes(report.id);

  return (
    <div
      className="p-4 mb-3 bg-white rounded-lg shadow-sm min-h-42 h-42 cursor-pointer hover:scale-[101%] transition-transform hover:shadow-md"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 h-3/4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block px-2 py-0.5 text-xs text-gray-700 bg-gray-100 rounded capitalize">
              {report.type}
            </span>
            <span className="inline-block px-2 py-0.5 text-xs text-red-700 bg-red-100 rounded capitalize">
              {report.priority}
            </span>
          </div>
          <p className="font-semibold">{report.title}</p>
          <p className="text-sm text-gray-600">{report.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span>{report.location}</span>
            <span>{displayDate(report.createdAt)}</span>
          </div>
        </div>
        <div className="flex flex-col justify-between items-end gap-2 h-full">
          <span className="px-3 py-1 text-xs text-yellow-800 bg-yellow-100 rounded capitalize">
            {report.status.replace("_", " ")}
          </span>
          <span className="py-1 text-xs text-gray-500">
            Author: {report.author}
          </span>
        </div>
      </div>
      <div className="border-t border-t-gray-200 w-full mt-2 pt-2 flex justify-between items-center h-1/4">
        <div className="flex gap-5">
          <button
            className={clsx(
              "flex items-center gap-1 text-green-800 cursor-pointer hover:bg-green-50 transition-colors px-2 py-1 rounded-md",
              report.userVoteType === 1 && "bg-green-50",
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleVoteAction(report.userVoteType, 1);
            }}
            disabled={isPending}
          >
            <FaRegThumbsUp />
            <span className="text-sm">{report.votesFor}</span>
          </button>
          <button
            className={clsx(
              "flex items-center gap-1 text-red-600 cursor-pointer hover:bg-red-50 transition-colors px-2 py-1 rounded-md",
              report.userVoteType === -1 && "bg-red-50",
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleVoteAction(report.userVoteType, -1);
            }}
            disabled={isPending}
          >
            <FaRegThumbsDown />
            <span className="text-sm">{report.votesAgainst}</span>
          </button>
        </div>
        <div className="bg-blue-50 py-1 px-2 rounded-md flex items-center gap-2">
          <PiChatCircle />
          <span className="text-sm">{report.commentCount}</span>
        </div>
      </div>
    </div>
  );
}

export default ReportItem;

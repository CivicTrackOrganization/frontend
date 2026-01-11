import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { FaRegThumbsDown, FaRegThumbsUp, FaTimes } from "react-icons/fa";
import { getReport } from "../services/reportService";
import CommentSection from "./CommentSection";

interface ReportDetailsProps {
  reportId: number;
  onClose: () => void;
}

const ReportDetails = ({ reportId, onClose }: ReportDetailsProps) => {
  const {
    data: report,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => getReport(reportId),
    queryKey: ["report", reportId],
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  });

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white w-3/4 p-3 rounded-md"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {isLoading ? (
          <p>Loading details...</p>
        ) : isError || !report ? (
          <p>Failed to fetch details...</p>
        ) : (
          <>
            <header className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">{report.title}</span>
                <FaTimes
                  onClick={onClose}
                  className="cursor-pointer hover:opacity-70"
                />
              </div>
              <div className="flex gap-2 text-xs capitalize mt-1 mb-3">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 font-semibold rounded-xl">
                  {report.status}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 font-semibold rounded-xl">
                  {report.type}
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-800 font-semibold rounded-xl">
                  {report.priority}
                </span>
              </div>
            </header>
            <section className="border-y border-y-gray-300 py-3">
              {report.image && (
                <img className="shadow-md mb-2" src={report.image} />
              )}
              <span className="text-lg text-gray-600">
                {report.description}
              </span>
              <div className="flex flex-col text-md my-2">
                <span className="text-md text-gray-500">
                  Author: {report.author}
                </span>
                <span className="text-md text-gray-500">{report.location}</span>
                <span className="text-md text-gray-500">
                  {report.createdAt}
                </span>
              </div>
              <div className="flex gap-3 my-2 text-sm">
                <button className="flex justify-center items-center gap-1 text-green-600 border border-green-300 px-2 py-1 rounded-md cursor-pointer hover:bg-green-50 transition-colors">
                  <FaRegThumbsUp />
                  <span>Agreed {report.votesFor}</span>
                </button>
                <button className="flex justify-center items-center gap-1 text-red-600 border border-red-300 px-2 py-1 rounded-md cursor-pointer hover:bg-red-50 transition-colors">
                  <FaRegThumbsDown />
                  <span>Disputed {report.votesAgainst}</span>
                </button>
              </div>
            </section>
            <CommentSection comments={report.comments} />
          </>
        )}
      </div>
    </div>
  );
};

export default ReportDetails;

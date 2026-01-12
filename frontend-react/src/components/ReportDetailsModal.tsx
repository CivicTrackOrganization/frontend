import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  FaMapMarkerAlt,
  FaRegClock,
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { useReportVotes } from "../hooks/useReportVotes";
import { createComment } from "../services/commentService";
import { getReport } from "../services/reportService";
import type { CommentCreationRequest } from "../types";
import CommentSection from "./CommentSection";
import { displayDate } from "../utils/dateUtils";
import clsx from "clsx";

interface ReportDetailsProps {
  reportId: number;
  userId: number;
  onClose: () => void;
}

const ReportDetails = ({ reportId, userId, onClose }: ReportDetailsProps) => {
  const queryClient = useQueryClient();

  const {
    data: report,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => getReport(reportId),
    queryKey: ["report", reportId],
  });

  const { handleVoteAction, isPending: isVotePending } =
    useReportVotes(reportId);

  const commentCreationMutation = useMutation({
    mutationFn: ({ report, content }: CommentCreationRequest) =>
      createComment({ report, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report", reportId] });
    },
    onError: () => {
      toast.error("Failed to add comment. Please try again.");
    },
  });

  const sendComment = (content: string) => {
    if (commentCreationMutation.isPending) return;

    const request: CommentCreationRequest = {
      content,
      report: reportId,
    };

    commentCreationMutation.mutate(request);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white w-2/3 p-3 rounded-md max-h-200 h-3/4"
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
            <header className="flex justify-between items-center h-1/12">
              <span className="text-xl font-semibold">{report.title}</span>
              <FaTimes
                onClick={onClose}
                className="cursor-pointer hover:text-gray-500 transition-colors"
              />
            </header>
            <div className="h-11/12 overflow-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent hover:scrollbar-thumb-gray-200 transition-colors duration-300">
              <div className="flex gap-2 text-xs capitalize">
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
              <section className="border-b border-b-gray-300 py-3">
                {report.image && (
                  <img
                    className="w-full h-full object-cover mb-2"
                    src={report.image}
                    alt={report.title || "Report image"}
                  />
                )}
                <span className="text-lg text-gray-600">
                  {report.description}
                </span>
                <div className="flex flex-col gap-1 text-md my-3">
                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    <FaUser />
                    <span>Author: {report.author}</span>
                  </span>
                  <span className="flex justify-start items-center gap-2 text-sm text-gray-500">
                    <FaMapMarkerAlt />
                    <span>{report.location}</span>
                  </span>
                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    <FaRegClock />
                    <span>{displayDate(report.createdAt)}</span>
                  </span>
                </div>
                <div className="flex gap-3 my-2 text-sm">
                  <button
                    className={clsx(
                      "flex justify-center items-center gap-1 text-green-600 border border-green-300 px-2 py-1 rounded-md cursor-pointer hover:bg-green-50 transition-colors",
                      report.userVoteType === 1 && "bg-green-50"
                    )}
                    onClick={() => handleVoteAction(report.userVoteType, 1)}
                    disabled={isVotePending}
                  >
                    <FaRegThumbsUp />
                    <span>Agreed {report.votesFor}</span>
                  </button>
                  <button
                    className={clsx(
                      "flex justify-center items-center gap-1 text-red-600 border border-red-300 px-2 py-1 rounded-md cursor-pointer hover:bg-red-50 transition-colors",
                      report.userVoteType === -1 && "bg-red-50"
                    )}
                    onClick={() => handleVoteAction(report.userVoteType, -1)}
                    disabled={isVotePending}
                  >
                    <FaRegThumbsDown />
                    <span>Disputed {report.votesAgainst}</span>
                  </button>
                </div>
              </section>
              <CommentSection
                comments={report.comments}
                onCommentSend={sendComment}
                userId={userId}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportDetails;

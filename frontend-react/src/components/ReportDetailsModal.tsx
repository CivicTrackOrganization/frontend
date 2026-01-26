import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  FaCalendar,
  FaHistory,
  FaMapMarkerAlt,
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { useReportVotes } from "../hooks/useReportVotes";
import { createComment } from "../services/commentService";
import { getReport, getReportStatusHistory } from "../services/reportService";
import type { CommentCreationRequest } from "../types";
import { displayDate } from "../utils/dateUtils";
import CommentSection from "./CommentSection";
import ModeratorReportManagementSection from "./ModeratorReportManagementSection";

interface ReportDetailsProps {
  reportId: number;
  userId: number;
  isUserModerator: boolean;
  onClose: () => void;
}

const ReportDetails = ({
  reportId,
  userId,
  isUserModerator,
  onClose,
}: ReportDetailsProps) => {
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

  const { data: reportStatusHistory } = useQuery({
    queryFn: getReportStatusHistory,
    queryKey: ["reportStatusHistory", reportId],
  });

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
        className="bg-white w-2/3 p-3 rounded-md h-3/4"
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
            <div className="h-11/12 overflow-scroll modal-scroll transition-colors duration-300">
              <div className="flex gap-2 text-xs capitalize">
                <span className="px-2 py-1 bg-gray-100 text-gray-800 font-semibold rounded-xl">
                  {report.type}
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-800 font-semibold rounded-xl">
                  {report.priority}
                </span>
                {report.assignedUnit && (
                  <span className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full border border-gray-200 dark:border-gray-600 flex items-center gap-1">
                    Assigned: <strong>{report.assignedUnit}</strong>
                  </span>
                )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm my-3">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-gray-400" />
                    <span>
                      Author: <strong>{report.author}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-gray-400" />
                    <span>{displayDate(report.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>{report.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaHistory className="text-gray-400" />
                    <span>
                      Updated:{" "}
                      {reportStatusHistory?.length
                        ? displayDate(
                            reportStatusHistory[reportStatusHistory.length - 1]
                              .modifiedAt,
                          )
                        : "Unknown"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 my-2 text-sm">
                  <button
                    className={clsx(
                      "flex justify-center items-center gap-1 text-green-600 border border-green-300 px-2 py-1 rounded-md cursor-pointer hover:bg-green-50 transition-colors",
                      report.userVoteType === 1 && "bg-green-50",
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
                      report.userVoteType === -1 && "bg-red-50",
                    )}
                    onClick={() => handleVoteAction(report.userVoteType, -1)}
                    disabled={isVotePending}
                  >
                    <FaRegThumbsDown />
                    <span>Disputed {report.votesAgainst}</span>
                  </button>
                </div>
              </section>
              {isUserModerator && (
                <ModeratorReportManagementSection reportId={reportId} />
              )}
              {reportStatusHistory && (
                <div className="my-2">
                  <h3 className="text-lg font-semibold text-text-main-light mb-6">
                    Status changes history
                  </h3>
                  {[...reportStatusHistory]
                    .reverse()
                    .map((reportStatus, index) => (
                      <div
                        key={index}
                        className="relative border-l-2 border-gray-200 ml-3 space-y-8 pb-4"
                      >
                        <div className="relative pl-8">
                          <div
                            className={clsx(
                              "absolute -left-[9px] top-0 w-4 h-4 rounded-full ring-4 ring-white",
                              {
                                "bg-amber-300":
                                  reportStatus.statusName === "in_progress",
                                "bg-blue-300":
                                  reportStatus.statusName === "new",
                                "bg-red-300":
                                  reportStatus.statusName === "rejected",
                                "bg-green-300":
                                  reportStatus.statusName === "resolved",
                              },
                            )}
                          ></div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={clsx(
                                    "px-2 py-0.5 text-xs font-semibold rounded border",
                                    {
                                      "bg-blue-100 text-blue-800 border-blue-200":
                                        reportStatus.statusName === "new",
                                      "bg-amber-100 text-amber-800 border-amber-200":
                                        reportStatus.statusName ===
                                        "in_progress",
                                      "bg-red-100 text-red-800 border-red-800":
                                        reportStatus.statusName === "rejected",
                                      "bg-green-100 text-green-800 border-green-200":
                                        reportStatus.statusName === "resolved",
                                    },
                                  )}
                                >
                                  {reportStatus.statusName !== "in_progress"
                                    ? reportStatus.statusName
                                    : "in progress"}
                                </span>
                              </div>
                              <p className="text-sm font-medium">
                                {reportStatus.moderatorComment}
                              </p>
                              <p className="text-xs mt-1">
                                by {reportStatus.modifiedBy || report.author}
                              </p>
                            </div>
                            <span className="text-xs whitespace-nowrap">
                              {reportStatus.modifiedAt}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              <CommentSection
                comments={report.comments}
                onCommentSend={sendComment}
                userId={userId}
                isUserModerator={isUserModerator}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportDetails;

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaCalendar,
  FaHistory,
  FaMapMarkerAlt,
  FaRegFileAlt,
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { useReportVotes } from "../hooks/useReportVotes";
import { createComment } from "../services/commentService";
import { getReport, getReportStatusHistory } from "../services/reportService";
import type {
  AssignedUnit,
  CommentCreationRequest,
  StatusType,
} from "../types";
import { displayDate } from "../utils/dateUtils";
import CommentSection from "./CommentSection";
import {
  assignReportUnit,
  modifyReportStatus,
  publishOfficialResponse,
} from "../services/moderatorService";

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

  const changeStatusMutation = useMutation({
    mutationFn: () => modifyReportStatus(reportId, statusOption!),
    onSuccess: () => {
      toast.success("Successfully modified report status.");
      queryClient.invalidateQueries({ queryKey: ["report", reportId] });
      queryClient.invalidateQueries({
        queryKey: ["reportStatusHistory", reportId],
      });
    },
    onError: () => {
      toast.error("Failed to modify report status. Please try again.");
    },
  });

  const assignReportUnitMutation = useMutation({
    mutationFn: () => assignReportUnit(reportId, assignedUnit!),
    onSuccess: () => {
      toast.success("Successfully assigned report to the unit.");
      queryClient.invalidateQueries({ queryKey: ["report", reportId] });
    },
    onError: () => {
      toast.error("Failed to assign report to the unit. Please try again.");
    },
  });

  const sendOfficialResponse = useMutation({
    mutationFn: () =>
      publishOfficialResponse(reportId, officialResponseContent),
    onSuccess: () => {
      toast.success("Successfully published official response.");
      queryClient.invalidateQueries({ queryKey: ["report", reportId] });
    },
    onError: () => {
      toast.error("Failed to publish official response. Please try again.");
    },
  });

  const [statusOption, setStatusOption] = useState<StatusType | undefined>(
    undefined,
  );
  const [assignedUnit, setAssignedUnit] = useState<AssignedUnit | undefined>(
    undefined,
  );
  const [officialResponseContent, setOfficialResponseContent] =
    useState<string>("");

  const handleStatusOptionChanged = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newValue = e.target.value as StatusType;
    setStatusOption(newValue);
  };

  const handleAssignedUnitChanged = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newValue = e.target.value as AssignedUnit;
    setAssignedUnit(newValue);
  };

  const handleStatusOptionChangedEvent = () => {
    if (!statusOption || changeStatusMutation.isPending) return;
    changeStatusMutation.mutate();
  };

  const handleAssignedUnitEvent = () => {
    if (!assignedUnit || assignReportUnitMutation.isPending) return;
    assignReportUnitMutation.mutate();
  };

  const handleOfficialResponsePublishment = () => {
    if (!officialResponseContent || sendOfficialResponse.isPending) return;
    sendOfficialResponse.mutate();
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
            <div className="h-11/12 overflow-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent hover:scrollbar-thumb-gray-200 transition-colors duration-300">
              <div className="flex gap-2 text-xs capitalize">
                <span
                  className={clsx(
                    "px-2 py-1 bg-yellow-100 text-yellow-800 font-semibold rounded-xl",
                    {
                      "bg-yellow-100 text-yellow-800":
                        report.status === "in_progress",
                      "bg-red-100 text-red-800": report.status === "rejected",
                      "bg-blue-100 text-blue-800": report.status === "new",
                      "bg-green-100 text-green-800":
                        report.status === "resolved",
                    },
                  )}
                >
                  {report.status}
                </span>
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
                      {reportStatusHistory
                        ? displayDate(reportStatusHistory[0].modifiedAt)
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
              <section className="bg-blue-50 rounded-xl p-6 border border-blue-100 my-3">
                <h3 className="text-lg font-semibold mb-6">
                  Moderator actions
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <label className="text-sm font-medium md:col-span-1">
                      Modify status
                    </label>
                    <div className="md:col-span-3 flex gap-3">
                      <select
                        className={clsx(
                          "w-full bg-white border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-sm py-2.5",
                          statusOption ? "text-black" : "text-gray-400",
                        )}
                        value={statusOption}
                        onChange={handleStatusOptionChanged}
                      >
                        <option value="" disabled>
                          Select status...
                        </option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
                        onClick={handleStatusOptionChangedEvent}
                      >
                        Modify
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <label className="text-sm font-medium text-text-main-light md:col-span-1">
                      Assign to the unit
                    </label>
                    <div className="md:col-span-3 flex gap-3">
                      <select
                        className={clsx(
                          "flex-1 bg-white border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-sm py-2.5",
                          assignedUnit ? "text-black" : "text-gray-400",
                        )}
                        value={assignedUnit}
                        onChange={handleAssignedUnitChanged}
                      >
                        <option value="" disabled>
                          Select unit...
                        </option>
                        <option value="maintenance">Maintenance</option>
                        <option value="environmental">Environmental</option>
                        <option value="police">Police</option>
                        <option value="general">General</option>
                      </select>
                      <button
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
                        onClick={handleAssignedUnitEvent}
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                    <label className="text-sm font-medium text-text-main-light md:col-span-1 pt-2">
                      Official response
                    </label>
                    <div className="md:col-span-3 space-y-3">
                      <textarea
                        className="w-full bg-white border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-sm p-3"
                        placeholder="Add official response visible for all the users..."
                        value={officialResponseContent}
                        onChange={(e) =>
                          setOfficialResponseContent(e.target.value)
                        }
                        rows={4}
                      ></textarea>
                      <button
                        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
                        onClick={handleOfficialResponsePublishment}
                      >
                        <FaRegFileAlt />
                        Publish response
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              {reportStatusHistory && (
                <div>
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
                                    "px-2 py-0.5 text-xs font-semibold rounded borde",
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
                                    : "In Progress"}
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

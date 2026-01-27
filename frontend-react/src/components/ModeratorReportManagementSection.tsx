import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaRegFileAlt } from "react-icons/fa";
import { changeReportStatus } from "../services/moderatorService";
import type { AssignedUnit, ErrorWithDetails, StatusType } from "../types";
import type { AxiosError } from "axios";

interface ModeratorReportManagementSectionProps {
  reportId: number;
}

const ModeratorReportManagementSection = ({
  reportId,
}: ModeratorReportManagementSectionProps) => {
  const queryClient = useQueryClient();

  const sendModeratorAction = useMutation({
    mutationFn: () =>
      changeReportStatus(reportId, {
        status: statusOption!,
        comment: officialResponseContent,
        assignedUnit: assignedUnit,
      }),
    onSuccess: () => {
      toast.success("Successfully changed report status.");
      queryClient.invalidateQueries({
        queryKey: ["reportStatusHistory", reportId],
      });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (e: AxiosError<ErrorWithDetails>) => {
      if (e.response && e.response.status === 400)
        toast.error(e.response.data.detail);
      else toast.error("Failed to change report status.");
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

  const handleModeratorAction = () => {
    if (!statusOption) {
      toast.error("Please select a status option.");
      return;
    }

    if (!officialResponseContent.trim()) {
      toast.error("Please provide an official response.");
      return;
    }

    if (sendModeratorAction.isPending) return;
    sendModeratorAction.mutate();
  };

  return (
    <section className="bg-blue-50 rounded-xl p-6 border border-blue-100 my-3">
      <h3 className="text-lg font-semibold mb-6">Moderator actions</h3>
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
              value={statusOption || ""}
              onChange={handleStatusOptionChanged}
            >
              <option value="" disabled>
                Select status...
              </option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
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
              value={assignedUnit || ""}
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
              onChange={(e) => setOfficialResponseContent(e.target.value)}
              rows={4}
            ></textarea>
            <button
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
              onClick={handleModeratorAction}
            >
              <FaRegFileAlt />
              Publish
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModeratorReportManagementSection;

import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  assignReportUnit,
  modifyReportStatus,
  publishOfficialResponse,
} from "../services/moderatorService";
import type { AssignedUnit, StatusType } from "../types";
import clsx from "clsx";
import { FaRegFileAlt } from "react-icons/fa";

interface ModeratorReportManagementSectionProps {
  reportId: number;
}

const ModeratorReportManagementSection = ({
  reportId,
}: ModeratorReportManagementSectionProps) => {
  const queryClient = useQueryClient();

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
    if (!statusOption) toast.error("Please select a status before modifying");
    if (!statusOption || changeStatusMutation.isPending) return;
    changeStatusMutation.mutate();
  };

  const handleAssignedUnitEvent = () => {
    if (!assignedUnit) toast.error("Please select a unit before assigning");
    if (!assignedUnit || assignReportUnitMutation.isPending) return;
    assignReportUnitMutation.mutate();
  };

  const handleOfficialResponsePublishment = () => {
    if (!officialResponseContent.trim())
      toast.error("Official response content cannot be empty");
    if (!officialResponseContent || sendOfficialResponse.isPending) return;
    sendOfficialResponse.mutate();
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
              onChange={(e) => setOfficialResponseContent(e.target.value)}
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
  );
};

export default ModeratorReportManagementSection;

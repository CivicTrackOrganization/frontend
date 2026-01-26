import type { AssignedUnit, StatusType } from "../types";

export const modifyReportStatus = async (
  reportId: number,
  newStatus: StatusType,
) => {
  throw new Error(
    `modifyReportStatus not implemented for report ${reportId} (${newStatus})`,
  );
};
export const assignReportUnit = async (
  reportId: number,
  assignedUnit: AssignedUnit,
) => {
  throw new Error(
    `assignReportUnit not implemented for report ${reportId} (${assignedUnit})`,
  );
};
export const publishOfficialResponse = async (
  reportId: number,
  responseContent: string,
) => {
  throw new Error(
    `publishOfficialResponse not implemented for report ${reportId}: ${responseContent}`,
  );
};

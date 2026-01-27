import { privateApi } from "../clients";
import type { AssignedUnit, StatusType } from "../types";
export interface ChangeReportStatusRequest {
  status: StatusType;
  comment: string;
  assignedUnit?: AssignedUnit;
}

export const changeReportStatus = async (
  reportId: number,
  changeReportStatusRequest: ChangeReportStatusRequest,
) => {
  const formData = new FormData();
  formData.append("status", changeReportStatusRequest.status);
  formData.append("comment", changeReportStatusRequest.comment);
  if (changeReportStatusRequest.assignedUnit) {
    formData.append("assigned_unit", changeReportStatusRequest.assignedUnit);
  }

  const response = await privateApi.post(
    `/reports/${reportId}/change_status/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

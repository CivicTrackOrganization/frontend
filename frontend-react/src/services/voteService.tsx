import { privateApi } from "../clients";

export interface Vote {
  id: number;
  report: number;
  vote_type: number;
  created_at: string;
}

export const createVote = async (
  reportId: number,
  vote: number
): Promise<Vote> => {
  const request = {
    report: reportId,
    vote_type: vote,
  };

  const response = await privateApi.post("/votes/", request);
  return response.data;
};

export const deleteVote = async (reportId: number) => {
  const response = await privateApi.delete(`/votes/${reportId}/`);
  return response.data;
};

export const patchVote = async (reportId: number, vote: number) => {
  const request = {
    vote_type: vote,
  };

  const response = await privateApi.patch(`/votes/${reportId}/`, request);
  return response.data;
};

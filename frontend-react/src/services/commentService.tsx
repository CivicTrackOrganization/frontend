import { privateApi } from "../clients";
import type { Comment, CommentCreationRequest } from "../types";

export const createComment = async (
  request: CommentCreationRequest
): Promise<Comment> => {
  const response = await privateApi.post("/comments/", request);
  return response.data;
};

export const deleteComment = async (commentId: number) => {
  const response = await privateApi.delete(`/comments/${commentId}/`);
  return response.data;
};

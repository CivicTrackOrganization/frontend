import { privateApi } from "../clients";
import type { Comment, CommentCreationRequest } from "../types";

export const createComment = async (
  request: CommentCreationRequest
): Promise<Comment> => {
  const response = await privateApi.post("/comments/", request);
  return response.data;
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import { deleteComment } from "../services/commentService";
import type { Comment } from "../types";
import { displayIsoString } from "../utils/dateUtils";

interface CommentBubbleProps {
  comment: Comment;
  isOfficialResponse: boolean;
  isMine: boolean;
}

const CommentBubble = ({
  comment,
  isOfficialResponse,
  isMine,
}: CommentBubbleProps) => {
  const queryClient = useQueryClient();

  const bubbleStyle = clsx(
    "p-2 rounded-md w-[85%]",
    isMine
      ? "bg-indigo-100 rounded-br-none"
      : isOfficialResponse
      ? "bg-blue-200 border border-blue-300"
      : "bg-gray-100 rounded-bl-none"
  );

  const removeCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      toast.success("Comment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["report", comment.report] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["myReports"] });
    },
    onError: () => {
      toast.error("Unable to delete comment. Please try again");
    },
  });

  const removeComment = () => {
    if (removeCommentMutation.isPending) return;

    removeCommentMutation.mutate(comment.id);
  };

  return (
    <div
      className={clsx("w-full flex", isMine ? "justify-end" : "justify-start")}
    >
      <div className={bubbleStyle}>
        <header className="flex justify-between items-center mb-2">
          {isOfficialResponse ? (
            <div className="flex items-center">
              <span className="text-sm">
                {isMine ? "You" : comment.createdBy}
              </span>
              <span className="bg-black px-2 py-1 hidden sm:block sm:px-2 text-white rounded-lg text-xs ms-2">
                Offical response
              </span>
            </div>
          ) : (
            <span className="text-sm">
              {isMine ? "You" : comment.createdBy}
            </span>
          )}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs">
              {displayIsoString(comment.createdAt)}
            </span>
            {isMine && (
              <FaTimes
                size={13}
                className="text-red-800 hover:text-red-700 transition-colors cursor-pointer"
                onClick={removeComment}
              />
            )}
          </div>
        </header>
        <p>{comment.content}</p>
      </div>
    </div>
  );
};

export default CommentBubble;

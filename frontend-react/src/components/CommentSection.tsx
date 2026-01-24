import { useState } from "react";
import toast from "react-hot-toast";
import { PiChatCircle } from "react-icons/pi";
import type { Comment } from "../types";
import CommentBubble from "./CommentBubble";

interface CommentSectionProps {
  comments: Array<Comment>;
  userId: number;
  isUserModerator: boolean;
  onCommentSend: (content: string) => void;
}

const CommentSection = ({
  comments,
  userId,
  isUserModerator,
  onCommentSend,
}: CommentSectionProps) => {
  const officialComments = comments.filter(
    (comment) => comment.isOfficialResponse,
  );

  const communityComments = comments.filter(
    (comment) => !comment.isOfficialResponse,
  );

  const [newCommentContent, setNewCommentContent] = useState<string>("");

  return (
    <section className="py-3">
      <p className="mb-3">Comments ({comments.length})</p>
      <div className="flex flex-col gap-4">
        {officialComments.map((officialComment) => (
          <CommentBubble
            key={officialComment.id}
            comment={officialComment}
            isOfficialResponse={true}
            isMine={officialComment.authorId === userId}
          />
        ))}

        {communityComments.map((communityComment) => (
          <CommentBubble
            key={communityComment.id}
            comment={communityComment}
            isOfficialResponse={false}
            isMine={communityComment.authorId === userId}
          />
        ))}
      </div>

      {!isUserModerator && (
        <div className="mt-4">
          <textarea
            className="resize-none p-2 bg-gray-200 w-full rounded-xl focus:outline-gray-300"
            placeholder="Add your comment..."
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();

                if (newCommentContent.trim()) {
                  onCommentSend(newCommentContent);
                  setNewCommentContent("");
                } else {
                  toast.error("Comment content cannot be empty.");
                }
              }
            }}
            rows={2}
          />
          <button
            className="flex justify-center items-center gap-1 bg-gray-300 px-2 py-1 cursor-pointer hover:opacity-80 transition-colors rounded-md mt-3"
            onClick={() => {
              if (!newCommentContent.trim()) {
                toast.error("Comment content cannot be empty.");
                return;
              }

              onCommentSend(newCommentContent);
              setNewCommentContent("");
            }}
          >
            <PiChatCircle />
            <span>Add Comment</span>
          </button>
        </div>
      )}
    </section>
  );
};

export default CommentSection;

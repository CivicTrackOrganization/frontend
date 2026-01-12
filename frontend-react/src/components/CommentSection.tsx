import { PiChatCircle } from "react-icons/pi";
import type { Comment } from "../types";
import toast from "react-hot-toast";
import { useState } from "react";
import { displayIsoString } from "../utils/dateUtils";

interface CommentSectionProps {
  comments: Array<Comment>;
  onCommentSend: (content: string) => void;
}

const CommentSection = ({ comments, onCommentSend }: CommentSectionProps) => {
  const officialComments = comments.filter(
    (comment) => comment.isOfficialResponse
  );

  const communityComments = comments.filter(
    (comment) => !comment.isOfficialResponse
  );

  const [newCommentContent, setNewCommentContent] = useState<string>("");

  return (
    <section className="py-3">
      <p className="mb-2">Comments ({comments.length})</p>
      <div className="flex flex-col gap-4">
        {officialComments.map((officialComment) => (
          <div
            key={officialComment.id}
            className="bg-blue-100 border-blue-100 p-2"
          >
            <header className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-sm">{officialComment.createdBy}</span>
                <span className="bg-black px-2 py-1 text-white rounded-xl text-sm">
                  Offical response
                </span>
              </div>
              <span className="text-gray-400 text-xs">
                {officialComment.createdAt}
              </span>
            </header>
            <p>{officialComment.content}</p>
          </div>
        ))}

        {communityComments.map((communityComment) => (
          <div key={communityComment.id} className="bg-gray-100 p-3 rounded-md">
            <header className="flex justify-between items-center mb-2">
              <span className="text-sm">{communityComment.createdBy}</span>
              <span className="text-gray-400 text-xs">
                {displayIsoString(communityComment.createdAt)}
              </span>
            </header>
            <p>{communityComment.content}</p>
          </div>
        ))}
      </div>

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
    </section>
  );
};

export default CommentSection;

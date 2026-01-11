import { PiChatCircle } from "react-icons/pi";
import type { Comment } from "../types";

interface CommentSectionProps {
  comments: Array<Comment>;
}

const CommentSection = ({ comments }: CommentSectionProps) => {
  const officialComments = comments.filter(
    (comment) => comment.isOfficialResponse
  );

  const communityComments = comments.filter(
    (comment) => !comment.isOfficialResponse
  );

  return (
    <section className="py-3">
      <p className="mb-2">Comments ({comments.length})</p>
      <div className="flex flex-col gap-4">
        {officialComments.map((officialComment) => (
          <div className="bg-blue-100 border-blue-100 p-2">
            <header className="flex justify-between items-center">
              <div className="flex items-center">
                <span>{officialComment.createdBy}</span>
                <span className="bg-black px-2 py-1 text-white rounded-xl text-sm">
                  Offical response
                </span>
              </div>
              <span className="text-gray-400">{officialComment.createdAt}</span>
            </header>
            <p>{officialComment.content}</p>
          </div>
        ))}

        {communityComments.map((communityComment) => (
          <div className="bg-gray-100 p-3 rounded-md">
            <header className="flex justify-between items-center mb-2">
              <span>{communityComment.createdBy}</span>
              <span className="text-gray-400">
                {communityComment.createdAt}
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
        />
        <button className="flex justify-center items-center gap-1 bg-gray-300 px-2 py-1 cursor-pointer hover:opacity-80 transition-colors rounded-md mt-3">
          <PiChatCircle />
          <span>Add Comment</span>
        </button>
      </div>
    </section>
  );
};

export default CommentSection;

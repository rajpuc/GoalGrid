import React, { useEffect, useRef, useState } from "react";
import useAuthenticationStore from "../../store/useAuthenticationStore";
import useRoadmapItemStore from "../../store/useRoadmapItemStore";
import images from "../../assets/images";

// Recursive Comment Component
const Comment = ({ comment, itemId, onReply, depth }) => {
  const { loggedInUser } = useAuthenticationStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const { updateComment, deleteComment } = useRoadmapItemStore();

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    const data = {
      commentId: comment._id,
      content: editContent,
      roadmapItemId: itemId,
    };
    await updateComment(data);
    setIsEditing(false);
  };

  const indentClass = `${depth===0? "ml-0":"ml-6" }`; // max ml-8
  console.log(comment.content + 'depth = ' + depth)
  return (
    <div className={`${indentClass} border-l border-l-gray-300 pl-3 my-3`}>
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <img
            src={
              comment?.author?.profileImageUrl
                ? comment?.author?.profileImageUrl
                : images.avatar
            }
            alt="avatar"
            className="w-5 h-5 rounded-full border border-blue-700"
          />
          <span>{comment.author.fullName}</span>
        </div>
        {comment.isEdited && (
          <span className="text-xs text-gray-400">(edited)</span>
        )}
      </div>

      {isEditing ? (
        <>
          <input
            className="w-full border border-blue-600 focus:outline-none rounded text-sm p-1 mt-1"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <button
            onClick={handleEdit}
            className="mt-1 text-white bg-blue-600 px-2 py-0.5 text-sm rounded"
          >
            Save
          </button>
        </>
      ) : (
        <p className="text-sm mt-1"><span className="text-blue-500">{`${comment.parent=== null || comment.author._id === comment.parent._id?'':'@'+comment.parent.fullName+' '}`}</span>{`${comment.content}`}</p>
      )}

      <div className="flex gap-3 text-xs mt-1">
        <button onClick={() => onReply(comment)} className="text-blue-500">
          Reply
        </button>
        {loggedInUser?._id === comment.author._id && (
          <>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-green-500 cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() =>
                deleteComment({ commentId: comment._id, roadmapItemId: itemId })
              }
              className="text-red-500 cursor-pointer"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {/* Recursively render replies */}
      {comment?.replies?.length > 0 && comment.replies.map((reply) => (
        <Comment
          key={reply._id}
          comment={reply}
          itemId={itemId}
          onReply={onReply}
          depth={reply.depth}
        />
      ))}
    </div>
  );
};

// Roadmap Details Modal
const RoadmapDetailsModal = ({ itemId, onClose }) => {
  const inputRef = useRef(null);
  const { item, comments, fetchItemDetails, addComment } =
    useRoadmapItemStore();
  console.log(comments);
  const { loggedInUser } = useAuthenticationStore();
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    if (itemId) {
      fetchItemDetails(itemId);
    }
  }, [itemId]);

  useEffect(() => {
    if (replyTo) {
      setTimeout(() => {
        inputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        inputRef.current?.focus();
      }, 100);
    }
  }, [replyTo]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    await addComment({
      roadmapItemId: itemId,
      content: newComment,
      parentCommentId: replyTo?._id || null,
    });

    setNewComment("");
    setReplyTo(null);
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0   bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-sm w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative rounded-scrollbar mx-4">
        <button
          className="absolute top-3 right-4 text-xl font-bold"
          onClick={onClose}
        >
          ✖
        </button>

        <div className="mt-5 bg-gray-200/40 p-4 flex flex-col gap-1">
          <h2 className="text-xl font-medium">{item.title}</h2>
          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
        </div>
        <div className="flex mt-3 gap-3">
          <div
            title="status"
            className={`text-[12px] text-white ${
              item.status === "Completed"
                ? "bg-green-700"
                : item.status === "Todo"
                ? "bg-red-400 "
                : "bg-amber-400"
            } px-2 py-0.5 rounded-2xl`}
          >
            {item.status}
          </div>
          <div
            title="category"
            className={`text-[12px] bg-fuchsia-800  text-white px-2 py-0.5 rounded-2xl`}
          >
            {item.category}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-sm mb-2">All Comments</h3>
          {comments.length === 0 ? (
            <p className="text-sm text-gray-400">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                itemId={itemId}
                onReply={setReplyTo}
                depth={comment.depth}
              />
            ))
          )}
        </div>

        {loggedInUser && (
          <div className="mt-4">
            <input
              className="w-full border border-blue-600 focus:outline-none rounded text-sm p-2"
              placeholder={
                replyTo
                  ? `Replying to @${replyTo.author.fullName}`
                  : "Write a comment..."
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-between mt-1">
              {replyTo && (
                <button
                  className="text-red-700 text-sm cursor-pointer"
                  onClick={() => setReplyTo(null)}
                >
                  Cancel Reply
                </button>
              )}
              <button
                className="text-white bg-blue-600 px-3 py-1 text-sm rounded"
                onClick={handleSubmit}
              >
                {replyTo ? "Reply" : "Comment"}
              </button>
              
            </div>
            <div ref={inputRef}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapDetailsModal;

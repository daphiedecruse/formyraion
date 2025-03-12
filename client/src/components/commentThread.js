import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentThread = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get(`/api/comments/${postId}`).then(res => setComments(res.data));
  }, [postId]);

  const renderComments = (comments, depth = 0) => {
    return comments.map(comment => (
      <div key={comment._id} style={{ marginLeft: depth * 20 }}>
        <p><strong>{comment.userId.username}</strong>: {comment.text} <small>{comment.timeAgo}</small></p>
        <button onClick={() => handleReply(comment._id)}>Reply</button>
        {comment.replies.length > 0 && renderComments(comment.replies, depth + 1)}
      </div>
    ));
  };

  const handleReply = (parentComment) => {
    const text = prompt("Enter your reply:");
    if (!text) return;

    axios.post("/api/comments", { postId, text, parentComment }).then(() => {
      window.location.reload();
    });
  };

  return <div>{renderComments(comments)}</div>;
};

export default CommentThread;

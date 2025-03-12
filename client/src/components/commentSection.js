import React, { useEffect, useState } from "react";
import axios from "axios";
import CommentThread from "./commentThread";

const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get(`/api/comments/${postId}`).then((res) => {
      setComments(res.data);
    });
  }, [postId]);

  return (
    <div>
      <h3>Comments</h3>
      <CommentThread comments={comments} />
    </div>
  );
};

export default CommentsSection;

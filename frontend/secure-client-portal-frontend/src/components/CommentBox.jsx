import { useState } from "react";
import API from "../services/api";

export default function CommentBox({ docId }) {
  const [comment, setComment] = useState("");

  const submitComment = async () => {
    await API.post(`/documents/${docId}/comment`, { comment });
  };

  return (
    <div>
      <input onChange={(e) => setComment(e.target.value)} />
      <button onClick={submitComment}>Add Comment</button>
    </div>
  );
}
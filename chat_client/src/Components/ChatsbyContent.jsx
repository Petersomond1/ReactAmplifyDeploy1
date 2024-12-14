import React, { useState } from 'react';
import './chatsbycontent.css';

const ChatsbyContent = ({ subComments, onAddComment }) => {
  const [commentText, setCommentText] = useState('');
  const [commentFile, setCommentFile] = useState(null);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('comment_text', commentText);
    if (commentFile) {
      formData.append('comment_file', commentFile);
    }
    onAddComment(formData);
    setCommentText('');
    setCommentFile(null);
  };

  return (
    <div className="comments_container">
      {subComments && subComments.length > 0 ? (
        subComments.map((msg) => (
          <div key={msg.id} className="comments">
            {msg.comment_text && <div>{msg.comment_text}</div>}
            {msg.comment_image && <img src={msg.comment_image} alt="comment" />}
            {msg.comment_video && <video src={msg.comment_video} controls />}
            {msg.comment_music && <audio src={msg.comment_music} controls />}
            {msg.comment_emoji && <div>{msg.comment_emoji}</div>}
            <div className="comment_info">
              <div>{msg.submitter}</div>
              <div>{msg.timestamp}</div>
            </div>
          </div>
        ))
      ) : (
        <div>No comments yet. Be the first to comment!</div>
      )}
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment"
        />
        <input
          type="file"
          onChange={(e) => setCommentFile(e.target.files[0])}
        />
        <button type="submit">Submit Comment</button>
      </form>
    </div>
  );
};

export default ChatsbyContent;
import React, { useState } from 'react';


function Reaction() {
  // State for storing vote counts
  const [blogVotes, setBlogVotes] = useState(0);
  const [commentVotes, setCommentVotes] = useState(0);

  // Function to handle voting
  const handleVote = (type, target) => {
    if (target === 'blog') {
      setBlogVotes(prevVotes => {
        if (type === 'upvote') return prevVotes + 1;
        else return prevVotes - 1;
      });
    } else if (target === 'comment') {
      setCommentVotes(prevVotes => {
        if (type === 'upvote') return prevVotes + 1;
        else return prevVotes - 1;
      });
    }
  };

  return (
    <div className="App">
      {/* Blog Section */}
      <div className="section">
        <h2>Blog Title</h2>
        <div className="reaction-container">
          <button className="reaction-button upvote-button" onClick={() => handleVote('upvote', 'blog')}>Upvote</button>
          <span className="vote-count">{blogVotes}</span>
          <button className="reaction-button downvote-button" onClick={() => handleVote('downvote', 'blog')}>Downvote</button>
        </div>
      </div>

      {/* Comment Section */}
      <div className="section">
        <h3>Comments</h3>
        <div className="comment">
          <p>Comment Text</p>
          <div className="reaction-container">
            <button className="reaction-button upvote-button" onClick={() => handleVote('upvote', 'comment')}>Upvote</button>
            <span className="vote-count">{commentVotes}</span>
            <button className="reaction-button downvote-button" onClick={() => handleVote('downvote', 'comment')}>Downvote</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reaction;

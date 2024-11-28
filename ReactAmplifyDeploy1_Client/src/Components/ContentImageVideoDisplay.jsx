import React from 'react';
import './contentimagevideodisplay.css';

const ContentImageVideoDisplay = ({ displayContent }) => {
  if (!displayContent) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-image-video-display">
      {displayContent.type === 'image' ? (
        <img src={displayContent.url} alt="Display" />
      ) : (
        <video src={displayContent.url} controls />
      )}
    </div>
  );
};

export default ContentImageVideoDisplay;
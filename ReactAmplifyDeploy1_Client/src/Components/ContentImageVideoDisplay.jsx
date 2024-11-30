import React from 'react';
import './contentimagevideodisplay.css';

const ContentImageVideoDisplay = ({ displayContent }) => {
  if (!displayContent || displayContent.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-image-video-display-container">
      {displayContent.map((content, index) => (
        <div key={index} className="content-item">
          {content.type === 'image' ? (
            <img 
              src={content.url} 
              alt={`content-${index}`} 
              className="content-image" 
            />
          ) : content.type === 'video' ? (
            <video 
              src={content.url} 
              controls 
              alt={`content-video-${index}`} 
              className="content-video"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default ContentImageVideoDisplay;

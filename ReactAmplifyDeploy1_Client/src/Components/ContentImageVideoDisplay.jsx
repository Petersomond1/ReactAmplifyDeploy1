import React from 'react';
import './contentimagevideodisplay.css';

const ContentImageVideoDisplay = ({ displayContent }) => {
  if (!displayContent || displayContent.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-image-video-display-container">
      {displayContent?.map((content, index) => (
        <div key={index} className="content-item">
          {content.text && (
            <div className="content-text">
              {content.text}
            </div>
          )}
          {content.image_url && (
            <img 
              src={content.image_url} 
              alt={`content-image-${index}`} 
              className="content-image" 
            />
          )}
          {content.video_url && (
            <video 
              src={content.video_url} 
              controls 
              alt={`content-video-${index}`} 
              className="content-video"
            />
          )}
          {content.emoji && (
            <div className="content-emoji">
              {content.emoji}
            </div>
          )}
          <div className="content-details">
            <div className="content-title">{content.title}</div>
            <div className="content-description">{content.description}</div>
            <div className="content-timestamp">{content.timestamp}</div>
            <div className="content-submitter">{content.submitter}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentImageVideoDisplay;
import React, { useState, useRef } from 'react';
import './contentimagevideodisplay.css';

const ContentImageVideoDisplay = ({ displayContent }) => {
  const [playingMedia, setPlayingMedia] = useState(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const handlePlay = (type) => {
    if (type === 'video') {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingMedia('video');
    } else if (type === 'music') {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setPlayingMedia('music');
    }
  };

  if (!displayContent || displayContent.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-image-video-display-container">
      {displayContent.map((content, index) => (
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
              ref={videoRef}
              src={content.video_url} 
              controls 
              alt={`content-video-${index}`} 
              className="content-video"
              onPlay={() => handlePlay('video')}
            />
          )}
          {content.music_url && (
            <audio 
              ref={audioRef}
              src={content.music_url} 
              controls 
              className="content-music"
              onPlay={() => handlePlay('music')}
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
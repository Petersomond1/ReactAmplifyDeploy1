import React, { useRef, useEffect } from 'react';
import './contentimagevideodisplay.css';

const ContentImageVideoDisplay = ({ selectedContent }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (selectedContent) {
      if (selectedContent.type === 'video' && videoRef.current) {
        videoRef.current.play();
      } else if (selectedContent.type === 'music' && audioRef.current) {
        audioRef.current.play();
      }
    }
  }, [selectedContent]);

  if (!selectedContent) {
    return <div>Loading...</div>;
  }

  console.log("data from ContentImageVideoDisplay: ", selectedContent);
  return (
    <div className="content-image-video-display-container">
      {selectedContent?.text && (
        <div className="content-text">
          {selectedContent.text}
        </div>
      )}
      {selectedContent.file_url && (
        <>
        <h1>{selectedContent?.image_url}</h1>
        <img 
          src={selectedContent?.file_url} 
          alt={`content-image`} 
          className="content-image" 
        />
        </>
      )}
      {selectedContent?.video_url && (
        <video 
          ref={videoRef}
          src={selectedContent.video_url} 
          controls 
          alt={`content-video`} 
          className="content-video"
        />
      )}
      {selectedContent?.music_url && (
        <audio 
          ref={audioRef}
          src={selectedContent.music_url} 
          controls 
          className="content-music"
        />
      )}
      {selectedContent?.emoji && (
        <div className="content-emoji">
          {selectedContent.emoji}
        </div>
      )}
      <div className="content-details">
        <div className="content-title">{selectedContent.title}</div>
        <div className="content-description">{selectedContent.description}</div>
        <div className="content-timestamp">{selectedContent.timestamp}</div>
        <div className="content-submitter">{selectedContent.submitter}</div>
      </div>
    </div>
  );
};

export default ContentImageVideoDisplay;
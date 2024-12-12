import React from 'react';
import './contentlisting.css';

const ContentListing = ({ displayContent }) => {
  if (!displayContent || displayContent.length === 0) {
    return <div>No content available</div>;
  }

  return (
    <div className="content-listing">
      {displayContent.map((content, index) => (
        <div key={index} className="content-item">
          <img src={content.thumbnailUrl} alt={content.title} />
          {content.type === 'image' && <img src={content.file_url} alt={content.title} />}
          {content.type === 'video' && <video src={content.file_url} controls />}
          {content.type === 'text' && <p>{content.description}</p>}
          <div>{content.title}</div>
          <div>{content.description}</div>
          <div>{content.created_at}</div>
          <div>{content.submitter}</div>
        </div>
      ))}
    </div>
  );
};

export default ContentListing;
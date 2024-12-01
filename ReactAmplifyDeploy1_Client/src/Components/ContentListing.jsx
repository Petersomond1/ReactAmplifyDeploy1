import React from 'react';
import './contentlisting.css';

const ContentListing = ({ contentList }) => {
  return (
    <div className="content-listing">
      {contentList.map((content, index) => (
        <div key={index} className="content-item">
          <img src={content.thumbnailUrl} alt={content.title} />
          {content.title}
          {content.description}
          {content.timestamp}
          {content.submitter}
        </div>
      ))}
    </div>
  );
};

export default ContentListing;
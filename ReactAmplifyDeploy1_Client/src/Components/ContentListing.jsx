import React from 'react';
import './contentlisting.css';

const ContentListing = ({ contentList }) => {
  return (
    <div className="content-listing">
      {contentList.map((content, index) => (
        <div key={index} className="content-item">
          {content.title}
        </div>
      ))}
    </div>
  );
};

export default ContentListing;
import React from 'react';
import './contentlisting.css';

const ContentListing = ({ displayContent, onSelectContent }) => {
   if (!Array.isArray(displayContent) || displayContent.length === 0) {
     return <div>No content available</div>;
  }

  return (
    <div className="content-listing">
      {displayContent.map((content, index) => (
        <div key={index} className="content-item" onClick={() => onSelectContent(content)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <img src={content.thumbnailUrl} alt={content.title} sizes='5px, 5px'/>
          <div style={{  marginLeft: '5px' }}>
            <div><small><p style={{ fontSize: '15px', display: 'inline' }}>Title:</p> {content.title}</small></div>
            <div><small><p style={{ fontSize: '10px', display: 'inline' }}>On:</p> {content.created_at}</small></div>
            <div><small><p style={{ fontSize: '10px', display: 'inline' }}>By:</p> {content.submitter}</small></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentListing;
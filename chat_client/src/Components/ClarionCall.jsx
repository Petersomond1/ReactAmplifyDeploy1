import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const ClarionCall = () => {
  const [clarionContent, setClarionContent] = useState([]);

  useEffect(() => {
    axios.get('/api/clarioncall/content').then(res => setClarionContent(res.data));
  }, []);

  return (
    <div className="clarion-call">
      <h2>Welcome to THE CLARION CALL!</h2>
      <section>
        {clarionContent.map(content => (
          <div key={content.id} className="clarion-content-item">
            {content.type === 'text' && <p>{content.text}</p>}
            {content.type === 'image' && <img src={content.file_url} alt="content" />}
            {content.type === 'video' && <video src={content.file_url} controls />}
            {content.type === 'music' && <audio src={content.file_url} controls />}
            {content.type === 'emoji' && <div>{content.emoji}</div>}
          </div>
        ))}
      </section>
      <p> Login to main Chat page if you've registered/signed-up</p>
      <button onClick={() => navigate("/login")}>Login</button>
      <button onClick={() => navigate("/signup")}>Register</button>
      <p>
        That long prophesied future starts now! <br />
        Register to Chat with likeminds that are your true friends and family.
        .......the Change-Movers, the Redeemers, the true Chosen Children of the Gods!
      </p>
    </div>
  );
};

export default ClarionCall;
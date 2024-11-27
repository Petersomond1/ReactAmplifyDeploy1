import React from 'react'

function Chatpage() {
  return (
    <div>
<div>Listing</div>
<div>Display</div>
<div>Chat</div>
<div>Messages</div>

<div className="display-section">
            {displayContent &&
              (displayContent.type === 'image' ? (
                <img src={displayContent.url} alt="Display" />
              ) : (
                <video src={displayContent.url} controls />
              ))}

             
          </div>
          <div className="chat-section">
            <div className="messages">
              {messages &&
                messages.map((msg) => (
                  <div key={msg.id} className="message">
                    {msg.content}
                  </div>
                ))}
            </div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={() => sendMessage.mutate(newMessage)}>Send</button>
          </div>
          <div className="form-section">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <button
              onClick={() =>
                uploadContent.mutate({ type: 'text', url: newContent })
              }
            >
              Submit
            </button>
          </div>

    </div>
  )
}

export default Chatpage
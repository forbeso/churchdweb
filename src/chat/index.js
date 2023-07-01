import React, { useState } from 'react';
import './style.scss';

function ChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="chat-container">
      {isChatOpen ? (
        <div className="chatbox bg-white border p-3 rounded ">
          <div>
            <p>x</p>
          </div>
          <div className="border p-3 h-75 mb-2">
            <h5>chat response</h5>
          </div>
          <div>
            <input
              type="text"
              className="w-100"
              placeholder="Ask questions about your member data"
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="chat-toggle-button btn btn-primary"
          onClick={handleChatToggle}
        >
          Chat with your data
        </button>
      )}
    </div>
  );
}

export default ChatButton;

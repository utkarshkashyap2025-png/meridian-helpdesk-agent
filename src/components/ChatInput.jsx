import React, { useState, useRef } from 'react';
import { Send, Paperclip, HelpCircle } from 'lucide-react';

export default function ChatInput({ onSendMessage, disabled, placeholder }) {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = () => {
    if (!inputText.trim() || disabled) return;
    onSendMessage(inputText.trim());
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <div className="chat-input-bar-container">
      <div className="chat-input-box-wrapper">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          placeholder={placeholder || 'Type an IT or HR question (e.g. "How do I request a replacement laptop?")...'}
          rows={1}
          value={inputText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />

        <div className="chat-input-footer-tools">
          <div className="input-quick-helpers">
            <button
              type="button"
              className="input-tool-icon-btn"
              title="Attach screenshot or diagnostic log (Mock)"
            >
              <Paperclip size={16} />
            </button>
            <button
              type="button"
              className="input-tool-icon-btn"
              title="Help prompts"
            >
              <HelpCircle size={16} />
            </button>
          </div>

          <button
            type="button"
            className="chat-send-btn"
            onClick={handleSubmit}
            disabled={!inputText.trim() || disabled}
            aria-label="Send Message"
          >
            <span>Send</span>
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

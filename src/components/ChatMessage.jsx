import React from 'react';
import { Bot } from 'lucide-react';

export default function ChatMessage({ message, onActionClick }) {
  const isBot = message.isBot;

  // Simple formatting helper
  const formatText = (text) => {
    if (!text) return null;
    const paragraphs = text.split('\n\n');
    return paragraphs.map((para, pIdx) => {
      // Split by lines within paragraph
      const lines = para.split('\n');
      return (
        <p key={pIdx}>
          {lines.map((line, lIdx) => {
            // Basic bold parser **text**
            const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
            return (
              <React.Fragment key={lIdx}>
                {parts.map((part, partIdx) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
                  }
                  if (part.startsWith('`') && part.endsWith('`')) {
                    return (
                      <code
                        key={partIdx}
                        style={{
                          background: '#EDEBE9',
                          padding: '1px 5px',
                          borderRadius: '3px',
                          fontFamily: 'monospace'
                        }}
                      >
                        {part.slice(1, -1)}
                      </code>
                    );
                  }
                  return part;
                })}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            );
          })}
        </p>
      );
    });
  };

  return (
    <div className={`chat-msg-row ${isBot ? 'msg-bot' : 'msg-user'}`}>
      <div className="msg-avatar">
        {isBot ? <Bot size={18} /> : 'AM'}
      </div>
      <div className="msg-bubble-wrap">
        <div className="msg-sender-meta">
          {isBot ? (
            <>
              <strong>{message.senderName || 'Meridian Assistant'}</strong>
              <span>{message.time}</span>
            </>
          ) : (
            <>
              <span>{message.time}</span>
              <strong>{message.senderName || 'Alex Morgan'}</strong>
            </>
          )}
        </div>

        <div className="msg-bubble">
          {message.title && (
            <div style={{ marginBottom: 6 }}>
              <strong>{message.title}</strong>
            </div>
          )}

          <div>{formatText(message.text)}</div>

          {message.actions && message.actions.length > 0 && (
            <div className="msg-bubble-actions">
              {message.actions.map((act, idx) => (
                <button
                  key={idx}
                  className="msg-action-btn"
                  onClick={() => onActionClick && onActionClick(act)}
                >
                  {act}
                </button>
              ))}
            </div>
          )}

          {message.note && (
            <div style={{ marginTop: 10, fontSize: 11, color: '#8A8886', fontStyle: 'italic' }}>
              {message.note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

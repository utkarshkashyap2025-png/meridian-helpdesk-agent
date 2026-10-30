import React from 'react';
import ChatWindow from '../components/ChatWindow';

export default function ChatPage({ onNavigateTab, onOpenConfig, pendingQuestion, onClearPendingQuestion }) {
  return (
    <section id="tab-chat" className="tab-panel active" aria-label="Helpdesk Chat">
      <ChatWindow 
        onNavigateTab={onNavigateTab} 
        onOpenConfig={onOpenConfig}
        pendingQuestion={pendingQuestion}
        onClearPendingQuestion={onClearPendingQuestion}
      />
    </section>
  );
}

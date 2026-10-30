import React from 'react';
import ChatWindow from '../components/ChatWindow';

export default function ChatPage({ 
  onNavigateTab, 
  onOpenConfig, 
  onOpenRaiseTicket,
  pendingQuestion, 
  onClearPendingQuestion 
}) {
  return (
    <section id="tab-chat" className="tab-panel active" aria-label="Helpdesk Chat">
      <ChatWindow 
        onNavigateTab={onNavigateTab} 
        onOpenConfig={onOpenConfig}
        onOpenRaiseTicket={onOpenRaiseTicket}
        pendingQuestion={pendingQuestion}
        onClearPendingQuestion={onClearPendingQuestion}
      />
    </section>
  );
}

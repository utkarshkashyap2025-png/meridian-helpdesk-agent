import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatPage from './pages/ChatPage';
import HRPoliciesPage from './pages/HRPoliciesPage';
import ITSupportPage from './pages/ITSupportPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState(null);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleAskBot = (question) => {
    setActiveTab('chat');
    setPendingQuestion(question);
  };

  return (
    <div className="app-shell">
      {/* Top Header */}
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigateTab={(tab) => setActiveTab(tab === 'tickets' ? 'chat' : tab)}
        onAskBot={handleAskBot}
        onOpenConfig={() => setIsConfigModalOpen(true)}
      />

      <div className="app-body">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab === 'tickets' ? 'chat' : activeTab}
          onSelectTab={(tab) => setActiveTab(tab === 'tickets' ? 'chat' : tab)}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          onOpenConfig={() => setIsConfigModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="main-viewport" role="main">
          {activeTab === 'chat' && (
            <ChatPage
              onNavigateTab={(tab) => setActiveTab(tab === 'tickets' ? 'chat' : tab)}
              onOpenConfig={() => setIsConfigModalOpen(true)}
              pendingQuestion={pendingQuestion}
              onClearPendingQuestion={() => setPendingQuestion(null)}
            />
          )}

          {activeTab === 'hr-policies' && (
            <HRPoliciesPage
              onAskBot={handleAskBot}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'it-support' && (
            <ITSupportPage onShowToast={showToast} />
          )}
        </main>
      </div>

      {/* Configuration Guide Modal for n8n */}
      {isConfigModalOpen && (
        <div
          id="config-modal-backdrop"
          className="config-modal-backdrop active"
          onClick={() => setIsConfigModalOpen(false)}
        >
          <div
            className="config-modal-window"
            role="dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="config-modal-header">
              <h3>⚙️ n8n Chatbot Connection Configuration</h3>
              <button
                className="config-close-btn"
                aria-label="Close configuration modal"
                onClick={() => setIsConfigModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="config-modal-body">
              <p style={{ fontSize: 13.5, color: '#242424', lineHeight: 1.5 }}>
                The chat interface is built to connect to your existing <strong>n8n Chat Trigger</strong> using the official <code>@n8n/chat</code> widget.
              </p>

              <div
                style={{
                  background: '#F1FAF4',
                  border: '1px solid #A3E0BA',
                  borderRadius: 8,
                  padding: '12px 16px',
                  color: '#0E6836',
                  fontSize: 13
                }}
              >
                <strong>Configuration Location:</strong><br />
                <code>src/config/n8n.js</code>
              </div>

              <ol className="config-steps-list">
                <li>
                  <strong>Open your n8n workflow</strong>: Locate your workflow that uses the <em>When chat message received</em> (Chat Trigger) node.
                </li>
                <li>
                  <strong>Copy your Webhook URL</strong>: Copy the <em>Production URL</em> (or Test URL) from your Chat Trigger.
                </li>
                <li>
                  <strong>Paste into <code>src/config/n8n.js</code></strong>:
                </li>
              </ol>

              <pre className="config-code-block">
                <code>
                  <span className="code-comment">// file: src/config/n8n.js</span>{'\n'}
                  <span className="code-highlight">export const N8N_CONFIG = {'{'}</span>{'\n'}
                  {'  '}<span className="code-comment">// 👉 Paste your n8n Production Webhook URL here:</span>{'\n'}
                  {'  '}webhookUrl: <span style={{ color: '#A8FF60' }}>'https://your-n8n-domain/webhook/.../chat'</span>,{'\n'}
                  {'  '}...{'\n'}
                  {'};'}
                </code>
              </pre>

              <p style={{ fontSize: 12.5, color: '#616161' }}>
                Once you update <code>src/config/n8n.js</code> and save, the chat interface connects live to your n8n AI agent.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      {toasts.length > 0 && (
        <div className="toast-container" id="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

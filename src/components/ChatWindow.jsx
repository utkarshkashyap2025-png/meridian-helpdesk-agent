import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, Laptop, Key, Palmtree, HeartPulse, Globe, DollarSign, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { N8N_CONFIG } from '../config/n8n.js';
import { createChat } from '@n8n/chat';
import '@n8n/chat/style.css';

const PROMPT_PILLS = [
  {
    category: 'IT Hardware',
    type: 'it',
    icon: Laptop,
    text: 'How do I request a replacement laptop?',
    prompt: 'How do I request a replacement laptop or monitor?'
  },
  {
    category: 'IT Security',
    type: 'it',
    icon: Key,
    text: 'Reset my SSO password & Okta MFA',
    prompt: 'Reset my Single Sign-On (SSO) credentials and Okta MFA'
  },
  {
    category: 'HR Policy',
    type: 'hr',
    icon: Palmtree,
    text: 'What is the annual PTO rollover policy?',
    prompt: 'What is the annual leave and PTO rollover policy?'
  },
  {
    category: 'HR Benefits',
    type: 'hr',
    icon: HeartPulse,
    text: 'How to enroll in healthcare benefits?',
    prompt: 'How do I enroll in healthcare benefits and wellness stipends?'
  },
  {
    category: 'IT Network',
    type: 'it',
    icon: Globe,
    text: 'Setup GlobalProtect VPN access',
    prompt: 'How do I configure GlobalProtect VPN on macOS or Windows?'
  },
  {
    category: 'HR Expense',
    type: 'hr',
    icon: DollarSign,
    text: 'Home office expense reimbursement',
    prompt: 'What are the expense reimbursement guidelines for home office equipment?'
  }
];

export default function ChatWindow({ onNavigateTab, onOpenConfig, pendingQuestion, onClearPendingQuestion }) {
  const containerRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const webhookUrl = (N8N_CONFIG.webhookUrl || '').trim();
  const isConfigured = Boolean(
    webhookUrl &&
    !webhookUrl.includes('YOUR_PRODUCTION_WEBHOOK_URL') &&
    !webhookUrl.includes('your-n8n-instance')
  );

  // Mount @n8n/chat widget inside #n8n-chat-container without duplicating
  useEffect(() => {
    let appInstance = null;

    if (isConfigured && containerRef.current) {
      // Clear container before mounting to prevent duplicate widgets
      containerRef.current.innerHTML = '';

      try {
        appInstance = createChat({
          webhookUrl: webhookUrl,
          webhookConfig: N8N_CONFIG.webhookConfig || { method: 'POST', headers: {} },
          target: containerRef.current,
          mode: 'fullscreen',
          showWindowCloseButton: false,
          showWelcomeScreen: false,
          loadPreviousSession: true,
          initialMessages: N8N_CONFIG.branding.initialMessages,
          i18n: {
            en: {
              title: '',
              subtitle: '',
              footer: '',
              getStarted: 'Start Helpdesk Conversation',
              inputPlaceholder: N8N_CONFIG.branding.inputPlaceholder,
              closeButtonTooltip: 'Close'
            }
          }
        });
      } catch (err) {
        console.error('Error mounting official @n8n/chat:', err);
      }
    }

    return () => {
      if (appInstance && typeof appInstance.unmount === 'function') {
        try {
          appInstance.unmount();
        } catch (e) {
          // ignore unmount errors
        }
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [isConfigured, webhookUrl]);

  // Handle suggested prompt clicks: populate real @n8n/chat input
  const handlePromptClick = (promptText) => {
    if (!isConfigured) {
      onOpenConfig();
      return;
    }

    // Find the textarea inside the mounted @n8n/chat widget
    const n8nTextarea = containerRef.current?.querySelector('textarea');
    if (n8nTextarea) {
      n8nTextarea.value = promptText;
      n8nTextarea.dispatchEvent(new Event('input', { bubbles: true }));
      n8nTextarea.focus();
    }
  };

  // Handle pending external questions (from Header search or Policy cards)
  useEffect(() => {
    if (pendingQuestion) {
      handlePromptClick(pendingQuestion);
      onClearPendingQuestion && onClearPendingQuestion();
    }
  }, [pendingQuestion]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="chat-view-container">
      {/* Top Welcome Strip */}
      <div className="chat-welcome-strip">
        <div className="welcome-info-block">
          <div className="welcome-bot-avatar">
            <Bot size={24} />
          </div>
          <div className="welcome-text-group">
            <h2>
              <span>{getGreeting()}, Alex 👋</span>
              <span className="welcome-badge-online">Helpdesk Active</span>
            </h2>
            <p>Ask IT troubleshooting questions, request hardware, or explore HR benefits & policies.</p>
          </div>
        </div>

        {/* Status Pill: Reflects actual configuration status */}
        <div
          id="chat-status-pill"
          className={`chat-status-pill ${isConfigured ? 'connected' : 'ready-to-connect'}`}
          onClick={onOpenConfig}
          title={isConfigured ? `Configured endpoint: ${webhookUrl}` : 'Click to configure n8n Chat Trigger webhook'}
        >
          <span>{isConfigured ? '⚡' : '⚙️'}</span>
          <span>{isConfigured ? 'Endpoint Configured (Awaiting Test)' : 'Webhook Not Configured'}</span>
        </div>
      </div>

      {/* Suggested Employee Prompts Bar */}
      <div className="chat-prompts-section">
        <div className="prompts-label-row">
          <span className="prompts-label">
            <Sparkles size={14} style={{ marginRight: 6 }} />
            Popular Employee Questions
          </span>
          <span style={{ fontSize: 11, color: '#8A8886' }}>
            {isConfigured ? 'Click to insert into chat' : 'Configure webhook to ask'}
          </span>
        </div>

        <div className="prompts-scroll-deck">
          {PROMPT_PILLS.map((pill, idx) => {
            const Icon = pill.icon;
            return (
              <button
                key={idx}
                className={`prompt-pill-card ${pill.type}`}
                onClick={() => handlePromptClick(pill.prompt)}
              >
                <span className="pill-category">{pill.category}</span>
                <span className="pill-icon"><Icon size={14} /></span>
                <span>{pill.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Stage Area */}
      <div className="chat-stage-area">
        {/* If configured: Mount the official @n8n/chat widget */}
        <div
          id="n8n-chat-container"
          ref={containerRef}
          className={isConfigured ? 'active' : ''}
          style={{ width: '100%', height: '100%' }}
        />

        {/* If not configured: Display setup card with zero fake responses */}
        {!isConfigured && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
          >
            <div
              style={{
                maxWidth: '620px',
                width: '100%',
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #EDEBE9',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                padding: '28px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'var(--teams-purple-light)',
                    color: 'var(--teams-purple-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Bot size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#242424' }}>
                    Connect Your Published n8n Chatbot
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#616161' }}>
                    The official <code>@n8n/chat</code> widget is installed and ready to connect.
                  </p>
                </div>
              </div>

              <div
                style={{
                  background: '#FFFDF5',
                  border: '1px solid #F8D88A',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  marginBottom: '18px',
                  fontSize: '13px',
                  color: '#513600'
                }}
              >
                <strong>⚙️ Setup Required:</strong> To prevent misleading demonstration responses, mock AI replies have been removed. Connect your real n8n workflow to activate live conversation.
              </div>

              <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#242424', marginBottom: '8px' }}>
                How to connect in 3 steps:
              </h4>

              <ol style={{ paddingLeft: '20px', fontSize: '13px', color: '#424242', lineHeight: '1.6', marginBottom: '18px' }}>
                <li>
                  Open your published n8n workflow containing the <strong>When chat message received</strong> (Chat Trigger) node.
                </li>
                <li>
                  Copy the <strong>Production URL</strong> (or Test URL) from the node.
                </li>
                <li>
                  Paste the URL into <code>src/config/n8n.js</code> or in <code>.env.local</code> as <code>VITE_N8N_CHAT_WEBHOOK_URL</code>:
                </li>
              </ol>

              <div
                style={{
                  background: '#201F24',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  padding: '12px 14px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  marginBottom: '18px',
                  overflowX: 'auto'
                }}
              >
                <div style={{ color: '#8C8C9A' }}>// File: src/config/n8n.js</div>
                <div style={{ color: '#7B83EB' }}>export const N8N_CONFIG = {'{'}</div>
                <div style={{ paddingLeft: '14px' }}>
                  webhookUrl: <span style={{ color: '#A8FF60' }}>'https://your-n8n-instance/webhook/.../chat'</span>
                </div>
                <div style={{ color: '#7B83EB' }}>{'};'}</div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="new-ticket-btn"
                  onClick={onOpenConfig}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>View Full Configuration Guide</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, Laptop, Key, Palmtree, HeartPulse, Globe, DollarSign, ExternalLink, AlertCircle, CheckCircle2, Lock, ShieldCheck, UserCheck, Ticket, User, Mail } from 'lucide-react';
import { useAuth, useUser, useClerk } from '@clerk/react';
import { N8N_CONFIG } from '../config/n8n.js';
import { createChat } from '@n8n/chat';
import '@n8n/chat/style.css';

export default function ChatWindow({ 
  onNavigateTab, 
  onOpenConfig, 
  onOpenRaiseTicket,
  pendingQuestion, 
  onClearPendingQuestion 
}) {
  const containerRef = useRef(null);
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();

  const webhookUrl = (N8N_CONFIG.webhookUrl || '').trim();
  const isConfigured = Boolean(
    webhookUrl &&
    !webhookUrl.includes('YOUR_PRODUCTION_WEBHOOK_URL') &&
    !webhookUrl.includes('your-n8n-instance')
  );

  // Retrieve employee details strictly from Clerk authentication
  const employeeName = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Employee';
  const employeeEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || 'employee@meridian.corp';

  // Dynamic prompt pills with employee Clerk details autofilled
  const promptPills = [
    {
      category: 'Raise Ticket',
      type: 'it',
      icon: Ticket,
      text: 'Raise a support ticket (Autofill Clerk details)',
      prompt: `Please raise a support ticket:
- Requester Name: ${employeeName}
- Requester Email: ${employeeEmail}
- Category: IT Helpdesk
- Issue: `
    },
    {
      category: 'IT Hardware',
      type: 'it',
      icon: Laptop,
      text: 'Request replacement laptop / monitor',
      prompt: `I want to request a replacement laptop for ${employeeName} (${employeeEmail}).`
    },
    {
      category: 'IT Security',
      type: 'it',
      icon: Key,
      text: 'Reset SSO password & Okta MFA',
      prompt: `Reset my Single Sign-On (SSO) credentials and Okta MFA for ${employeeName} (${employeeEmail}).`
    },
    {
      category: 'HR Benefits',
      type: 'hr',
      icon: HeartPulse,
      text: 'Enroll in healthcare benefits & stipend',
      prompt: `How do I enroll in healthcare benefits and wellness stipends for ${employeeName} (${employeeEmail})?`
    },
    {
      category: 'IT Network',
      type: 'it',
      icon: Globe,
      text: 'Setup GlobalProtect VPN access',
      prompt: `How do I configure GlobalProtect VPN access for account ${employeeEmail}?`
    },
    {
      category: 'HR Expense',
      type: 'hr',
      icon: DollarSign,
      text: 'Home office expense reimbursement',
      prompt: `What are the expense reimbursement guidelines for ${employeeName} (${employeeEmail})?`
    }
  ];

  // Mount @n8n/chat widget inside #n8n-chat-container ONLY when signed in
  useEffect(() => {
    let appInstance = null;

    if (isSignedIn && isConfigured && containerRef.current) {
      // Clear container before mounting to prevent duplicate widgets
      containerRef.current.innerHTML = '';

      try {
        appInstance = createChat({
          webhookUrl: webhookUrl,
          webhookConfig: {
            method: 'POST',
            headers: {
              ...(N8N_CONFIG.webhookConfig?.headers || {}),
              'X-Employee-Name': employeeName,
              'X-Employee-Email': employeeEmail,
              'X-Employee-Id': user?.id || ''
            }
          },
          target: containerRef.current,
          mode: 'fullscreen',
          showWindowCloseButton: false,
          showWelcomeScreen: false,
          loadPreviousSession: true,
          initialMessages: [
            `Hello ${employeeName}! I am your Meridian IT & HR Assistant.`,
            `Your session is verified as: ${employeeName} <${employeeEmail}>.`,
            'Any support ticket you raise will automatically use your verified name and email.'
          ],
          metadata: {
            employeeName,
            employeeEmail,
            employeeId: user?.id || '',
            source: 'meridian_helpdesk_agent'
          },
          i18n: {
            en: {
              title: '',
              subtitle: '',
              footer: '',
              getStarted: 'Start Helpdesk Conversation',
              inputPlaceholder: `Ask or raise ticket as ${employeeName} (${employeeEmail})...`,
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
  }, [isSignedIn, isConfigured, webhookUrl, employeeName, employeeEmail]);

  // Handle suggested prompt clicks: require authentication and populate input
  const handlePromptClick = (promptText) => {
    if (!isSignedIn) {
      clerk.openSignIn();
      return;
    }

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
      n8nTextarea.setSelectionRange(promptText.length, promptText.length);
    }
  };

  // Helper to instantly autofill a ticket prompt with Clerk credentials into chatbot
  const handleAutofillTicketInChat = (customIssue = '') => {
    if (!isSignedIn) {
      clerk.openSignIn();
      return;
    }

    const ticketPrompt = `Please raise a support ticket:
- Requester Name: ${employeeName}
- Requester Email: ${employeeEmail}
- Category: IT Helpdesk
- Issue: ${customIssue || ''}`;

    handlePromptClick(ticketPrompt);
  };

  // Handle pending external questions (from Header search or Policy cards)
  useEffect(() => {
    if (pendingQuestion) {
      if (isSignedIn) {
        handlePromptClick(pendingQuestion);
      }
      onClearPendingQuestion && onClearPendingQuestion();
    }
  }, [pendingQuestion, isSignedIn]);

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
              <span>{getGreeting()}, {employeeName} 👋</span>
              {isSignedIn ? (
                <span className="welcome-badge-online">Helpdesk Active</span>
              ) : (
                <span className="welcome-badge-locked">Sign In Required</span>
              )}
            </h2>
            <p>
              {isSignedIn
                ? `Verified as ${employeeEmail}. Tickets and requests will automatically link to this account.`
                : 'Please sign in to activate the AI Helpdesk Assistant and access support services.'}
            </p>
          </div>
        </div>

        {/* Status Pill & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isSignedIn && (
            <button
              className="chat-btn-raise-ticket"
              onClick={() => handleAutofillTicketInChat()}
              title="Autofill ticket request with your Clerk details into chat"
            >
              <Ticket size={14} style={{ marginRight: 6 }} />
              <span>Autofill Ticket in Chat</span>
            </button>
          )}

          {isSignedIn ? (
            <div
              id="chat-status-pill"
              className={`chat-status-pill ${isConfigured ? 'connected' : 'ready-to-connect'}`}
              onClick={onOpenConfig}
              title={isConfigured ? `Configured endpoint: ${webhookUrl}` : 'Click to configure n8n Chat Trigger webhook'}
            >
              <span>{isConfigured ? '⚡' : '⚙️'}</span>
              <span>{isConfigured ? 'Endpoint Configured' : 'Webhook Not Configured'}</span>
            </div>
          ) : (
            <div
              id="chat-status-pill"
              className="chat-status-pill locked"
              onClick={() => clerk.openSignIn()}
              title="Click to sign in to access the chatbot"
            >
              <span>🔒</span>
              <span>Sign In Required</span>
            </div>
          )}
        </div>
      </div>

      {/* Clerk Identity Verification Strip — Shows active autofill status */}
      {isSignedIn && (
        <div className="chat-clerk-synced-strip">
          <div className="clerk-synced-badge">
            <ShieldCheck size={15} color="#107C41" />
            <span>Clerk Identity Active: <strong>{employeeName}</strong> (<code>{employeeEmail}</code>)</span>
          </div>
          <div className="clerk-synced-actions">
            <button 
              className="btn-autofill-ticket-prompt"
              onClick={() => handleAutofillTicketInChat()}
              title="Autofill support ticket request directly into chatbot"
            >
              <Ticket size={13} style={{ marginRight: 5 }} />
              <span>Autofill Ticket in Chat</span>
            </button>
            <button
              className="btn-open-ticket-modal-quick"
              onClick={() => onOpenRaiseTicket && onOpenRaiseTicket()}
              title="Open structured ticket submission form"
            >
              <span>Open Form</span>
            </button>
          </div>
        </div>
      )}

      {/* Suggested Employee Prompts Bar */}
      <div className="chat-prompts-section">
        <div className="prompts-label-row">
          <span className="prompts-label">
            <Sparkles size={14} style={{ marginRight: 6 }} />
            Popular Employee Questions (Autofills Your Clerk Identity)
          </span>
          <span style={{ fontSize: 11, color: '#8A8886' }}>
            {!isSignedIn
              ? 'Sign in required to ask questions'
              : (isConfigured ? 'Click to insert with your Clerk details' : 'Configure webhook to ask')}
          </span>
        </div>

        <div className="prompts-scroll-deck">
          {promptPills.map((pill, idx) => {
            const Icon = pill.icon;
            return (
              <button
                key={idx}
                className={`prompt-pill-card ${pill.type} ${!isSignedIn ? 'locked-prompt-pill' : ''}`}
                onClick={() => handlePromptClick(pill.prompt)}
                title={!isSignedIn ? 'Sign in to use this question' : pill.prompt}
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
        {/* If signed in: Mount the official @n8n/chat widget */}
        {isSignedIn && (
          <div
            id="n8n-chat-container"
            ref={containerRef}
            className={isConfigured ? 'active' : ''}
            style={{ width: '100%', height: '100%' }}
          />
        )}

        {/* If NOT signed in: Display the dedicated authentication required gate */}
        {!isSignedIn && (
          <div className="chat-auth-gate-container">
            <div className="chat-auth-gate-card">
              <div className="chat-auth-gate-icon">
                <Lock size={32} />
              </div>
              <h3>Sign In Required to Use the AI Chatbot</h3>
              <p>
                The Meridian IT & HR Helpdesk Assistant is restricted to authenticated employees.
                Please sign in to troubleshoot IT issues, request equipment, submit support tickets, or search company policies.
              </p>

              <div className="chat-auth-gate-actions">
                <button
                  className="chat-auth-gate-btn-primary"
                  onClick={() => clerk.openSignIn()}
                >
                  <Lock size={15} style={{ marginRight: 6 }} />
                  Sign In to Access Chatbot
                </button>
                <button
                  className="chat-auth-gate-btn-secondary"
                  onClick={() => clerk.openSignUp()}
                >
                  Create an Account
                </button>
              </div>

              <div className="chat-auth-gate-features">
                <div className="gate-feature-item">
                  <ShieldCheck size={16} color="var(--teams-purple)" />
                  <span>Secure Meridian SSO & Role-Based Access</span>
                </div>
                <div className="gate-feature-item">
                  <Bot size={16} color="var(--teams-purple)" />
                  <span>Interactive IT & HR AI Resolution</span>
                </div>
                <div className="gate-feature-item">
                  <UserCheck size={16} color="var(--teams-purple)" />
                  <span>Automatic Ticket Identification with Clerk</span>
                </div>
              </div>

              <div className="chat-auth-gate-footer">
                Secured by Meridian Corporate Authentication & Clerk
              </div>
            </div>
          </div>
        )}

        {/* If signed in but webhook not configured: Display setup card */}
        {isSignedIn && !isConfigured && (
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

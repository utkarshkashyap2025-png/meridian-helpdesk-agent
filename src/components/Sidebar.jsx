import React from 'react';
import { MessageSquare, Ticket, FileText, Wrench, HelpCircle } from 'lucide-react';
import meridianLogo from '../assets/meridian-logo.svg';

export default function Sidebar({ activeTab, onSelectTab, isOpen, onCloseMobile, onOpenConfig }) {
  const navItems = [
    {
      id: 'chat',
      label: 'Chat',
      tooltip: 'AI Helpdesk Chat',
      icon: MessageSquare,
      badge: null
    },
    {
      id: 'tickets',
      label: 'My Tickets',
      tooltip: 'Support Tickets & Requests',
      icon: Ticket,
      badge: null
    },
    {
      id: 'hr-policies',
      label: 'HR Policies',
      tooltip: 'HR Policies',
      icon: FileText,
      badge: null
    },
    {
      id: 'it-support',
      label: 'IT Support',
      tooltip: 'IT Support',
      icon: Wrench,
      badge: null
    }
  ];

  return (
    <>
      <nav 
        className={`app-sidebar ${isOpen ? 'open' : ''}`} 
        role="navigation" 
        aria-label="Main Navigation"
      >
        <div className="sidebar-logo-container">
          <div 
            className="sidebar-logo-icon" 
            title="Meridian Helpdesk"
            onClick={() => onSelectTab('chat')}
          >
            <img src={meridianLogo} alt="Meridian Icon" />
          </div>
          <span className="sidebar-logo-label">Meridian</span>
        </div>

        {/* Navigation List */}
        <ul className="sidebar-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  className={`nav-item-btn ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  title={item.tooltip}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="nav-icon-wrap">
                    <Icon size={20} />
                    {item.badge && (
                      <span className="nav-badge" title={`${item.badge} Active Tickets`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="nav-label-text">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Bottom System & Config Strip */}
        <div className="sidebar-footer">
          <button
            className="sidebar-footer-btn"
            title="Configure n8n Chatbot Webhook"
            aria-label="Open Configuration Guide"
            onClick={onOpenConfig}
          >
            <HelpCircle size={18} />
            <span className="footer-btn-label">Help / Setup</span>
          </button>
        </div>
      </nav>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop active"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
    </>
  );
}

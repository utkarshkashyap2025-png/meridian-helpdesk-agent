import React from 'react';
import { MessageSquare, FileText, Wrench, HelpCircle } from 'lucide-react';
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
                  data-tooltip={item.tooltip}
                  aria-label={item.label}
                >
                  <div className="nav-icon-wrap">
                    <Icon size={20} />
                    {item.badge && (
                      <span className="nav-badge" title={`${item.badge} Active Tickets`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Bottom Sidebar Utilities */}
        <div className="sidebar-bottom-tools">
          <button
            className="sidebar-tool-btn"
            id="sidebar-help-btn"
            data-tooltip="n8n Connection Guide"
            aria-label="Help & Configuration"
            onClick={onOpenConfig}
          >
            <HelpCircle size={19} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onCloseMobile}
      />
    </>
  );
}

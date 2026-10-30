import React, { useState, useRef, useEffect } from 'react';
import { Search, Settings, ChevronDown, Menu, Ticket } from 'lucide-react';
import { OFFICIAL_POLICIES } from '../data/policies.js';
import { SignInButton, SignUpButton, Show, UserButton, useAuth, useClerk } from '@clerk/react';
import meridianLogo from '../assets/meridian-logo.svg';

const IT_CATALOG_ITEMS = [
  { title: 'Apple MacBook Pro 16" (M3 Pro)', tab: 'it-support', category: 'IT Hardware' },
  { title: 'Lenovo ThinkPad X1 Carbon Gen 12', tab: 'it-support', category: 'IT Hardware' },
  { title: 'Dell UltraSharp 34" Curved USB-C Hub', tab: 'it-support', category: 'IT Hardware' },
  { title: 'YubiKey 5C NFC Security Key', tab: 'it-support', category: 'IT Security' },
  { title: 'GitHub Copilot Business Seat', tab: 'it-support', category: 'IT Software' },
  { title: 'Figma Enterprise Full Editor Seat', tab: 'it-support', category: 'IT Software' }
];

const SEARCH_INDEX = [
  ...OFFICIAL_POLICIES.map((p) => ({
    title: p.title,
    tab: 'hr-policies',
    category: p.categoryLabel || 'Policy'
  })),
  ...IT_CATALOG_ITEMS
];

export default function Header({ 
  onToggleSidebar, 
  onNavigateTab, 
  onAskBot, 
  onOpenConfig,
  onOpenRaiseTicket
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  const { isSignedIn } = useAuth();
  const clerk = useClerk();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchMatches = searchQuery.trim()
    ? SEARCH_INDEX.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onAskBot(searchQuery.trim());
      setSearchQuery('');
      setShowSearchResults(false);
    }
  };

  const handleSelectResult = (item) => {
    if (item.tab === 'chat' && !isSignedIn) {
      clerk.openSignIn();
    }
    onNavigateTab(item.tab);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  return (
    <header className="top-header" role="banner">
      <div className="header-brand-group">
        <button 
          id="mobile-menu-toggle" 
          className="mobile-menu-btn" 
          aria-label="Toggle navigation menu"
          onClick={onToggleSidebar}
        >
          <Menu size={20} />
        </button>
        <div className="brand-logo-wrap">
          <img src={meridianLogo} alt="Meridian Logo" />
        </div>
        <div className="header-title-block">
          <h1 className="header-app-title">Meridian Employee Helpdesk</h1>
          <span className="header-app-subtitle">Enterprise IT & HR Support</span>
        </div>
      </div>

      {/* Center Search Field */}
      <div className="header-search-wrap" ref={searchRef}>
        <div className="search-input-box">
          <Search size={16} style={{ marginRight: 8, opacity: 0.8 }} />
          <input
            type="text"
            id="header-global-search"
            className="search-input-field"
            placeholder="Search policies, IT catalog, or ask a question..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            onKeyDown={handleSearchSubmit}
            aria-label="Universal Helpdesk Search"
          />
          <span className="search-kbd-shortcut">↵ Enter</span>
        </div>

        {/* Live Search Suggestion Dropdown */}
        {showSearchResults && searchQuery.trim() && (
          <div className="search-results-dropdown active">
            <div className="search-results-header">
              <span>Suggestions & Knowledge Base</span>
            </div>
            {searchMatches.length > 0 ? (
              <>
                {searchMatches.slice(0, 6).map((m, idx) => (
                  <div
                    key={idx}
                    className="search-result-item"
                    onClick={() => handleSelectResult(m)}
                  >
                    <div className="search-result-icon">
                      {m.tab === 'hr-policies' ? '📜' : '💻'}
                    </div>
                    <div className="search-result-meta">
                      <span className="search-result-title">{m.title}</span>
                      <span className="search-result-category">{m.category}</span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ padding: '12px 16px', color: '#8A8886', fontSize: '13px' }}>
                No direct matches. Press Enter to ask Meridian Assistant.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Actions & Profile */}
      <div className="header-actions-group">
        <div className="header-status-badge" title="All Meridian enterprise systems are operational">
          <span className="status-dot-pulse"></span>
          <span>Systems Normal</span>
        </div>

        {/* Raise Ticket Button */}
        <button
          className="header-raise-ticket-btn"
          id="btn-raise-ticket-header"
          title="Raise a Support Ticket with your Clerk account details"
          onClick={() => {
            if (!isSignedIn) {
              clerk.openSignIn();
              return;
            }
            onOpenRaiseTicket && onOpenRaiseTicket();
          }}
        >
          <Ticket size={14} />
          <span>Raise Ticket</span>
        </button>

        <button
          className="header-icon-btn"
          id="btn-open-config"
          title="Configure n8n Chat Trigger"
          aria-label="Settings and n8n webhook configuration"
          onClick={onOpenConfig}
        >
          <Settings size={18} />
        </button>

        {/* User Auth Controls */}
        <Show when="signed-out">
          <div className="header-auth-buttons">
            <SignInButton mode="modal">
              <button className="header-auth-btn header-sign-in-btn">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="header-auth-btn header-sign-up-btn">Sign Up</button>
            </SignUpButton>
          </div>
        </Show>

        <Show when="signed-in">
          <div className="header-user-btn-wrap">
            <UserButton
              showName
              appearance={{
                elements: {
                  userButtonOuterIdentifier: {
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '13px'
                  }
                }
              }}
            />
          </div>
        </Show>
      </div>
    </header>
  );
}

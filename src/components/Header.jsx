import React, { useState, useRef, useEffect } from 'react';
import { Search, Settings, ChevronDown, Menu } from 'lucide-react';
import { OFFICIAL_POLICIES } from '../data/policies.js';
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
  onOpenConfig 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileCard(false);
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
            onFocus={() => setShowSearchResults(Boolean(searchQuery.trim()))}
            onKeyDown={handleSearchSubmit}
            autoComplete="off"
          />
          <span className="search-kbd-shortcut">↵ Enter</span>
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && (
          <div className="search-results-dropdown active">
            {searchMatches.length > 0 ? (
              <>
                <div className="search-group-title">Helpdesk Resources</div>
                {searchMatches.map((m, idx) => (
                  <div
                    key={idx}
                    className="search-result-item"
                    onClick={() => handleSelectResult(m)}
                  >
                    <div className="search-result-icon">
                      {m.tab === 'hr-policies' ? '📜' : '🛠️'}
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

        <button
          className="header-icon-btn"
          id="btn-open-config"
          title="Configure n8n Chat Trigger"
          aria-label="Settings and n8n webhook configuration"
          onClick={onOpenConfig}
        >
          <Settings size={18} />
        </button>

        {/* User Profile Chip */}
        <div
          className="user-profile-chip"
          id="user-profile-chip"
          ref={profileRef}
          onClick={() => setShowProfileCard(!showProfileCard)}
          title="Alex Morgan - Product & Systems"
        >
          <div className="user-avatar-wrap">
            <span>AM</span>
            <span className="presence-indicator" title="Available"></span>
          </div>
          <span className="user-name-label">Alex Morgan</span>
          <ChevronDown size={14} />

          {/* Profile Popover Card */}
          {showProfileCard && (
            <div className="profile-dropdown-card active" onClick={(e) => e.stopPropagation()}>
              <div className="profile-card-header">
                <div className="profile-card-avatar">AM</div>
                <div className="profile-card-info">
                  <h4>Alex Morgan</h4>
                  <p>alex.morgan@meridian.corp</p>
                  <span className="profile-card-tag">Engineering & Design</span>
                </div>
              </div>
              <div className="profile-card-details">
                <div className="profile-detail-row">
                  <span>Employee ID</span>
                  <strong>MRD-84291</strong>
                </div>
                <div className="profile-detail-row">
                  <span>Location</span>
                  <strong>Seattle, WA (Remote)</strong>
                </div>
                <div className="profile-detail-row">
                  <span>Assigned IT Lead</span>
                  <strong>Marcus Vance</strong>
                </div>
                <div className="profile-detail-row">
                  <span>Presence</span>
                  <span style={{ color: '#107C41', fontWeight: 600 }}>● Available</span>
                </div>
              </div>
              <div className="profile-card-footer">
                UI Profile Placeholder — Meridian Internal SSO
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

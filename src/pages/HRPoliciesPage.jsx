import React, { useState, useMemo } from 'react';
import { OFFICIAL_POLICIES } from '../data/policies.js';

export default function HRPoliciesPage({ onAskBot, onShowToast }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePolicy, setActivePolicy] = useState(null);

  // Derive available categories dynamically from the official policies
  const categories = useMemo(() => {
    const list = [{ id: 'all', label: 'All Topics' }];
    const seen = new Set();
    OFFICIAL_POLICIES.forEach((p) => {
      if (p.category && !seen.has(p.category)) {
        seen.add(p.category);
        list.push({ id: p.category, label: p.categoryLabel || p.category });
      }
    });
    return list;
  }, []);

  const filteredPolicies = OFFICIAL_POLICIES.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = (p.title || '').toLowerCase().includes(q);
      const matchesSummary = (p.summary || '').toLowerCase().includes(q);
      const matchesCategory = (p.categoryLabel || '').toLowerCase().includes(q);
      if (!matchesTitle && !matchesSummary && !matchesCategory) return false;
    }
    return true;
  });

  return (
    <section id="tab-hr-policies" className="tab-panel active" aria-label="HR Policies">
      <div className="policies-container">
        {/* Notice Bar */}
        <div className="placeholder-notice-bar" style={{ background: 'var(--navy-light)', borderBottomColor: 'var(--color-border)', color: 'var(--color-primary-navy)' }}>
          <span className="notice-tag" style={{ background: 'var(--color-primary-navy)' }}>Official Knowledge Base</span>
          <span className="notice-text">
            Meridian Official Employee Policy & Benefits Library. Searching policies queries directly against your n8n AI knowledge base.
          </span>
        </div>

        <div className="policies-hero-header">
          <div className="policies-hero-content">
            <h2>📜 Meridian Employee Policies & Benefits</h2>
            <p>
              Browse official company guidelines, time-off regulations, healthcare options, and corporate policies. You can ask the Meridian Assistant about any policy directly.
            </p>
          </div>
        </div>

        {/* Toolbar */}
        {OFFICIAL_POLICIES.length === 0 ? (
          <div
            style={{
              background: 'var(--color-warm-white)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '48px 32px',
              textAlign: 'center',
              maxWidth: '720px',
              margin: '32px auto',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                background: 'var(--navy-light)',
                color: 'var(--color-primary-navy)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                marginBottom: '16px'
              }}
            >
              📜
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-primary-text)', marginBottom: '8px' }}>
              Awaiting Official Policy Documents (.docx)
            </h3>
            <p style={{ fontSize: '13.5px', color: '#616161', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 20px auto' }}>
              No generic or placeholder policies are displayed. Place your official Microsoft Word (<code>.docx</code>) documents in the <code>policies-source/</code> folder to display and read them here.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                className="new-ticket-btn"
                onClick={() => onAskBot('What employee HR policies are available in the company knowledge base?')}
                style={{ height: '38px', padding: '0 20px', fontSize: '13px' }}
              >
                💬 Ask Meridian Assistant in Chat
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="policies-filter-toolbar">
              <div className="policy-categories-strip">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`policy-cat-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <input
                type="text"
                className="policy-search-box"
                placeholder="Search official policy titles or summaries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Policies Grid */}
            <div className="policies-grid">
              {filteredPolicies.length > 0 ? (
                filteredPolicies.map((p) => (
                  <div key={p.id} className="policy-card">
                    <div className="policy-card-top">
                      <span className="policy-category-tag">{p.categoryLabel}</span>
                      <h3 className="policy-card-title">{p.title}</h3>
                      <p className="policy-card-desc">{p.summary}</p>
                    </div>
                    <div>
                      <div className="policy-card-meta">
                        <span>⏱️ {p.readTime || '3 min read'}</span>
                        <span>📅 Updated {p.updated || '2026'}</span>
                      </div>
                      <div className="policy-card-actions">
                        <button
                          className="btn-read-policy"
                          onClick={() => setActivePolicy(p)}
                        >
                          Read Policy →
                        </button>
                        <button
                          className="btn-ask-bot-policy"
                          onClick={() => onAskBot(`What are the key guidelines for: ${p.title}?`)}
                          title="Ask Meridian Helpdesk Assistant about this policy"
                        >
                          💬 Ask Assistant
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '48px',
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px dashed #EDEBE9'
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>📖</div>
                  <div style={{ fontWeight: 600, color: '#242424', fontSize: '15px' }}>
                    No policies match your search
                  </div>
                  <p style={{ fontSize: '13px', color: '#8A8886', marginTop: '4px' }}>
                    Try a different keyword or category.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Policy Reader Modal */}
      {activePolicy && (
        <div
          className="policy-modal-backdrop active"
          onClick={() => setActivePolicy(null)}
        >
          <div
            className="policy-modal"
            role="dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="policy-modal-header">
              <div>
                <span className="policy-category-tag" style={{ marginBottom: 4 }}>
                  {activePolicy.categoryLabel}
                </span>
                <h3>{activePolicy.title}</h3>
              </div>
              <button
                className="config-close-btn"
                aria-label="Close policy reader"
                onClick={() => setActivePolicy(null)}
              >
                ✕
              </button>
            </div>

            <div
              className="policy-modal-body"
              dangerouslySetInnerHTML={{ __html: activePolicy.fullContent }}
            />

            <div className="ticket-modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              {activePolicy.downloadUrl ? (
                <a
                  href={activePolicy.downloadUrl}
                  download={activePolicy.filename || true}
                  className="btn-secondary"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  📥 Download Original ({activePolicy.filename || '.docx'})
                </a>
              ) : <div />}
              <button
                className="new-ticket-btn"
                onClick={() => {
                  const q = `Can you summarize the policy on: ${activePolicy.title}?`;
                  setActivePolicy(null);
                  onAskBot(q);
                }}
              >
                💬 Ask Assistant About This Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

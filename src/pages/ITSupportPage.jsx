import React, { useState } from 'react';
import { Wifi, Zap, Shield, Laptop, Monitor, Key, Sparkles, Terminal } from 'lucide-react';

const HARDWARE_ITEMS = [
  {
    id: 'HW-01',
    category: 'Laptops',
    title: 'Apple MacBook Pro 16" (M3 Pro)',
    specs: '16-core GPU, 36GB Unified Memory, 512GB SSD, Space Black. Standard engineering & design profile.',
    leadTime: 'Est. delivery: 2–3 days',
    icon: '💻'
  },
  {
    id: 'HW-02',
    category: 'Laptops',
    title: 'Lenovo ThinkPad X1 Carbon Gen 12',
    specs: 'Intel Core Ultra 7 155H, 32GB LPDDR5x, 1TB PCIe Gen4 SSD, 14" 2.8K OLED. Business & analytics tier.',
    leadTime: 'Est. delivery: 2–3 days',
    icon: '💻'
  },
  {
    id: 'HW-03',
    category: 'Displays',
    title: 'Dell UltraSharp 34" Curved USB-C Hub (U3423WE)',
    specs: 'WQHD 3440 x 1440, 90W Power Delivery, RJ45 Ethernet, Integrated KVM switch with dual PC support.',
    leadTime: 'In stock at local office',
    icon: '🖥️'
  },
  {
    id: 'HW-04',
    category: 'Security',
    title: 'Yubico YubiKey 5C NFC Security Key',
    specs: 'FIDO2 / WebAuthn, U2F, Smart Card hardware token for passwordless MFA & Zero Trust compliance.',
    leadTime: 'Immediate dispatch',
    icon: '🔑'
  }
];

const SOFTWARE_ITEMS = [
  {
    id: 'SW-01',
    category: 'AI & Developer',
    title: 'GitHub Copilot Business Seat',
    specs: 'AI-assisted code completions, multi-language context, security vulnerability filtering.',
    approval: 'Auto-approved for R&D engineers',
    icon: '🤖'
  },
  {
    id: 'SW-02',
    category: 'Design',
    title: 'Figma Enterprise Full Editor Seat',
    specs: 'Design systems sync, branch reviews, interactive prototyping, Dev Mode inspection.',
    approval: 'Manager approval required',
    icon: '🎨'
  },
  {
    id: 'SW-03',
    category: 'Creative',
    title: 'Adobe Creative Cloud All Apps',
    specs: 'Photoshop, Illustrator, Premiere Pro, After Effects, Acrobat Pro DC cloud license.',
    approval: 'Marketing & Design teams',
    icon: '✨'
  },
  {
    id: 'SW-04',
    category: 'Developer',
    title: 'JetBrains All Products Pack',
    specs: 'IntelliJ IDEA Ultimate, PyCharm Professional, WebStorm, CLion, GoLand suite.',
    approval: 'Auto-approved for Engineering',
    icon: '⚡'
  }
];

export default function ITSupportPage({ onShowToast, onOpenRaiseTicket }) {
  const [latencyText, setLatencyText] = useState('17ms (Optimal)');
  const [isPinging, setIsPinging] = useState(false);

  const handleRunPing = () => {
    setIsPinging(true);
    setLatencyText('Testing...');

    setTimeout(() => {
      const ping = Math.floor(Math.random() * 8) + 14; // 14ms - 22ms
      setLatencyText(`${ping}ms`);
      setIsPinging(false);
      onShowToast(`✓ Diagnostic completed: Meridian-Secure Wi-Fi latency is ${ping}ms (Optimal).`, 'success');
    }, 850);
  };

  const handleRequestHardware = (title) => {
    if (onOpenRaiseTicket) {
      onOpenRaiseTicket({
        category: 'IT Hardware',
        subject: `Hardware Provisioning Request: ${title}`,
        description: `Requesting enterprise hardware allocation for: ${title}. Please process for employee deployment.`
      });
    } else {
      onShowToast(`Hardware request initiated for "${title}".`, 'info');
    }
  };

  const handleRequestSoftware = (title) => {
    if (onOpenRaiseTicket) {
      onOpenRaiseTicket({
        category: 'IT Software',
        subject: `Software License Provisioning: ${title}`,
        description: `Requesting enterprise license seat assignment for: ${title}. Need access for project deliverables.`
      });
    } else {
      onShowToast(`License provisioning request for "${title}".`, 'info');
    }
  };

  return (
    <section id="tab-it-support" className="tab-panel active" aria-label="IT Support">
      <div className="it-support-container">
        {/* Notice Bar */}
        <div className="placeholder-notice-bar">
          <span className="notice-tag">Demonstration UI</span>
          <span className="notice-text">
            IT Hardware & Software Provisioning Catalog. Hardware orders and diagnostic actions are demonstration prototypes and connect through your corporate ticketing workflow.
          </span>
        </div>

        <div className="it-hero-header">
          <div className="it-hero-content">
            <h2>🛠️ Enterprise IT Hardware & Services Catalog</h2>
            <p>
              Self-service hardware refreshes, enterprise software licensing, and local connection diagnostics.
            </p>
          </div>
        </div>

        {/* Diagnostics Widget */}
        <div className="it-quick-status-grid">
          <div className="it-status-card">
            <div className="status-card-info">
              <div className="status-card-icon">📶</div>
              <div className="status-card-text">
                <h4>Meridian-Secure Wi-Fi</h4>
                <p>802.11ax WPA3 Enterprise</p>
              </div>
            </div>
            <span className="status-badge-chip online">Connected</span>
          </div>

          <div className="it-status-card">
            <div className="status-card-info">
              <div className="status-card-icon">⚡</div>
              <div className="status-card-text">
                <h4>Corporate Gateway Latency</h4>
                <p>{latencyText}</p>
              </div>
            </div>
            <button
              className="btn-run-diag"
              onClick={handleRunPing}
              disabled={isPinging}
              title="Test Wi-Fi and VPN roundtrip latency"
            >
              <span>⚡</span>
              <span>{isPinging ? 'Testing Latency...' : 'Run Diagnostic Ping'}</span>
            </button>
          </div>

          <div className="it-status-card">
            <div className="status-card-info">
              <div className="status-card-icon">🔒</div>
              <div className="status-card-text">
                <h4>Okta SSO Session</h4>
                <p>Token expires in 6 hours</p>
              </div>
            </div>
            <span className="status-badge-chip online">Active MFA</span>
          </div>
        </div>

        {/* Hardware Catalog */}
        <div className="it-section-heading">
          <h3>Standard Hardware Refresh Catalog</h3>
          <span style={{ fontSize: 12, color: '#8A8886' }}>
            Standard 24-month refresh cycle eligibility
          </span>
        </div>
        <div className="it-catalog-grid">
          {HARDWARE_ITEMS.map((item) => (
            <div key={item.id} className="catalog-item-card">
              <div>
                <div className="catalog-item-icon-row">
                  <span style={{ fontSize: 26 }}>{item.icon}</span>
                  <span className="catalog-item-badge">{item.category}</span>
                </div>
                <h4 className="catalog-item-title">{item.title}</h4>
                <p className="catalog-item-specs">{item.specs}</p>
              </div>
              <div className="catalog-item-footer">
                <span className="catalog-lead-time">🕒 {item.leadTime}</span>
                <button
                  className="btn-request-item"
                  onClick={() => handleRequestHardware(item.title)}
                >
                  Request Item
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Software Catalog */}
        <div className="it-section-heading">
          <h3>Enterprise Software & License Requests</h3>
          <span style={{ fontSize: 12, color: '#8A8886' }}>
            Automated manager routing via Okta
          </span>
        </div>
        <div className="it-catalog-grid">
          {SOFTWARE_ITEMS.map((item) => (
            <div key={item.id} className="catalog-item-card">
              <div>
                <div className="catalog-item-icon-row">
                  <span style={{ fontSize: 26 }}>{item.icon}</span>
                  <span
                    className="catalog-item-badge"
                    style={{ background: '#F4ECF8', color: '#7B3F98' }}
                  >
                    {item.category}
                  </span>
                </div>
                <h4 className="catalog-item-title">{item.title}</h4>
                <p className="catalog-item-specs">{item.specs}</p>
              </div>
              <div className="catalog-item-footer">
                <span className="catalog-lead-time" style={{ fontSize: 11 }}>
                  🔒 {item.approval}
                </span>
                <button
                  className="btn-request-item"
                  style={{ background: '#0078D4' }}
                  onClick={() => handleRequestSoftware(item.title)}
                >
                  Request License
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

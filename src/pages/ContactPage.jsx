import React from 'react';
import { 
  Phone, 
  Mail, 
  ExternalLink, 
  LifeBuoy, 
  Users, 
  Wrench, 
  Info, 
  Ticket,
  User,
  Clock
} from 'lucide-react';
import { DEPARTMENT_CONTACTS } from '../config/departmentContacts.js';

export default function ContactPage({ onOpenRaiseTicket, onAskBot, onShowToast }) {
  const hrConfig = DEPARTMENT_CONTACTS?.hr || {};
  const itConfig = DEPARTMENT_CONTACTS?.it || {};

  // Check which direct contact methods are configured
  const hrPhone = (hrConfig.phoneNumber || hrConfig.phone || '').trim();
  const hrEmail = (hrConfig.emailAddress || hrConfig.email || '').trim();
  const hrUrl = (hrConfig.communicationUrl || hrConfig.contactUrl || '').trim();

  const itPhone = (itConfig.phoneNumber || itConfig.phone || '').trim();
  const itEmail = (itConfig.emailAddress || itConfig.email || '').trim();
  const itUrl = (itConfig.communicationUrl || itConfig.contactUrl || '').trim();

  const hasHrPhone = Boolean(hrPhone);
  const hasHrEmail = Boolean(hrEmail);
  const hasHrUrl = Boolean(hrUrl);

  const hasItPhone = Boolean(itPhone);
  const hasItEmail = Boolean(itEmail);
  const hasItUrl = Boolean(itUrl);

  return (
    <section id="tab-contact" className="tab-panel active" aria-label="Contact HR & IT">
      <div className="contact-page-container">
        
        {/* Page Hero Header */}
        <div className="contact-hero-header">
          <div className="contact-hero-content">
            <h2>
              <LifeBuoy size={24} style={{ color: 'var(--teams-purple)' }} />
              Direct Contact & Human Escalation
            </h2>
            <p>
              Direct contact channels for urgent employee matters, emergency assistance, and escalations when you need to speak directly with a human specialist rather than relying only on the AI chatbot.
            </p>
          </div>
          <div>
            <button
              className="btn-raise-ticket-contact"
              onClick={() => onOpenRaiseTicket && onOpenRaiseTicket()}
              title="Raise a Support Ticket with your authenticated employee account"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 18px',
                borderRadius: 6,
                border: '1px solid var(--border-subtle)',
                background: 'var(--teams-purple)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Ticket size={16} />
              <span>Raise Support Ticket</span>
            </button>
          </div>
        </div>

        {/* ====================================================================
            OFFICIAL DEPARTMENT CONTACT CHANNELS (HR & IT Support Cards)
            ==================================================================== */}
        <section aria-labelledby="department-cards-heading">
          <div className="department-section-header">
            <h3 id="department-cards-heading">
              Official Department Contact Channels
            </h3>
            <span className="department-section-subtext">
              Direct departmental escalation contacts and support specialists
            </span>
          </div>

          <div className="department-cards-grid">
            
            {/* 1. Human Resources (HR) Department Card */}
            <article className="department-contact-card hr-card" aria-labelledby="hr-card-title">
              <div>
                <div className="card-header-block">
                  <div className="card-icon-badge" aria-hidden="true">
                    <Users size={22} />
                  </div>
                  <div className="card-title-group">
                    <span className="card-dept-tag">Human Resources</span>
                    <h3 id="hr-card-title">{hrConfig.departmentName || 'Human Resources (HR)'}</h3>
                  </div>
                </div>

                {/* Contact Person & Designation */}
                {hrConfig.contactPerson && (
                  <div className="card-rep-badge">
                    <User size={14} style={{ color: 'var(--teams-purple)' }} />
                    <strong>{hrConfig.contactPerson}</strong>
                    <span className="card-rep-title">• {hrConfig.designation}</span>
                  </div>
                )}

                {/* Contact Purpose */}
                {hrConfig.contactPurpose && (
                  <div className="card-purpose-block">
                    <strong>Contact Purpose:</strong> {hrConfig.contactPurpose}
                  </div>
                )}

                <p className="card-description">
                  {hrConfig.description || 'For urgent employee matters, workplace concerns, leave and attendance issues, payroll queries, employee relations, and other HR-related matters.'}
                </p>

                {/* Contact Methods */}
                <div className="contact-methods-list">
                  
                  {/* HR Phone Method */}
                  <div className="contact-method-row">
                    <div className="method-label-group">
                      <div className="method-icon">
                        <Phone size={15} />
                      </div>
                      <div className="method-text-col">
                        <span className="method-type-title">HR Phone Line</span>
                        {hasHrPhone ? (
                          <span className="method-value-display">{hrPhone}</span>
                        ) : (
                          <span className="contact-unconfigured-badge">
                            <Info size={12} /> Contact details will be configured later.
                          </span>
                        )}
                      </div>
                    </div>
                    {hasHrPhone && (
                      <a 
                        href={`tel:${hrPhone.replace(/[^\d+]/g, '')}`} 
                        className="btn-contact-action"
                        aria-label={`Call HR Demo Line at ${hrPhone}`}
                      >
                        <Phone size={13} />
                        <span>Call HR</span>
                      </a>
                    )}
                  </div>

                  {/* HR Email Method */}
                  <div className="contact-method-row">
                    <div className="method-label-group">
                      <div className="method-icon">
                        <Mail size={15} />
                      </div>
                      <div className="method-text-col">
                        <span className="method-type-title">HR Email Address</span>
                        {hasHrEmail ? (
                          <span className="method-value-display">{hrEmail}</span>
                        ) : (
                          <span className="contact-unconfigured-badge">
                            <Info size={12} /> Contact details will be configured later.
                          </span>
                        )}
                      </div>
                    </div>
                    {hasHrEmail && (
                      <a 
                        href={`mailto:${hrEmail}?subject=HR%20Support%20Inquiry`} 
                        className="btn-contact-action"
                        aria-label={`Email HR Demo at ${hrEmail}`}
                      >
                        <Mail size={13} />
                        <span>Email HR</span>
                      </a>
                    )}
                  </div>

                  {/* HR Company Channel Method */}
                  <div className="contact-method-row">
                    <div className="method-label-group">
                      <div className="method-icon">
                        <ExternalLink size={15} />
                      </div>
                      <div className="method-text-col">
                        <span className="method-type-title">Company HR Channel</span>
                        {hasHrUrl ? (
                          <span className="method-value-display">Approved Teams / Workplace Channel</span>
                        ) : (
                          <span className="contact-unconfigured-badge">
                            <Info size={12} /> Contact details will be configured later.
                          </span>
                        )}
                      </div>
                    </div>
                    {hasHrUrl && (
                      <a 
                        href={hrUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-contact-action"
                        aria-label="Open HR Teams/Communication Channel in new tab"
                      >
                        <ExternalLink size={13} />
                        <span>Open Channel</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="department-card-footer">
                <span>
                  <Clock size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                  {hrConfig.officeHours ? hrConfig.officeHours : 'Monday–Friday, 9:00 AM–6:00 PM'}
                </span>
                <span>
                  🏢 {hrConfig.location ? hrConfig.location : 'Corporate HR Services'}
                </span>
              </div>
            </article>

            {/* 2. Information Technology (IT Support) Department Card */}
            <article className="department-contact-card it-card" aria-labelledby="it-card-title">
              <div>
                <div className="card-header-block">
                  <div className="card-icon-badge" aria-hidden="true">
                    <Wrench size={22} />
                  </div>
                  <div className="card-title-group">
                    <span className="card-dept-tag">IT Support</span>
                    <h3 id="it-card-title">{itConfig.departmentName || 'Information Technology (IT Support)'}</h3>
                  </div>
                </div>

                {/* Contact Person & Designation */}
                {itConfig.contactPerson && (
                  <div className="card-rep-badge">
                    <User size={14} style={{ color: 'var(--teams-blue)' }} />
                    <strong>{itConfig.contactPerson}</strong>
                    <span className="card-rep-title">• {itConfig.designation}</span>
                  </div>
                )}

                {/* Contact Purpose */}
                {itConfig.contactPurpose && (
                  <div className="card-purpose-block">
                    <strong>Contact Purpose:</strong> {itConfig.contactPurpose}
                  </div>
                )}

                <p className="card-description">
                  {itConfig.description || 'For urgent laptop or computer problems, account lockouts, login failures, network outages, security incidents, and other technical issues.'}
                </p>

                {/* Contact Methods */}
                <div className="contact-methods-list">
                  
                  {/* IT Phone Method */}
                  <div className="contact-method-row">
                    <div className="method-label-group">
                      <div className="method-icon">
                        <Phone size={15} />
                      </div>
                      <div className="method-text-col">
                        <span className="method-type-title">IT Helpdesk Phone</span>
                        {hasItPhone ? (
                          <span className="method-value-display">{itPhone}</span>
                        ) : (
                          <span className="contact-unconfigured-badge">
                            <Info size={12} /> Contact details will be configured later.
                          </span>
                        )}
                      </div>
                    </div>
                    {hasItPhone && (
                      <a 
                        href={`tel:${itPhone.replace(/[^\d+]/g, '')}`} 
                        className="btn-contact-action"
                        aria-label={`Call IT Support Demo Line at ${itPhone}`}
                      >
                        <Phone size={13} />
                        <span>Call IT Support</span>
                      </a>
                    )}
                  </div>

                  {/* IT Email Method */}
                  <div className="contact-method-row">
                    <div className="method-label-group">
                      <div className="method-icon">
                        <Mail size={15} />
                      </div>
                      <div className="method-text-col">
                        <span className="method-type-title">IT Support Email</span>
                        {hasItEmail ? (
                          <span className="method-value-display">{itEmail}</span>
                        ) : (
                          <span className="contact-unconfigured-badge">
                            <Info size={12} /> Contact details will be configured later.
                          </span>
                        )}
                      </div>
                    </div>
                    {hasItEmail && (
                      <a 
                        href={`mailto:${itEmail}?subject=IT%20Support%20Inquiry`} 
                        className="btn-contact-action"
                        aria-label={`Email IT Support Demo at ${itEmail}`}
                      >
                        <Mail size={13} />
                        <span>Email IT Support</span>
                      </a>
                    )}
                  </div>

                  {/* IT Company Channel Method */}
                  <div className="contact-method-row">
                    <div className="method-label-group">
                      <div className="method-icon">
                        <ExternalLink size={15} />
                      </div>
                      <div className="method-text-col">
                        <span className="method-type-title">Company IT Channel</span>
                        {hasItUrl ? (
                          <span className="method-value-display">Approved Teams / Workplace Channel</span>
                        ) : (
                          <span className="contact-unconfigured-badge">
                            <Info size={12} /> Contact details will be configured later.
                          </span>
                        )}
                      </div>
                    </div>
                    {hasItUrl && (
                      <a 
                        href={itUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-contact-action"
                        aria-label="Open IT Teams/Communication Channel in new tab"
                      >
                        <ExternalLink size={13} />
                        <span>Open Channel</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="department-card-footer">
                <span>
                  <Clock size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                  {itConfig.officeHours ? itConfig.officeHours : 'Demo IT Support — 24/7'}
                </span>
                <span>
                  🏢 {itConfig.location ? itConfig.location : 'Global IT Operations'}
                </span>
              </div>
            </article>

          </div>
        </section>

      </div>
    </section>
  );
}

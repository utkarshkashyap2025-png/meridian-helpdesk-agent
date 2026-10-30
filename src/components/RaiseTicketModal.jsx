import React, { useState, useEffect } from 'react';
import { useUser, useAuth, useClerk } from '@clerk/react';
import { Ticket, Send, ShieldCheck, X, AlertCircle, CheckCircle, Lock, User, Mail } from 'lucide-react';
import { N8N_CONFIG } from '../config/n8n.js';

export default function RaiseTicketModal({
  isOpen,
  onClose,
  initialCategory = 'IT Hardware',
  initialSubject = '',
  initialDescription = '',
  onTicketSubmitted,
  onShowToast
}) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();

  const [category, setCategory] = useState(initialCategory);
  const [priority, setPriority] = useState('Medium');
  const [subject, setSubject] = useState(initialSubject);
  const [description, setDescription] = useState(initialDescription);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCategory(initialCategory || 'IT Hardware');
      setSubject(initialSubject || '');
      setDescription(initialDescription || '');
    }
  }, [isOpen, initialCategory, initialSubject, initialDescription]);

  if (!isOpen) return null;

  // Retrieve employee details strictly from Clerk
  const employeeName = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Meridian Employee';
  const employeeEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || 'employee@meridian.corp';
  const employeeAvatar = user?.imageUrl;
  const initials = (employeeName || 'ME')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSignedIn) {
      onShowToast && onShowToast('Please sign in to raise a ticket', 'warning');
      clerk.openSignIn();
      return;
    }

    if (!subject.trim()) {
      onShowToast && onShowToast('Please provide a ticket subject / title', 'error');
      return;
    }

    setIsSubmitting(true);

    const ticketId = `MRD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTicket = {
      id: ticketId,
      employeeName,
      employeeEmail,
      employeeId: user?.id || '',
      category,
      priority,
      title: subject.trim(),
      description: description.trim() || 'No additional details provided.',
      status: 'Open',
      createdAt: new Date().toISOString()
    };

    // Save to local persistence so employee can see it in "My Tickets"
    try {
      const existing = JSON.parse(localStorage.getItem('meridian_tickets') || '[]');
      localStorage.setItem('meridian_tickets', JSON.stringify([newTicket, ...existing]));
    } catch (err) {
      console.warn('Could not save ticket to localStorage:', err);
    }

    // Attempt optional webhook dispatch to n8n workflow if configured
    const webhookUrl = (N8N_CONFIG.webhookUrl || '').trim();
    if (webhookUrl && !webhookUrl.includes('YOUR_PRODUCTION_WEBHOOK_URL')) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Employee-Name': employeeName,
            'X-Employee-Email': employeeEmail,
            'X-Employee-Id': user?.id || ''
          },
          body: JSON.stringify({
            event: 'ticket_created',
            ticket: newTicket,
            message: `[Ticket Raised by ${employeeName} <${employeeEmail}>]: ${newTicket.title} - ${newTicket.description}`
          })
        }).catch(() => {
          // Ignore network errors on chat webhook
        });
      } catch (err) {
        // Non-blocking
      }
    }

    setIsSubmitting(false);

    onShowToast && onShowToast(`✓ Ticket #${ticketId} created successfully for ${employeeName}!`, 'success');
    if (onTicketSubmitted) {
      onTicketSubmitted(newTicket);
    }
    onClose();
  };

  return (
    <div className="ticket-modal-backdrop active" onClick={onClose}>
      <div className="ticket-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ticket-modal-header">
          <div className="ticket-modal-title-group">
            <div className="ticket-modal-icon-badge">
              <Ticket size={22} />
            </div>
            <div>
              <h3>Raise Support Ticket</h3>
              <p>Submit an IT or HR request with your verified employee credentials</p>
            </div>
          </div>
          <button className="ticket-modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Employee Verification Card — Sourced directly from Clerk */}
        <div className="ticket-employee-clerk-card">
          <div className="ticket-employee-avatar-col">
            {employeeAvatar ? (
              <img src={employeeAvatar} alt={employeeName} className="clerk-employee-avatar" />
            ) : (
              <div className="clerk-employee-initials">{initials}</div>
            )}
          </div>
          <div className="ticket-employee-info-col">
            <div className="clerk-verified-pill">
              <ShieldCheck size={13} />
              <span>Verified Employee Details (Synced from Clerk)</span>
            </div>
            <div className="clerk-details-grid">
              <div className="clerk-detail-item">
                <span className="clerk-field-label"><User size={12} /> Employee Name</span>
                <strong className="clerk-field-value">{employeeName}</strong>
              </div>
              <div className="clerk-detail-item">
                <span className="clerk-field-label"><Mail size={12} /> Email Address</span>
                <strong className="clerk-field-value">{employeeEmail}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="ticket-modal-form">
          <div className="form-row-dual">
            <div className="form-group">
              <label htmlFor="ticket-category">Category / Department</label>
              <select
                id="ticket-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="ticket-form-input"
              >
                <option value="IT Hardware">IT Hardware (Laptop, Monitor, Peripherals)</option>
                <option value="IT Security">IT Security & MFA (Okta, Password, YubiKey)</option>
                <option value="IT Software">IT Software & Licensing (GitHub, Copilot, Figma)</option>
                <option value="IT Network">IT Network & VPN (Wi-Fi, GlobalProtect)</option>
                <option value="HR Policy">HR Policies & Remote Work</option>
                <option value="HR Benefits">HR Benefits, Healthcare & Wellness</option>
                <option value="HR Payroll">Payroll, Reimbursements & Expense</option>
                <option value="General Inquiry">General Helpdesk Inquiry</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="ticket-priority">Priority Level</label>
              <select
                id="ticket-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="ticket-form-input"
              >
                <option value="Low">Low (General question / Non-urgent)</option>
                <option value="Medium">Medium (Standard request — 24h SLA)</option>
                <option value="High">High (Work impacted — 4h SLA)</option>
                <option value="Urgent">Urgent (Critical blocker / Security — 1h SLA)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="ticket-subject">
              Ticket Subject / Issue Title <span style={{ color: '#D13438' }}>*</span>
            </label>
            <input
              id="ticket-subject"
              type="text"
              placeholder="e.g. Requesting replacement USB-C laptop charger or monitor"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="ticket-form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ticket-description">Detailed Description / Requirements</label>
            <textarea
              id="ticket-description"
              rows={4}
              placeholder="Describe your issue, affected device, or justification for this request..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="ticket-form-textarea"
            />
          </div>

          {/* Footer Actions */}
          <div className="ticket-modal-actions">
            <button type="button" className="ticket-btn-cancel" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="ticket-btn-submit" disabled={isSubmitting}>
              <Send size={15} style={{ marginRight: 6 }} />
              {isSubmitting ? 'Submitting Ticket...' : 'Submit Support Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


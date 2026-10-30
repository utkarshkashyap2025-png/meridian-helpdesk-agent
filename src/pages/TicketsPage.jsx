import React, { useState, useEffect } from 'react';
import { useUser, useAuth, useClerk } from '@clerk/react';
import { Ticket, Plus, Clock, CheckCircle2, AlertTriangle, ShieldCheck, User, Mail, MessageSquare, ExternalLink } from 'lucide-react';

export default function TicketsPage({ onOpenRaiseTicket, onAskBot, onShowToast }) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();

  const employeeName = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Employee';
  const employeeEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || 'employee@meridian.corp';

  const [tickets, setTickets] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');

  // Load tickets from localStorage or initialize with sample records associated with this employee
  useEffect(() => {
    try {
      const stored = localStorage.getItem('meridian_tickets');
      if (stored) {
        setTickets(JSON.parse(stored));
      } else {
        const initial = [
          {
            id: 'MRD-84291',
            employeeName,
            employeeEmail,
            category: 'IT Hardware',
            priority: 'Medium',
            title: 'MacBook Pro Hardware Refresh & USB-C Hub Allocation',
            description: 'Employee eligible for triennial hardware upgrade cycle. Requesting MacBook Pro 16" with 36GB memory.',
            status: 'In Progress',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            assignedTo: 'Marcus Vance'
          },
          {
            id: 'MRD-83904',
            employeeName,
            employeeEmail,
            category: 'IT Security',
            priority: 'High',
            title: 'Okta MFA Secondary Device Re-registration',
            description: 'New mobile device provisioning requires push notification and biometric setup reset.',
            status: 'Resolved',
            createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
            assignedTo: 'IT Security Ops'
          }
        ];
        localStorage.setItem('meridian_tickets', JSON.stringify(initial));
        setTickets(initial);
      }
    } catch (e) {
      console.warn('Error reading tickets:', e);
    }
  }, [employeeName, employeeEmail]);

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus === 'All') return true;
    return t.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const openCount = tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;

  return (
    <section id="tab-tickets" className="tab-panel active" aria-label="Support Tickets">
      <div className="tickets-page-container">
        {/* Hero Header */}
        <div className="tickets-hero-header">
          <div className="tickets-hero-text">
            <h2>🎫 Support Tickets & Service Requests</h2>
            <p>
              Track hardware requests, software provisioning, and HR tickets submitted under your employee account.
            </p>
          </div>
          <button
            className="btn-raise-ticket-primary"
            onClick={() => {
              if (!isSignedIn) {
                clerk.openSignIn();
                return;
              }
              onOpenRaiseTicket();
            }}
          >
            <Plus size={16} style={{ marginRight: 6 }} />
            <span>Raise New Ticket</span>
          </button>
        </div>

        {/* Identity & Account Sync Banner */}
        <div className="tickets-clerk-sync-banner">
          <div className="sync-banner-left">
            <div className="sync-badge-icon">
              <ShieldCheck size={18} />
            </div>
            <div>
              <strong>Authenticated Employee Identity (Clerk)</strong>
              <p>
                All tickets automatically access and record your verified name <strong>{employeeName}</strong> and email <strong>{employeeEmail}</strong>.
              </p>
            </div>
          </div>
          <div className="sync-banner-stats">
            <div className="sync-stat-item">
              <span>Active Requests:</span>
              <strong>{openCount}</strong>
            </div>
            <div className="sync-stat-item">
              <span>Resolved:</span>
              <strong>{resolvedCount}</strong>
            </div>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="tickets-toolbar">
          <div className="tickets-filter-pills">
            {['All', 'Open', 'In Progress', 'Resolved'].map((st) => (
              <button
                key={st}
                className={`ticket-filter-btn ${filterStatus === st ? 'active' : ''}`}
                onClick={() => setFilterStatus(st)}
              >
                {st}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '12.5px', color: '#616161' }}>
            Showing {filteredTickets.length} of {tickets.length} tickets
          </span>
        </div>

        {/* Tickets Grid / List */}
        {filteredTickets.length === 0 ? (
          <div className="tickets-empty-state">
            <Ticket size={48} color="#A19F9D" style={{ marginBottom: 16 }} />
            <h3>No Tickets Found</h3>
            <p>You have no tickets matching "{filterStatus}". Need help with hardware, IT access, or HR policies?</p>
            <button className="btn-raise-ticket-primary" onClick={onOpenRaiseTicket} style={{ marginTop: 14 }}>
              <Plus size={16} style={{ marginRight: 6 }} />
              Raise a Support Ticket
            </button>
          </div>
        ) : (
          <div className="tickets-card-grid">
            {filteredTickets.map((ticket) => {
              const isOpen = ticket.status === 'Open';
              const isInProgress = ticket.status === 'In Progress';
              const isResolved = ticket.status === 'Resolved';

              return (
                <div key={ticket.id} className="ticket-item-card">
                  <div className="ticket-item-top">
                    <div className="ticket-id-category">
                      <span className="ticket-id-pill">{ticket.id}</span>
                      <span className="ticket-category-label">{ticket.category}</span>
                    </div>
                    <div className="ticket-status-priority">
                      <span className={`ticket-priority-pill ${ticket.priority?.toLowerCase()}`}>
                        {ticket.priority} Priority
                      </span>
                      <span
                        className={`ticket-status-pill ${
                          isResolved ? 'resolved' : isInProgress ? 'in-progress' : 'open'
                        }`}
                      >
                        {isResolved ? '✓ Resolved' : isInProgress ? '⚡ In Progress' : '● Open'}
                      </span>
                    </div>
                  </div>

                  <h3 className="ticket-item-title">{ticket.title}</h3>
                  <p className="ticket-item-desc">{ticket.description}</p>

                  <div className="ticket-employee-meta-row">
                    <div className="ticket-employee-info">
                      <User size={13} style={{ opacity: 0.7 }} />
                      <span>{ticket.employeeName || employeeName}</span>
                    </div>
                    <div className="ticket-employee-info">
                      <Mail size={13} style={{ opacity: 0.7 }} />
                      <span>{ticket.employeeEmail || employeeEmail}</span>
                    </div>
                  </div>

                  <div className="ticket-item-bottom">
                    <span className="ticket-created-time">
                      <Clock size={13} style={{ marginRight: 5 }} />
                      {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <button
                      className="ticket-ask-bot-btn"
                      onClick={() => onAskBot(`Can you check the current status and updates for ticket #${ticket.id}: "${ticket.title}"?`)}
                      title="Ask the AI Assistant about this ticket"
                    >
                      <MessageSquare size={13} style={{ marginRight: 5 }} />
                      <span>Ask AI in Chat</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}


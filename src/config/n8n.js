/**
 * ============================================================================
 * MERIDIAN EMPLOYEE HELPDESK - N8N CONFIGURATION
 * ============================================================================
 * 
 * Centralized configuration for n8n AI Chatbot and Google Sheets Ticket integration.
 */

const env = (typeof import.meta !== 'undefined' && import.meta.env) 
  ? import.meta.env 
  : (typeof process !== 'undefined' && process.env ? process.env : {});

export const N8N_CONFIG = {
  // Published n8n Chat Trigger Webhook URL (Active & Connected)
  webhookUrl: env.VITE_N8N_CHAT_WEBHOOK_URL || 'https://pravaha-meridian.app.n8n.cloud/webhook/d0c4f371-03a0-4e93-872a-422241533715/chat', 

  // Dedicated n8n Tickets Webhook URL for direct Google Sheets CRUD operations
  ticketsWebhookUrl: env.VITE_N8N_TICKETS_WEBHOOK_URL || '',

  // Optional webhook request configuration (headers, auth, etc.)
  webhookConfig: {
    method: 'POST',
    headers: {}
  },

  // Assistant branding & messaging passed to @n8n/chat
  branding: {
    botName: 'Meridian IT & HR Helpdesk',
    welcomeTitle: 'Welcome to Meridian Helpdesk 👋',
    welcomeSubtitle: 'Ask IT troubleshooting questions, request software/hardware, or explore HR policies.',
    inputPlaceholder: 'Type an IT or HR question (e.g. "How do I request a replacement laptop?")...',
    initialMessages: [
      'Hello! I am your Meridian IT & HR Assistant.',
      'How can I assist you with IT support or HR policies today?'
    ]
  }
};

# Meridian Employee Helpdesk (React + Vite)

A modern, responsive employee IT & HR helpdesk web application built with **React**, **Vite**, and **Lucide React**, designed with Microsoft Teams visual inspiration, an enterprise purple/blue theme, and ready integration with an **n8n Chat Trigger** workflow with **Google Sheets ticket storage**.

---

## 🚀 Quick Start — Running Locally

### Prerequisites
- **Node.js** (v18 or higher recommended; verified on Node v24)
- **npm** (v9 or higher)

### Installation & Run

1. Open a terminal in the project directory:
   ```bash
   cd "d:\Meredian Helpdesk - website"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local Vite development server:
   ```bash
   npm run dev
   ```

4. Open your web browser and navigate to:
   ```
   http://localhost:5173/
   ```

---

## 🛠️ Required Tech Stack

- **Frontend Framework**: React 19 (`react`, `react-dom`)
- **Language**: JavaScript with JSX
- **Build Tool**: Vite 6 (`@vitejs/plugin-react`)
- **Iconography**: Lucide React (`lucide-react`)
- **Styling**: Clean, maintainable CSS with custom properties & Teams-inspired tokens
- **Chat Integration**: Official `@n8n/chat` package (v1.44.6)
- **Backend**: Existing n8n workflow engine (Chat Trigger / Webhooks)
- **Ticket Storage**: Google Sheets integration via existing n8n workflow

---

## 🎨 Preserved Visual Design & UI Features

- **Microsoft Teams Visual Inspiration**: Uses Fluent-inspired deep purple (`#5B5FC7`), dark rail sidebar (`#201F24`), crisp white cards, and Teams typography.
- **Original Meridian Branding**: Includes custom Meridian geometric branding without copying Microsoft logos or trademark assets.
- **Left Navigation Rail (`Sidebar.jsx`)**:
  - 💬 **Chat**: AI-powered conversational helpdesk with prompt cards.
  - 🎫 **My Tickets**: Support ticket list with status badges and SLA indicators.
  - 📜 **HR Policies**: Searchable corporate policy library and interactive reader modal.
  - 🛠️ **IT Support**: Self-service hardware refresh catalog and diagnostic ping tool.
- **Top Header (`Header.jsx`)**:
  - Title: *"Meridian Employee Helpdesk"*
  - Universal search bar with auto-suggest dropdown and keyboard navigation (`Enter` to ask assistant).
  - Live system status badge (*"Systems Normal"*).
  - User profile placeholder chip (*Alex Morgan*) with detailed popover info.
- **Responsive Layout**: Adapts smoothly to desktop, tablet, and mobile screens with a slide-out drawer menu.

---

## 🔌 Connecting your n8n Chatbot & Google Sheets Workflow

All n8n connection parameters are located in **one clearly documented file**:

📁 [`src/config/n8n.js`](file:///d:/Meredian%20Helpdesk%20-%20website/src/config/n8n.js)

```javascript
export const N8N_CONFIG = {
  // 👉 Paste your official n8n Chat Trigger Webhook URL here:
  webhookUrl: 'https://your-n8n-instance.com/webhook/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/chat',

  webhookConfig: {
    method: 'POST',
    headers: {}
  },

  branding: {
    botName: 'Meridian IT & HR Helpdesk',
    welcomeTitle: 'Welcome to Meridian Helpdesk 👋',
    welcomeSubtitle: 'Ask IT troubleshooting questions, request software/hardware, or explore HR policies.',
    inputPlaceholder: 'Type an IT or HR question (e.g. "How do I request a replacement laptop?")...',
    ...
  }
};
```

Your existing n8n workflow handles:
1. **Ticket Creation**: Creating helpdesk tickets and persisting them to Google Sheets.
2. **Ticket Status Lookup**: Looking up ticket IDs and returning resolution notes.
3. **Policy Search**: Querying corporate handbook articles.
4. **IT Troubleshooting**: General assistance and hardware refresh guidance.

---

## 📁 React Project Architecture

```
d:\Meredian Helpdesk - website\
├── index.html                   # HTML5 entrypoint mounting React App
├── package.json                 # React, Vite, Lucide React, and @n8n/chat
├── vite.config.js               # Vite config with @vitejs/plugin-react
├── README.md                    # Project documentation
├── src/
│   ├── config/
│   │   └── n8n.js               # ⚡ Single location for n8n Webhook URL
│   ├── components/
│   │   ├── Header.jsx           # Top header, universal search, profile popover
│   │   ├── Sidebar.jsx          # Left rail navigation with Lucide icons
│   │   ├── ChatWindow.jsx       # Chat container, @n8n/chat mount, prompt pills
│   │   ├── ChatMessage.jsx      # Message bubbles, formatting, action buttons
│   │   └── ChatInput.jsx        # Teams-style auto-expanding textarea & send
│   ├── pages/
│   │   ├── ChatPage.jsx         # Chat page view wrapper
│   │   ├── MyTicketsPage.jsx    # Tickets dashboard with filters & modal
│   │   ├── HRPoliciesPage.jsx   # Corporate policies knowledge base & reader
│   │   └── ITSupportPage.jsx    # IT hardware/software catalog & diagnostic
│   ├── assets/
│   │   └── meridian-logo.svg    # Custom Meridian vector logo
│   ├── styles/                  # Modular Teams CSS stylesheets
│   ├── App.jsx                  # Main application state, routing & modals
│   ├── main.jsx                 # React root bootstrapper
│   └── index.css                # Global stylesheet imports
```

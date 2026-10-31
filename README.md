# Meridian Employee Helpdesk

A modern, responsive enterprise IT & HR helpdesk web application built with **React 19**, **Vite**, **Clerk Authentication**, and **@n8n/chat**, styled with an executive **Navy, Sand & Gold** design system and integrated with an **n8n AI agent** and **Google Sheets** for end-to-end support ticket automation.

---

## 🌟 Key Features

### 🔐 Clerk Authentication & Verified Employee Identity
- **Instant Identity Sync**: Seamless login via Clerk (`@clerk/react`).
- **Automatic Auth Gate**: Prompts unauthenticated employees to sign in upon opening the helpdesk.
- **Auto-Filled Credentials**: The employee's verified name and email are automatically bound to all raised support tickets and forwarded to the n8n AI Assistant headers (`X-Employee-Name`, `X-Employee-Email`, `X-Employee-Id`).
- **Account Management**: Embedded Clerk user button in the top navigation for account details and session control.

### 💬 AI Helpdesk Chatbot (`@n8n/chat`)
- **Native Fullscreen Embed**: Embedded `@n8n/chat` widget configured to match the application's executive palette.
- **Context-Aware Prompts**: Quick prompt pills for hardware requests, MFA resets, healthcare enrollment, VPN setup, and home office expense guidelines.
- **Direct Ticket Creation via Chat**: Ask the AI assistant to submit support requests directly into Google Sheets.
- **Live Ticket Status Lookups**: Query the assistant about any ticket by ID to receive real-time updates.

### 🎫 Functional "My Tickets" Management
- **End-to-End Submission**: Create tickets via the `RaiseTicketModal` and persist them immediately to Google Sheets through the n8n webhook.
- **Zero Mock Data**: Generates and parses real ticket IDs (e.g. `MER-YYYYMMDD-...`) returned by n8n.
- **Optimistic Real-Time Feed**: Newly raised tickets immediately prepend to the active list without page reloads.
- **Dynamic Status Filtering**: Filter tickets by **All**, **Open**, **In Progress**, and **Resolved**.
- **Real Metrics**: Calculated live counts for **Active Requests** and **Resolved** tickets.
- **Resilient UI States**: Fully styled loading spinner, empty states, and error states with a retry button.
- **Duplicate Prevention**: Buttons and form fields lock during submission to prevent duplicate records.

### 🎨 Executive Design System (Navy, Sand & Gold)
- **Primary Navy (`#0F2742`)**: Brand header, active filters, primary CTAs, and user chat bubbles.
- **Deep Navy (`#091B2E`)**: Dark icon navigation rail, code blocks, and high-contrast surfaces.
- **Gold (`#E6B653`)**: Subtle accent indicators, active rail strip, notification badges, and focus rings.
- **Sand (`#F8F1E5`)**: Warm, easy-on-the-eyes page backdrop.
- **Warm White (`#FFFCF6`)**: Card surfaces, modal windows, and dialogs.
- **Primary Text (`#142A43`) & Secondary Text (`#6B7788`)**: High-contrast, accessible typography.
- **Border (`#E7D9BF`)**: Consistent, subtle division across grids and cards.
- **Success Green (`#21845B`)**: Verified Clerk badge, online indicators, and resolved tickets.

### 📜 HR Policies Knowledge Base & 🛠️ IT Service Catalog
- **Searchable HR Policies**: Browse company guidelines, PTO rules, remote work policies, and healthcare options. Includes interactive reader modal and one-click "Ask AI" triggers.
- **IT Service Catalog**: Self-service hardware refresh requests (MacBook Pro, ThinkPad, 34" monitors, YubiKeys) and diagnostic tools.

---

## 🚀 Quick Start — Running Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher (tested on Node v20 & v24)
- **npm**: v9.0.0 or higher

### 1. Installation
Clone the repository and install the dependencies:
```bash
git clone <repository-url>
cd meridian-helpdesk-agent
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```env
# Clerk Authentication Publishable Key
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# n8n AI Chat Webhook URL (connected to Google Sheets tools)
VITE_N8N_CHAT_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/<id>/chat

# (Optional) Dedicated n8n Webhook URL for bulk ticket retrieval
VITE_N8N_TICKETS_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/tickets
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### 4. Production Build & Preview
```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modern reactive component architecture |
| **Vite 6** | Ultra-fast bundling, HMR, and build tooling |
| **@clerk/react** | Enterprise user authentication, session management, and profile synchronization |
| **@n8n/chat** | Official n8n conversational AI chat embed |
| **Lucide React** | Consistent, modern icon set |
| **Vanilla CSS with Custom Properties** | Zero-dependency, modular design system |
| **Google Sheets + n8n** | Automated ticket database and AI tool executions |

---

## 📁 Project Architecture

```
meridian-helpdesk-agent/
├── index.html                   # HTML5 entrypoint mounting React App
├── package.json                 # Project dependencies and npm scripts
├── vite.config.js               # Vite configuration with React plugin
├── README.md                    # Project documentation
│
├── src/
│   ├── assets/
│   │   └── meridian-logo.svg    # Custom Meridian vector logo (Navy & Gold)
│   │
│   ├── config/
│   │   └── n8n.js               # Central n8n webhook and branding configuration
│   │
│   ├── services/
│   │   └── ticketsService.js    # n8n & Google Sheets ticket submission & retrieval service
│   │
│   ├── components/
│   │   ├── Header.jsx           # Top navigation bar, universal search, and Clerk UserButton
│   │   ├── Sidebar.jsx          # Left rail navigation with Gold active indicator
│   │   ├── ChatWindow.jsx       # Chat container, @n8n/chat mount, and prompt pills
│   │   ├── RaiseTicketModal.jsx # Ticket creation modal with Clerk autofill and submit lock
│   │   ├── ChatMessage.jsx      # Message bubble component for custom chat views
│   │   └── ChatInput.jsx        # Composition input component
│   │
│   ├── pages/
│   │   ├── ChatPage.jsx         # Helpdesk AI conversational view wrapper
│   │   ├── TicketsPage.jsx      # Functional tickets dashboard (filters, counts, real data)
│   │   ├── HRPoliciesPage.jsx   # Corporate handbook library & document reader
│   │   └── ITSupportPage.jsx    # IT hardware/software catalog & diagnostic actions
│   │
│   ├── data/
│   │   └── policies.js          # Synchronized official company policies knowledge base
│   │
│   └── styles/                  # Modular CSS architecture
│       ├── main.css             # Design tokens (:root), app layout shell, toasts, reset
│       ├── header.css           # Primary Navy top bar, search, and user profile chip
│       ├── sidebar.css          # Deep Navy rail, tooltips, and Gold accent strips
│       ├── chat.css             # Embedded @n8n/chat styles, auth gates, and prompt pills
│       ├── tickets.css          # Ticket cards, filters, metrics, and Raise Ticket modal
│       ├── policies.css         # HR policy accordions and reader modal
│       └── it-support.css       # Service catalog cards and IT health diagnostics
```

---

## 🔌 n8n Workflow & Google Sheets Integration

### How Ticket Creation Works:
1. When an authenticated employee submits the **Raise Ticket** modal:
2. The payload is sent to `src/services/ticketsService.js`, which issues a request to the n8n webhook with the verified requester's name, email, category, priority, subject, and description.
3. The n8n AI workflow activates its **Google Sheets Tool**, creating a new row in the spreadsheet.
4. n8n returns the generated ticket ID (e.g. `MER-20261031-1793419742652`) with status `Open`.
5. The frontend extracts this ID, displays a success toast, and immediately updates **My Tickets**.

### Enabling 2-Way Cloud Synchronization for Bulk Retrieval (Optional):
To query and display all historical Google Sheets rows across different browsers and devices:
1. In your n8n workflow, add a **Webhook Node** with HTTP Method `GET` and path `tickets`.
2. Connect it to a **Google Sheets Node** using operation **"Get Many Rows"**, filtered by:
   ```
   Requester Email = {{ $json.query.email }}
   ```
3. Add a **Respond to Webhook Node** returning the rows as JSON:
   ```json
   [
     {
       "id": "MER-20261031-1793419742652",
       "title": "Hardware Issue",
       "description": "Details...",
       "category": "IT Hardware",
       "priority": "High",
       "status": "Open",
       "createdAt": "2026-10-31T09:40:00.000Z"
     }
   ]
   ```
4. Define `VITE_N8N_TICKETS_WEBHOOK_URL` in your `.env.local`.

---

## 📜 Available Scripts

- `npm run dev`: Runs the local Vite development server with hot-module replacement.
- `npm run build`: Compiles production assets into the `dist/` directory.
- `npm run preview`: Locally previews the production build.
- `npm run sync-policies`: Scans and synchronizes policy `.docx` files into `src/data/policies.js`.

---

## 📄 License

This project is proprietary and intended for internal Meridian enterprise use.

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType
} from 'docx';
import fs from 'fs';
import path from 'path';

function createTitle(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120 }
  });
}

function createHeading1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 120 }
  });
}

function createHeading2(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 }
  });
}

function createBody(text, bold = false) {
  return new Paragraph({
    children: [new TextRun({ text, bold, font: 'Calibri', size: 22 })],
    spacing: { before: 60, after: 60 }
  });
}

function createBullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(new TextRun({ text: boldPrefix + ' ', bold: true, font: 'Calibri', size: 22 }));
  }
  children.push(new TextRun({ text, font: 'Calibri', size: 22 }));

  return new Paragraph({
    children,
    bullet: { level: 0 },
    spacing: { before: 40, after: 40 }
  });
}

function createCallout(title, text) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: 'F4F4FC' },
            borders: {
              top: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.SINGLE, size: 24, color: '5B5FC7' }
            },
            margins: { top: 120, bottom: 120, left: 180, right: 180 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: `📌 ${title}: `, bold: true, color: '3D3E8E', font: 'Calibri', size: 22 }),
                  new TextRun({ text, font: 'Calibri', size: 22, color: '242424' })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}

function createStyledTable(headers, rows) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(h => new TableCell({
      shading: { type: ShadingType.CLEAR, fill: '5B5FC7' },
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: '5B5FC7' },
        bottom: { style: BorderStyle.SINGLE, size: 8, color: '3D3E8E' },
        left: { style: BorderStyle.SINGLE, size: 4, color: 'EDEBE9' },
        right: { style: BorderStyle.SINGLE, size: 4, color: 'EDEBE9' }
      },
      children: [
        new Paragraph({
          children: [new TextRun({ text: h, bold: true, color: 'FFFFFF', font: 'Calibri', size: 20 })]
        })
      ]
    }))
  });

  const dataRows = rows.map((r, rowIndex) => new TableRow({
    children: r.map(c => new TableCell({
      shading: { type: ShadingType.CLEAR, fill: rowIndex % 2 === 0 ? 'FFFFFF' : 'F9F9FC' },
      margins: { top: 80, bottom: 80, left: 140, right: 140 },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 2, color: 'EDEBE9' },
        bottom: { style: BorderStyle.SINGLE, size: 2, color: 'EDEBE9' },
        left: { style: BorderStyle.SINGLE, size: 2, color: 'EDEBE9' },
        right: { style: BorderStyle.SINGLE, size: 2, color: 'EDEBE9' }
      },
      children: [
        new Paragraph({
          children: [new TextRun({ text: c, font: 'Calibri', size: 20 })]
        })
      ]
    }))
  }));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows]
  });
}

async function generateDocx() {
  const doc = new Document({
    creator: 'Meridian Architecture Team',
    title: 'Meridian Employee Helpdesk - React Application & Technology Stack Documentation',
    description: 'Technical and architectural overview of the Meridian Employee Helpdesk React application.',
    sections: [
      {
        properties: {},
        children: [
          createTitle('Meridian Employee Helpdesk'),
          new Paragraph({
            text: 'React Application Architecture & Technology Stack Documentation',
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 }
          }),
          new Paragraph({
            text: 'Version: 2.0.0 (React + Vite)  |  Author: Enterprise Systems Team  |  Status: Verified',
            alignment: AlignmentType.CENTER,
            spacing: { after: 360 }
          }),

          createCallout('Executive Purpose', 'A modern, responsive, Microsoft Teams-inspired employee self-service portal built with React, Vite, and Lucide React. Designed to unify corporate IT technical support, hardware/software procurement, HR policy exploration, and conversational AI automation via n8n workflows with Google Sheets ticket storage.'),
          new Paragraph({ text: '', spacing: { after: 180 } }),

          createHeading1('1. Project Overview & Business Value'),
          createBody('The Meridian Employee Helpdesk provides enterprise staff with an intuitive, centralized workspace for resolving everyday IT and HR needs. Built as a high-performance React application, it replaces fragmented portals with a single Teams-inspired hub.'),
          createBullet('Eliminates friction in IT support by providing conversational answers to setup and troubleshooting questions.', 'Unified Support Hub:'),
          createBullet('Enables employees to search corporate guidelines (PTO, benefits, hybrid work policies) with instant summary actions.', 'HR Self-Service:'),
          createBullet('Pre-configured to mount the official @n8n/chat widget and connect directly to an existing n8n Chat Trigger workflow.', 'n8n AI Automation Ready:'),
          createBullet('Supports ticket creation, status lookup, and resolution notes stored in Google Sheets via n8n.', 'Ticket Storage Integration:'),

          createHeading1('2. Required Technology Stack'),
          createStyledTable(
            ['Layer / Category', 'Technology / Tool', 'Version', 'Purpose & Rationale'],
            [
              ['Frontend Framework', 'React & ReactDOM', '^19.3.1', 'Component-based reactive UI managing chat message states, modal states, tab routing, and live filtering.'],
              ['Language', 'JavaScript with JSX', 'ES2022+ / JSX', 'Clean, declarative syntax for UI composition and state management.'],
              ['Build Tool & Dev Server', 'Vite', '^6.4.5', 'Ultra-fast HMR and optimized production bundling with @vitejs/plugin-react.'],
              ['Iconography', 'Lucide React', '^1.64.0', 'Consistent, lightweight SVG icons for navigation, search, status, and chat actions.'],
              ['Styling Engine', 'Clean Vanilla CSS Modules / Stylesheets', 'CSS3', 'Preserves the Microsoft Teams design system with custom properties, grid layouts, and elevation shadows.'],
              ['Chat Assistant', '@n8n/chat', '^1.44.6', 'Official embeddable widget mounted directly into the React chat container.'],
              ['Backend Workflow Engine', 'n8n Automation', 'Cloud / Self-Hosted', 'Processes incoming messages via Chat Trigger node and orchestrates IT/HR tasks.'],
              ['Ticket Storage', 'Google Sheets via n8n', 'Live Cloud API', 'Existing n8n workflow records helpdesk tickets, searches policies, and returns resolution notes.']
            ]
          ),

          new Paragraph({ text: '', spacing: { after: 180 } }),

          createHeading1('3. React Component Architecture'),
          createBody('The application is organized into modular, reusable React components:'),
          createBullet('App-level shell managing activeTab, sidebar drawer state, search queries, and configuration modals.', 'App.jsx:'),
          createBullet('Top navigation with universal search, system operational status badge, and user profile chip (Alex Morgan).', 'Header.jsx:'),
          createBullet('Teams-style left rail navigation with active indicator strips, badge counts, and mobile drawer support.', 'Sidebar.jsx:'),
          createBullet('Main chat container integrating @n8n/chat widget, dynamic greetings, and prompt cards.', 'ChatWindow.jsx:'),
          createBullet('Render individual user and assistant message bubbles with markdown formatting and action triggers.', 'ChatMessage.jsx:'),
          createBullet('Teams-style textarea input box with auto-expanding height and keyboard shortcuts (Enter to send).', 'ChatInput.jsx:'),
          createBullet('Chat workspace view with clickable employee questions.', 'ChatPage.jsx:'),
          createBullet('Ticketing dashboard with status filters, search, and demo submission modal.', 'MyTicketsPage.jsx:'),
          createBullet('Searchable corporate policy library with interactive reader modal and Ask Assistant trigger.', 'HRPoliciesPage.jsx:'),
          createBullet('Hardware refresh catalog, software licensing, and network diagnostic latency test widget.', 'ITSupportPage.jsx:'),
          createBullet('Single documented location for the n8n Chat Trigger Webhook URL.', 'src/config/n8n.js:'),

          createHeading1('4. n8n & Google Sheets Workflow Integration'),
          createBody('The chat interface connects to your published n8n workflow in one single location:'),
          createCallout('Configuration Location', 'File: src/config/n8n.js. Paste your published n8n Chat Trigger Production URL into webhookUrl.'),
          new Paragraph({ text: '', spacing: { after: 120 } }),
          createBody('Your workflow orchestrates:'),
          createBullet('Creating helpdesk tickets and logging them into Google Sheets.', '1. Ticket Creation:'),
          createBullet('Looking up existing ticket IDs, checking status, and returning resolution notes.', '2. Ticket Status Lookup:'),
          createBullet('Searching corporate policies and returning summaries.', '3. Policy Search:'),
          createBullet('Answering general IT troubleshooting questions.', '4. IT Diagnostics:'),

          createHeading1('5. Local Setup & Execution Guide'),
          createBody('To run the React application locally:'),
          createBullet('Clone or open project folder: cd "d:\\Meredian Helpdesk - website"', 'Step 1:'),
          createBullet('Install dependencies: npm install', 'Step 2:'),
          createBullet('Start Vite development server: npm run dev', 'Step 3:'),
          createBullet('Access website in browser: http://localhost:5173/', 'Step 4:'),
          createBullet('Paste your n8n Chat Trigger URL into src/config/n8n.js when ready.', 'Step 5:')
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.resolve('d:/Meredian Helpdesk - website/Meridian_Employee_Helpdesk_Project_Documentation.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Word file updated successfully at: ${outputPath}`);
}

generateDocx().catch(err => {
  console.error('Error generating docx:', err);
  process.exit(1);
});

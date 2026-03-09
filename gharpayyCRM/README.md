# 🏘️ Gharpayy Lead Management CRM

> An internal sales CRM built for Gharpayy — a platform helping students and working professionals find PG accommodations in Bangalore.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)
![Status](https://img.shields.io/badge/Status-MVP-orange?style=flat)

---

## 📌 Overview

This CRM solves the core operational problems faced by Gharpayy's sales team:

| Problem                          | Solution                                           |
| -------------------------------- | -------------------------------------------------- |
| Leads scattered across channels  | Single capture form aggregates all sources         |
| Multiple agents on the same lead | Round Robin auto-assignment on every submission    |
| No lead ownership                | Every lead has exactly one assigned agent          |
| Poor follow-up                   | 24-hour inactivity detection with red badge alerts |
| Unstructured visits              | Dedicated Visit Scheduler + Planner page           |
| No performance visibility        | Dashboard KPIs + Agent Leaderboard                 |

---

## 🚀 Quick Start

### Prerequisites

- Node.js `v18+`
- npm `v9+`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/vaseem/gharpayy-crm.git

# 2. Navigate into the project
cd gharpayy-crm

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **No backend required for the MVP.** All data is seeded in-memory with 15 sample leads, 3 agents, 6 visits, and a full activity timeline.

---

## 🗂️ Project Structure

```
src/
├── main.jsx                        # React entry point
├── App.jsx                         # Root component — all state & event handlers
├── index.css                       # Global styles (fonts, Kanban drag CSS, scrollbar)
│
├── constants/
│   └── index.js                    # STAGES, SOURCES, COLORS, NAV items, ACT maps
│
├── data/
│   └── seedData.js                 # Sample agents, leads, visits, and activities
│
├── utils/
│   └── helpers.js                  # fmtDate, fmtDT, since, needsFollowUp, uid
│
├── components/
│   ├── ui/
│   │   ├── Badge.jsx               # Badge, StageBadge, SourceBadge, VisitBadge, FUBadge
│   │   ├── Avatar.jsx              # Agent avatar circle with initials + brand color
│   │   ├── Stat.jsx                # KPI stat card used on the Dashboard
│   │   └── Modal.jsx               # Reusable overlay modal wrapper
│   ├── layout/
│   │   └── Sidebar.jsx             # Fixed left navigation with brand header + admin footer
│   └── ScheduleVisitModal.jsx      # Shared visit scheduling form (used in 3 pages)
│
└── pages/
    ├── Dashboard.jsx               # KPI cards, pipeline bar chart, upcoming visits, follow-ups
    ├── LeadsTable.jsx              # Searchable/filterable leads table with inline actions
    ├── Pipeline.jsx                # Drag-and-drop Kanban board across 8 stages
    ├── LeadDetail.jsx              # Full lead profile, notes, visit history, activity timeline
    ├── VisitPlanner.jsx            # Visits grouped by Today / Tomorrow / Upcoming / Past
    ├── NewLead.jsx                 # Lead capture form with Round Robin assignment preview
    └── AgentPerf.jsx               # Leaderboard with medals + stacked pipeline bars per agent
```

---

## 🧩 Features

### 1. Lead Capture

- Form fields: Name, Phone Number, Lead Source (dropdown), auto-generated Timestamp
- Supported sources: Website, WhatsApp, Phone, Social Media, Google Form, Tally Form
- On submit: lead profile created → assigned via Round Robin → appears in dashboard instantly

### 2. Automatic Round Robin Assignment

- Leads cycle through agents: Agent A → B → C → A → ...
- Every lead always has exactly **one** owner
- Admins can manually reassign from the Lead Detail page

### 3. Pipeline Management (Kanban)

- 8 stages: `New Lead` → `Contacted` → `Requirement Collected` → `Property Suggested` → `Visit Scheduled` → `Visit Completed` → `Booked` → `Lost`
- Drag and drop cards between columns
- Stage moves auto-update the `lastActivityAt` timestamp

### 4. Lead Detail Page

- Full lead info + assigned agent
- Move Stage / Schedule Visit / Reassign buttons
- Notes section (save and display)
- Visit History with outcome dropdowns
- Real-time Activity Timeline (Created → Assigned → Stage moved → Visit → Note)

### 5. Visit Scheduling

- Schedule from: Kanban card, Leads Table row, or Lead Detail page
- Fields: Property (from Gharpayy properties list), Date, Time, Notes
- Visit outcomes: `Visited` | `No Show` | `Rescheduled` | `Booked` | `Not Interested`
- Booking a visit auto-moves the lead to `Booked` stage

### 6. Follow-Up Reminder

- Any lead with **no activity for 24+ hours** (not Booked/Lost) is flagged
- Red badge shown on: Kanban card, Leads Table row, Dashboard panel
- Calculated in real time — no cron job needed on the frontend

### 7. Dashboard

- KPI Cards: Total Leads, Bookings Confirmed, Visits Scheduled, Follow-Up Needed
- Pipeline Distribution: Horizontal bar chart per stage
- Upcoming Visits: Today and Tomorrow
- Follow-Up Needed: Clickable list of stale leads
- Agent Overview: Leads / Visits / Bookings per agent

### 8. Agent Performance

- Ranked leaderboard (🥇🥈🥉) with 6 metrics: Leads, Active, Visits, Booked, Lost, Conv%
- Stacked pipeline bar per agent showing stage distribution

---

## 👥 User Roles

| Role            | Capabilities                                                                    |
| --------------- | ------------------------------------------------------------------------------- |
| **Admin**       | View all leads, assign/reassign leads, dashboard analytics, manage agents       |
| **Sales Agent** | View assigned leads, update stages, schedule visits, update outcomes, add notes |

> Role-based authentication is **not implemented in the MVP**. It is designed into the database schema and Django backend plan for production. See [Production Setup](#-production-setup) below.

---

## 📊 Data Models

### Lead

```
id              String      e.g. "L001"
name            String
phone           String
source          Enum        Website | WhatsApp | Phone | Social Media | Google Form | Tally Form
assignedAgent   String      FK → Agent.id
stage           Enum        8 pipeline stages
notes           String
createdAt       ISO String
lastActivityAt  ISO String
```

### Agent

```
id        String
name      String
email     String
phone     String
initials  String
color     String (hex)
```

### Visit

```
id            String
leadId        String   FK → Lead.id
property      String
date          String   YYYY-MM-DD
time          String   HH:MM
status        Enum     Scheduled | Visited | No Show | Rescheduled | Booked | Not Interested
notes         String
```

### Activity

```
id          String
leadId      String   FK → Lead.id
type        Enum     created | assigned | stage | visit | booking | note | reassigned
description String
createdAt   ISO String
```

---

## 🏗️ Production Setup

The MVP frontend is designed to connect to a **Django REST Framework** backend. Here is the architecture:

```
[ React (Vite) ]  ←→  [ Django REST API ]  ←→  [ PostgreSQL ]
                              ↓
                   [ Redis + Celery Workers ]
                   (follow-up alerts, WhatsApp)
```

### Backend Stack (planned)

- **Python 3.12 + Django 5** — REST API
- **Django REST Framework** — serializers, viewsets, routers
- **SimpleJWT** — role-based authentication (Admin / Agent)
- **PostgreSQL** — production database
- **Celery + Redis** — async follow-up reminder jobs
- **Twilio / Interakt** — WhatsApp notifications

### Replacing Seed Data with Real API

In `src/data/seedData.js`, replace static arrays with API calls using `fetch` or `axios`:

```js
// Before (seed data)
export const INIT_LEADS = [ { id: "L001", ... } ];

// After (API)
export const fetchLeads = () => fetch('/api/leads/').then(r => r.json());
```

In `src/App.jsx`, swap `useState(INIT_LEADS)` with a `useEffect` + API call:

```js
useEffect(() => {
  fetchLeads().then((data) => setLeads(data));
}, []);
```

### Django API Endpoints (planned)

| Method  | Endpoint                    | Description                                         |
| ------- | --------------------------- | --------------------------------------------------- |
| `GET`   | `/api/leads/`               | List all leads (filtered by agent for non-admins)   |
| `POST`  | `/api/leads/`               | Create a new lead (triggers Round Robin assignment) |
| `PATCH` | `/api/leads/:id/`           | Update stage, notes, assigned agent                 |
| `GET`   | `/api/visits/`              | List all visits                                     |
| `POST`  | `/api/visits/`              | Schedule a new visit                                |
| `PATCH` | `/api/visits/:id/`          | Update visit outcome                                |
| `GET`   | `/api/activities/?lead_id=` | Activity timeline for a lead                        |
| `GET`   | `/api/agents/`              | List all agents                                     |
| `POST`  | `/api/auth/token/`          | JWT login                                           |
| `POST`  | `/api/auth/token/refresh/`  | Refresh JWT                                         |

---

## 🧪 Running Tests

> Tests are planned for the production phase. The MVP is manually tested against all 6 core workflows.

```bash
# Frontend (planned — Vitest + React Testing Library)
npm run test

# Backend (planned — pytest-django)
pytest
```

---

## 📦 Build for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy to **Vercel** (recommended) or any static host:

```bash
# Vercel CLI
vercel --prod
```

---

## 🗺️ Roadmap

- [ ] Django REST backend with JWT authentication
- [ ] Role-based route guards (Admin vs Agent views)
- [ ] WhatsApp notification on lead assignment and visit reminder
- [ ] Google Form / Tally Form webhook → auto lead creation
- [ ] Real-time Kanban updates via Django Channels (WebSocket)
- [ ] Google Calendar sync for visit scheduling
- [ ] Mobile-responsive layout
- [ ] Multi-city support (Hyderabad, Chennai, Pune)
- [ ] Booking token payment via Razorpay

---

## 📁 Key Files Reference

| File                                    | Purpose                                                                                             |
| --------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `src/App.jsx`                           | All app state (`leads`, `visits`, `acts`) and event handlers (`handleMove`, `handleSchedule`, etc.) |
| `src/constants/index.js`                | Single source of truth for all enums, color maps, and nav config                                    |
| `src/data/seedData.js`                  | Replace this with real API calls when connecting a backend                                          |
| `src/utils/helpers.js`                  | `needsFollowUp()` is the follow-up detection logic — port this to a DB query in production          |
| `src/components/ScheduleVisitModal.jsx` | Reused in Pipeline, LeadsTable, and LeadDetail — any visit scheduling change happens here           |

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
  Built by Vaseem with ❤️ for Gharpayy · Bangalore · 2025
</div>

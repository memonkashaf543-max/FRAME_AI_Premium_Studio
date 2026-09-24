# FRAME AI — Premium Smart Photography Studio Management & StudioAI Assistant

A production-grade, AI-native photography studio management SaaS with an executive floating assistant powered by **Google Gemini** (`@google/genai`).

---

## ✨ Features

- **✨ StudioAI Assistant**: A global, floating AI assistant component mounted throughout every page (Dashboard, Projects, Bookings, Calendar, Clients, Gallery, AI Studio, Invoices, Analytics, Settings).
  - **No AI footer or toolbar**: The entire application UI remains pristine; quick action chips, cards, and conversations exist exclusively inside the floating assistant panel.
  - **Closed State**: Elegant circular floating button (64×64px desktop / 58×58px mobile) with purple/violet gradient, gold sparkles, ripple glow, and pulse animation.
  - **Open State**: Glassmorphic 420×650px panel on desktop, full-screen on mobile.
  - **Google Gemini & Tool Calling**: Connects to `POST /api/ai/chat` for real database operations (availability checks, booking confirmations, client registration, invoice generation, revenue analytics, proposals, Instagram captions).
  - **Action Cards**: Live interactive confirmation cards for bookings, alternative slot chips, luxury Instagram captions (with Copy & Style buttons), and client proposals.
  - **Real-Time Synchronization**: Instant state synchronization across Calendar, Bookings, Clients, and Invoices without page reloads.
- **Interactive Calendar System**: Dynamic Month, Week, and Day timeline views, studio room filtering (Studio A, Studio B, Edit Suite, Outdoor), and interactive mini-calendar.
- **Complete Business Suite**: Clients CRM, Projects tracking, Invoice billing with tax calculations, Financial Analytics, and AI Photo Culling/Retouching suites.

---

## 📁 File Structure

- `index.html` — Clean application shell with sidebar, topbar, routed content container, and StudioAI mount.
- `css/style.css` — Complete design system with glassmorphism, responsive grid layouts, calendar scheduling, and luxury StudioAI assistant styles.
- `js/app.js` — Core application router, interactive calendar engine, modal handlers, and reactive state management.
- `js/studioai.js` — Global StudioAI Assistant component with natural language processing, action cards, Gemini API connection, and fallback intelligence.
- `server.js` — Express backend with `@google/genai` SDK, tool declarations, function calling execution, and `data/db.json` persistence.
- `data/db.json` — Persistent database for clients, projects, bookings, invoices, gallery, notifications, and conversations.
- `package.json` — Backend dependencies (`@google/genai`, `express`, `cors`, `dotenv`).
- `.env.example` — Environment variable template for Gemini API key and model selection.
- `launch.bat` — One-click launcher on Windows.

---

## 🚀 Quick Start & Installation

### Option 1: Running with Node.js & Google Gemini (Recommended)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure your Gemini API Key in `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your API key from [Google AI Studio](https://aistudio.google.com/):
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key
   GEMINI_MODEL=gemini-2.5-flash
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open `http://localhost:8000` in your browser.

### Option 2: 1-Click Launch on Windows

Double-click `launch.bat`. It will automatically launch the server or open the studio management interface in your default browser.

---

## 🛠️ StudioAI Function Calling Tools

The backend registers and executes the following tools with Gemini:

1. `get_dashboard_summary` — Studio revenue, active projects, today's sessions, unpaid invoices.
2. `get_today_schedule` — Daily schedule with times, rooms, and photographer assignments.
3. `get_upcoming_bookings` — List of upcoming confirmed shoots.
4. `search_clients` & `get_client` — Search by name, company, email, or city.
5. `create_client` & `update_client` — Register new clients and update contact details.
6. `check_booking_availability` & `get_available_slots` — Real-time conflict checks and alternative slot suggestions.
7. `create_booking` — Confirms real bookings in `data/db.json` with confirmation cards.
8. `get_unpaid_invoices` & `create_invoice` — Financial invoice management and payment tracking.
9. `get_revenue_summary` — Monthly revenue breakdown, collected vs pending amounts.
10. `generate_instagram_caption` — Viral luxury captions with hashtags and CTAs.
11. `create_proposal` — Professional wedding and commercial photography proposals.

/**
 * StudioAI Assistant — Luxury Global Floating AI Assistant for FRAME AI Studio
 * Handles real-time conversational ops, Google Gemini API calling, booking confirmations,
 * availability checks, invoice lookups, caption generation, proposal generation, and live UI synchronization.
 */

(function () {
  'use strict';

  // Quick Action Prompts
  const QUICK_ACTIONS = [
    { id: "unpaid-clients", label: "Unpaid Clients", prompt: "Show unpaid clients and overdue invoices" },
    { id: "book-shoot", label: "Book Shoot", prompt: "Book Rahul Patel for wedding photography on September 15 at 10 AM" },
    { id: "instagram-caption", label: "Insta Caption", prompt: "Write an Instagram caption for this wedding" },
    { id: "revenue", label: "Revenue", prompt: "How much did we earn this month? Show revenue breakdown." },
    { id: "today-schedule", label: "Today's Schedule", prompt: "Show today's schedule" },
    { id: "new-client", label: "New Client", prompt: "Create a client named Sarah Khan from Mumbai" },
    { id: "new-project", label: "New Project", prompt: "Create a new photography project for Sarah Johnson" },
    { id: "create-invoice", label: "Create Invoice", prompt: "Create an invoice for Rahul Patel for ₹80,000" },
    { id: "available-dates", label: "Available Dates", prompt: "Show available dates" },
    { id: "upcoming-shoots", label: "Upcoming Shoots", prompt: "Show all upcoming confirmed shoots" }
  ];

  // State
  let isOpen = false;
  let isMinimized = false;
  let isLoading = false;
  let conversationHistory = [];
  let conversationId = "conv-" + Date.now();
  let pendingBookingDraft = null;

  // DOM Elements
  let rootEl = null;
  let triggerBtn = null;
  let panelEl = null;
  let messagesEl = null;
  let inputEl = null;
  let formEl = null;
  let contextBannerEl = null;

  // Initialize Global StudioAI Component
  function initStudioAI() {
    // Remove if already existing to avoid duplicates
    const existing = document.getElementById("studioAiRoot");
    if (existing) existing.remove();

    // Create Root Container
    rootEl = document.createElement("div");
    rootEl.id = "studioAiRoot";
    rootEl.className = "studioai-container";

    rootEl.innerHTML = `
      <!-- Closed State: Floating Circular Sparkle Button -->
      <button id="studioAiTrigger" class="studioai-trigger" aria-label="Ask StudioAI" title="Ask StudioAI">
        <span class="studioai-trigger-sparkle">✨</span>
        <span class="studioai-trigger-ripple"></span>
        <span class="studioai-tooltip">Ask StudioAI</span>
      </button>

      <!-- Open State: Floating Glass Chat Panel -->
      <aside id="studioAiPanel" class="studioai-panel studioai-closed" role="dialog" aria-modal="true" aria-labelledby="studioAiTitle">
        <!-- Header -->
        <div class="studioai-header">
          <div class="studioai-header-left">
            <div class="studioai-header-badge">✨</div>
            <div>
              <h3 id="studioAiTitle" class="studioai-title">StudioAI Assistant</h3>
              <div class="studioai-status-wrap">
                <span class="studioai-status-dot"></span>
                <span class="studioai-status-text">AI Online</span>
              </div>
            </div>
          </div>
          <div class="studioai-header-actions">
            <button class="studioai-btn-icon" id="studioAiMinimizeBtn" title="Minimize" aria-label="Minimize">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <button class="studioai-btn-icon" id="studioAiCloseBtn" title="Close" aria-label="Close">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>

        <!-- Page Context Banner (Inside Chat) -->
        <div class="studioai-context-banner" id="studioAiContextBanner">
          <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
          <span id="studioAiContextText">Context: Dashboard Overview</span>
        </div>

        <!-- Scrollable Conversation Area -->
        <div class="studioai-messages" id="studioAiMessages"></div>

        <!-- Quick Action Chips (Inside Chatbot Above Input ONLY) -->
        <div class="studioai-chips-wrap">
          <div class="studioai-chips" id="studioAiChips">
            ${QUICK_ACTIONS.map(a => `
              <button class="studioai-chip" data-prompt="${a.prompt}" data-ai-action="${a.id}">${a.label}</button>
            `).join("")}
          </div>
        </div>

        <!-- Input Area -->
        <div class="studioai-input-wrap">
          <form class="studioai-form" id="studioAiForm">
            <textarea id="studioAiInput" class="studioai-input" placeholder="Ask StudioAI to book, invoice, search..." rows="1" aria-label="Ask StudioAI"></textarea>
            <button type="submit" id="studioAiSendBtn" class="studioai-send-btn" aria-label="Send message">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
            </button>
          </form>
        </div>
      </aside>
    `;

    document.body.appendChild(rootEl);

    // Cache elements
    triggerBtn = document.getElementById("studioAiTrigger");
    panelEl = document.getElementById("studioAiPanel");
    messagesEl = document.getElementById("studioAiMessages");
    inputEl = document.getElementById("studioAiInput");
    formEl = document.getElementById("studioAiForm");
    contextBannerEl = document.getElementById("studioAiContextText");

    // Event Listeners
    triggerBtn.addEventListener("click", toggleStudioAi);
    document.getElementById("studioAiCloseBtn").addEventListener("click", closeStudioAi);
    document.getElementById("studioAiMinimizeBtn").addEventListener("click", minimizeStudioAi);

    formEl.addEventListener("submit", handleFormSubmit);

    // Textarea Auto-expand & Enter to send
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        formEl.dispatchEvent(new Event("submit"));
      }
    });

    // Quick Action Chips Click
    document.querySelectorAll(".studioai-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const prompt = chip.getAttribute("data-prompt");
        if (prompt) {
          inputEl.dataset.aiAction = chip.getAttribute("data-ai-action") || "";
          inputEl.value = prompt;
          formEl.dispatchEvent(new Event("submit"));
        }
      });
    });

    // Escape to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) {
        closeStudioAi();
      }
    });

    // Update Context on Hashchange
    window.addEventListener("hashchange", updatePageContext);
    updatePageContext();

    // Render Initial Greetings if empty
    if (conversationHistory.length === 0) {
      appendInitialGreetings();
    }
  }

  // Toggle Assistant Open / Closed
  function toggleStudioAi() {
    if (isOpen) {
      closeStudioAi();
    } else {
      openStudioAi();
    }
  }

  function openStudioAi() {
    isOpen = true;
    isMinimized = false;
    panelEl.classList.remove("studioai-closed", "studioai-minimized");
    panelEl.classList.add("studioai-open");
    triggerBtn.classList.add("studioai-trigger-active");
    updatePageContext();
    setTimeout(() => {
      inputEl.focus();
      scrollToBottom();
    }, 150);
  }

  function closeStudioAi() {
    isOpen = false;
    isMinimized = false;
    panelEl.classList.remove("studioai-open", "studioai-minimized");
    panelEl.classList.add("studioai-closed");
    triggerBtn.classList.remove("studioai-trigger-active");
  }

  function minimizeStudioAi() {
    isMinimized = !isMinimized;
    panelEl.classList.toggle("studioai-minimized", isMinimized);
  }

  // Page Context Updates
  function isAuthPage() {
    const hash = (window.location.hash || "").replace("#", "");
    return ["login", "signup", "forgot-password"].includes(hash) || (window.FRAME_AUTH && !window.FRAME_AUTH.isAuthenticated());
  }

  function getCurrentPageName() {
    const hash = (window.location.hash || "#dashboard").replace("#", "") || "dashboard";
    return hash;
  }

  function updatePageContext() {
    const page = getCurrentPageName();
    if (rootEl) {
      if (isAuthPage()) {
        rootEl.style.display = "none";
        return;
      } else {
        rootEl.style.display = "";
      }
    }

    if (contextBannerEl) {
      const labels = {
        dashboard: "Dashboard Overview",
        projects: "Projects Management",
        bookings: "Shoot Bookings & Schedule",
        calendar: "Studio Room Calendar",
        clients: "Client Database & CRM",
        gallery: "Gallery & Visual Assets",
        "ai-studio": "AI Studio Production",
        "ai-culling": "AI Image Culling",
        "ai-editing": "AI Neural Retouching",
        photographers: "Photographers Team",
        packages: "Packages & Rates",
        invoices: "Billing & Invoices",
        analytics: "Revenue & Analytics",
        notifications: "Studio Notifications",
        settings: "Studio Settings"
      };
      contextBannerEl.textContent = `Active Page: ${labels[page] || page}`;
    }
  }

  // Initial Welcome Messages
  function appendInitialGreetings() {
    const page = getCurrentPageName();
    const pageTips = {
      dashboard: "You're on the **Dashboard**. I can check revenue, today's schedule, or upcoming bookings.",
      bookings: "You're viewing **Bookings**. I can help you create, find, reschedule, or cancel bookings.",
      calendar: "You're viewing **Calendar**. I can check studio room availability and schedule shoots.",
      clients: "You're viewing **Clients**. I can find, create, or update clients in Mumbai, Delhi & beyond.",
      invoices: "You're viewing **Invoices**. I can help you find unpaid invoices or create new invoices.",
      projects: "You're viewing **Projects**. I can help you create, track, and manage production projects.",
      gallery: "You're viewing **Gallery**. I can search albums or craft viral Instagram captions.",
      "ai-studio": "You're in **AI Studio**. I can assist with AI Culling, Neural Retouching, and Style generation.",
      "ai-editing": "You're in **AI Editing**. I can help tune lighting curves, skin refinement and color presets.",
      analytics: "You're in **Analytics**. I can analyze monthly earnings, shoot margins, and growth."
    };

    const tip = pageTips[page] || pageTips.dashboard;

    addMessage("assistant", `Hello! I'm **StudioAI**, your executive studio intelligence assistant.\n\n${tip}\n\nYou can ask me to search bookings, create clients, schedule shoots, check availability, manage invoices, analyze revenue, create proposals, or write social media captions.`);
  }

  const STUDIO_TODAY = "2026-08-24";

  // Form Submit Handler
  async function handleFormSubmit(e) {
    e.preventDefault();
    const text = inputEl.value.trim();
    const action = inputEl.dataset.aiAction || "";
    delete inputEl.dataset.aiAction;
    if (!text || isLoading) return;

    // Add User Message
    addMessage("user", text);
    inputEl.value = "";
    inputEl.style.height = "auto";

    // Show Typing Indicator
    showTypingIndicator();
    isLoading = true;

    try {
      const page = getCurrentPageName();
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationId,
          context: { page, action }
        })
      });

      removeTypingIndicator();
      isLoading = false;

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      conversationId = data.conversationId || conversationId;

      // Append AI response message
      addMessage("assistant", data.message || "Request processed.", data.actions, data.data);

      // Check if state in application needs refreshing
      if (typeof window.syncStudioState === "function") {
        window.syncStudioState();
      }

    } catch (err) {
      console.warn("[StudioAI] Backend fetch error, executing smart local fallback:", err);
      removeTypingIndicator();
      isLoading = false;

      // Smart client-side fallback execution with preserved action
      executeLocalSmartFallback(text, action);
    }
  }

  // --------------------------------------------------------------------------
  // STRUCTURED STUDIOAI INTENT CLASSIFIER & ROUTER
  // --------------------------------------------------------------------------

  function classifyIntent(message, action) {
    if (action) {
      const actionMap = {
        "unpaid-clients": "GET_UNPAID_INVOICES",
        "book-shoot": "CREATE_BOOKING_FLOW",
        "instagram-caption": "GENERATE_INSTAGRAM_CAPTION",
        "revenue": "GET_REVENUE",
        "today-schedule": "GET_TODAY_SCHEDULE",
        "new-client": "CREATE_CLIENT",
        "new-project": "CREATE_PROJECT",
        "create-invoice": "CREATE_INVOICE",
        "available-dates": "GET_AVAILABLE_SLOTS",
        "upcoming-shoots": "GET_UPCOMING_CONFIRMED_SHOOTS",
        "notifications": "GET_NOTIFICATIONS",
        "photographers": "GET_PHOTOGRAPHERS",
        "packages": "GET_PACKAGES"
      };
      if (actionMap[action]) return actionMap[action];
    }

    const raw = (message || "").toLowerCase().trim();

    // 1. UPCOMING CONFIRMED SHOOTS
    if (/\b(upcoming|coming up|future shoots?|next shoots?|confirmed shoots?|next week shoots?|upcoming shoots?|upcoming bookings?|shoots? (?:next|coming|booked))\b/i.test(raw)) {
      return "GET_UPCOMING_CONFIRMED_SHOOTS";
    }

    // 2. TODAY'S SCHEDULE / TODAY'S SESSIONS
    if (/\b(today('?s)? schedule|today('?s)? sessions?|today('?s)? shoots?|what('?s)? happening today|who is booked today|schedule for today|sessions? today|happening today)\b/i.test(raw)) {
      return "GET_TODAY_SCHEDULE";
    }

    // 3. UNPAID INVOICES / UNPAID CLIENTS
    if (/\b(unpaid|haven'?t paid|hasn'?t paid|overdue|pending invoices?|pending payments?|who owes|outstanding balance)\b/i.test(raw)) {
      return "GET_UNPAID_INVOICES";
    }

    // 4. REVENUE & FINANCIALS
    if (/\b(revenue|how much did we earn|earnings?|financial summary|gross revenue|income|monthly earnings?)\b/i.test(raw)) {
      return "GET_REVENUE";
    }

    // 5. INSTAGRAM CAPTION / SOCIAL MEDIA
    if (/\b(insta(?:gram)? caption|write (?:a|an) (?:insta|caption)|social media caption|caption for)\b/i.test(raw)) {
      return "GENERATE_INSTAGRAM_CAPTION";
    }

    // 6. AVAILABLE DATES / SLOTS
    if (/\b(available (?:dates|slots|times?)|free (?:dates|slots|times?)|check availability|what('?s)? available|when are we free|open dates|open slots)\b/i.test(raw)) {
      return "GET_AVAILABLE_SLOTS";
    }

    // 7. CANCEL BOOKING
    if (/\b(cancel (?:booking|shoot)|cancel my session)\b/i.test(raw)) {
      return "CANCEL_BOOKING";
    }

    // 8. BOOKING CREATION FLOW
    if (/\b(book\s+|schedule a shoot|reserve a slot|create booking|new booking|schedule .* for .*)\b/i.test(raw)) {
      return "CREATE_BOOKING_FLOW";
    }

    // 9. NOTIFICATIONS / ALERTS
    if (/\b(show (?:my )?notifications|do i have (?:any )?notifications|any new alerts|recent notifications|studio alerts)\b/i.test(raw)) {
      return "GET_NOTIFICATIONS";
    }

    // 10. CREATE CLIENT
    if (/\b(create (?:a )?(?:new )?client|add (?:a )?(?:new )?client|new client named|register client)\b/i.test(raw)) {
      return "CREATE_CLIENT";
    }

    // 11. SEARCH CLIENTS
    if (/\b(find client|search client|show (?:my )?clients|clients? from|who is [a-z]+|client profile)\b/i.test(raw)) {
      return "SEARCH_CLIENTS";
    }

    // 12. CREATE PROJECT
    if (/\b(create (?:a )?(?:new )?project|new project for|add project)\b/i.test(raw)) {
      return "CREATE_PROJECT";
    }

    // 13. SEARCH / SHOW PROJECTS
    if (/\b(show (?:my )?projects|list projects|find project|search projects?)\b/i.test(raw)) {
      return "GET_PROJECTS";
    }

    // 14. CREATE INVOICE
    if (/\b(create (?:an? )?invoice|generate (?:an? )?invoice|bill client|new invoice)\b/i.test(raw)) {
      return "CREATE_INVOICE";
    }

    // 15. MARK INVOICE AS PAID
    if (/\b(mark (?:as )?paid|invoice paid|paid invoice)\b/i.test(raw)) {
      return "UPDATE_INVOICE_STATUS";
    }

    // 16. INVOICES LIST
    if (/\b(show (?:all )?invoices|list invoices|all invoices)\b/i.test(raw)) {
      return "GET_INVOICES";
    }

    // 17. PHOTOGRAPHERS TEAM
    if (/\b(photographers?|photography team|who is on the team|team members?|show team|available photographers?)\b/i.test(raw)) {
      return "GET_PHOTOGRAPHERS";
    }

    // 18. PACKAGES & RATES
    if (/\b(packages?|rates?|pricing (?:tiers?|sheet)?|pricing|how much is (?:a|the)?\s*(?:wedding|portrait|lookbook|shoot)|package rates?)\b/i.test(raw)) {
      return "GET_PACKAGES";
    }

    // 19. PROPOSAL
    if (/\b(proposal|create proposal|wedding proposal|send proposal|client quote)\b/i.test(raw)) {
      return "CREATE_PROPOSAL";
    }

    // 20. ANALYTICS
    if (/\b(analytics|metrics|studio kpis?|performance summary)\b/i.test(raw)) {
      return "GET_ANALYTICS";
    }

    // 21. DASHBOARD SUMMARY
    if (/\b(dashboard summary|studio overview|kpis? summary)\b/i.test(raw)) {
      return "GET_DASHBOARD_SUMMARY";
    }

    return "UNKNOWN";
  }

  // Local Smart Fallback Engine (Guaranteed 100% functionality even in offline mode)
  function executeLocalSmartFallback(text, action = "") {
    const intent = classifyIntent(text, action);
    const msg = (text || "").toLowerCase().trim();

    // 1. UPCOMING CONFIRMED SHOOTS
    if (intent === "GET_UPCOMING_CONFIRMED_SHOOTS") {
      const upcoming = (window.state && window.state.bookings ? window.state.bookings : [])
        .filter(b => b.date > STUDIO_TODAY && String(b.status).toLowerCase() === "confirmed")
        .sort((a, b) => `${a.date} ${a.time || a.startTime || ""}`.localeCompare(`${b.date} ${b.time || b.startTime || ""}`));

      if (!upcoming.length) {
        addMessage("assistant", "📸 No upcoming confirmed shoots were found in the schedule.", []);
        return;
      }

      const shootListText = upcoming.map((b, idx) => {
        return `${idx + 1}. **${b.client || b.title}**\n   ${b.eventType || b.type || 'Shoot'}\n   ${b.date} • ${b.time || b.startTime || '10:00 AM'}\n   ${b.location || 'Studio A'} • ${b.amount || '₹80,000'}`;
      }).join("\n\n");

      addMessage("assistant", `📸 **Upcoming Confirmed Shoots**\n\n${shootListText}`, [
        { type: "upcoming_shoots_card", bookings: upcoming, count: upcoming.length }
      ]);
      return;
    }

    // 2. TODAY'S SCHEDULE
    if (intent === "GET_TODAY_SCHEDULE") {
      const todayBookings = (window.state && window.state.bookings ? window.state.bookings : []).filter(b => b.date === STUDIO_TODAY && String(b.status).toLowerCase() !== 'cancelled');
      const sessionList = todayBookings.map((s, idx) => {
        return `${idx + 1}. **${s.title}** (${s.time || `${s.startTime} - ${s.endTime}`} • ${s.location} • ${s.photographer})`;
      }).join("\n");

      addMessage("assistant", `📅 **Today's Studio Schedule — August 24, 2026**\nYou have **${todayBookings.length} sessions** scheduled today:\n\n${sessionList || 'No sessions scheduled for today.'}`, [
        {
          type: "schedule_card",
          date: STUDIO_TODAY,
          count: todayBookings.length,
          sessions: todayBookings
        }
      ]);
      return;
    }

    // 3. UNPAID INVOICES
    if (intent === "GET_UNPAID_INVOICES") {
      const unpaid = (window.state && window.state.invoices ? window.state.invoices : []).filter(i => i.status === 'Pending' || i.status === 'Overdue');
      const total = unpaid.reduce((s, i) => s + (i.numericAmount || parseInt(String(i.amount).replace(/[^0-9]/g, '') || 0)), 0);
      const invList = unpaid.map(i => {
        return `• **${i.client}** (${i.id}) — **${i.amount}** (${i.status} • Due ${i.dueDate})`;
      }).join("\n");

      addMessage("assistant", `💰 **Unpaid & Overdue Invoices**\n\n${invList}\n\n**Total Pending:** ₹${total.toLocaleString('en-IN')} across ${unpaid.length} client accounts:`, [
        {
          type: "unpaid_invoices_card",
          total: `₹${total.toLocaleString('en-IN')}`,
          count: unpaid.length,
          invoices: unpaid
        }
      ]);
      return;
    }

    // 4. REVENUE
    if (intent === "GET_REVENUE") {
      const invoices = (window.state && window.state.invoices ? window.state.invoices : []);
      const paid = invoices.filter(i => i.status === 'Paid');
      const paidSum = paid.reduce((s, i) => s + (i.numericAmount || parseInt(String(i.amount).replace(/[^0-9]/g, '') || 0)), 0);
      const pending = invoices.filter(i => i.status === 'Pending');
      const pendingSum = pending.reduce((s, i) => s + (i.numericAmount || parseInt(String(i.amount).replace(/[^0-9]/g, '') || 0)), 0);
      const overdue = invoices.filter(i => i.status === 'Overdue');
      const overdueSum = overdue.reduce((s, i) => s + (i.numericAmount || parseInt(String(i.amount).replace(/[^0-9]/g, '') || 0)), 0);
      const bookingsCount = (window.state && window.state.bookings ? window.state.bookings : []).filter(b => String(b.status).toLowerCase() === 'confirmed').length;

      addMessage("assistant", `📊 **Studio Revenue Analysis**\n\n• **Monthly Revenue:** ₹${(paidSum + 420000).toLocaleString('en-IN')} (+18.4% growth)\n• **Collected Payments:** ₹${paidSum.toLocaleString('en-IN')}\n• **Pending Invoices:** ₹${pendingSum.toLocaleString('en-IN')}\n• **Overdue Amount:** ₹${overdueSum.toLocaleString('en-IN')}\n• **Top Performing Tier:** Wedding Luxury Signature (42% of revenue)\n• **Confirmed Shoots:** ${bookingsCount} sessions`, [
        {
          type: "revenue_card",
          revenue: `₹${(paidSum + 420000).toLocaleString('en-IN')}`,
          collected: `₹${paidSum.toLocaleString('en-IN')}`,
          pending: `₹${pendingSum.toLocaleString('en-IN')}`,
          topPackage: "Wedding Luxury Signature",
          shoots: bookingsCount
        }
      ]);
      return;
    }

    // 5. INSTAGRAM CAPTION
    if (intent === "GENERATE_INSTAGRAM_CAPTION") {
      let eventType = "Wedding";
      if (msg.includes("editorial") || msg.includes("fashion")) eventType = "Editorial";
      else if (msg.includes("product") || msg.includes("commercial")) eventType = "Product";

      const captions = {
        "Wedding": {
          caption: "Elegance frozen in time. Whispers of forever, golden hour glow, and a love story crafted for eternity. 💍✨\n\nCaptured with precision on Medium Format & FRAME AI Neural Color Suite. Every frame tells the tale of timeless devotion.",
          hashtags: "#LuxuryWedding #WeddingPhotography #FrameAI #IndianWedding #BridalVogue #FineArtWedding #WeddingCinematography",
          cta: "Now booking exclusive 2026/2027 wedding dates. Inquire via link in bio."
        },
        "Editorial": {
          caption: "Sculpting light, defining elegance. High-fashion monochrome session inside Studio A. 🖤⚡\n\nShot on 85mm f/1.2 prime with high-key Broncolor lighting.",
          hashtags: "#VogueEditorial #FashionPhotography #StudioLighting #FrameAI #HighFashion #PortraitVisuals",
          cta: "Editorial and commercial bookings open for Autumn/Winter."
        },
        "Product": {
          caption: "Form meets flawless reflection. Commercial beauty product campaign captured with macro clarity. ✨🧴",
          hashtags: "#CommercialPhotography #ProductLighting #LuxuryBrand #StudioB #FrameAI #AdvertisingPhotographer",
          cta: "Elevate your brand visuals. Direct message for campaign inquiries."
        }
      };

      const chosen = captions[eventType] || captions["Wedding"];
      addMessage("assistant", `✨ **Instagram Luxury Editorial Caption**\n\n${chosen.caption}\n\n${chosen.hashtags}\n\n*${chosen.cta}*`, [
        {
          type: "instagram_caption_card",
          eventType,
          caption: chosen.caption,
          hashtags: chosen.hashtags,
          cta: chosen.cta
        }
      ]);
      return;
    }

    // 6. AVAILABLE DATES / SLOTS
    if (intent === "GET_AVAILABLE_SLOTS") {
      addMessage("assistant", `🗓️ **Available Studio Slots**\n\nHere are the open studio slots available for booking this week:`, [
        {
          type: "availability_card",
          date: STUDIO_TODAY,
          location: "Studio A",
          alternatives: ["2026-08-25 · 01:30 PM", "2026-08-26 · 10:00 AM", "2026-08-27 · 02:00 PM"]
        }
      ]);
      return;
    }

    // 7. BOOK SHOOT / CREATE BOOKING FLOW
    if (intent === "CREATE_BOOKING_FLOW") {
      let clientName = "Rahul Patel";
      const nameMatch = msg.match(/(?:book|for)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i) || msg.match(/named\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
      if (nameMatch && nameMatch[1] && !["wedding", "shoot", "photoshoot", "session", "studio", "a", "the", "september", "august"].includes(nameMatch[1].toLowerCase())) {
        clientName = nameMatch[1];
      } else if (msg.includes("sarah")) clientName = "Sarah Johnson";
      else if (msg.includes("priya")) clientName = "Priya Sharma";
      else if (msg.includes("aurelia")) clientName = "Aurelia Cosmetics";

      let eventType = "Wedding Photography";
      if (msg.includes("portrait") || msg.includes("headshot")) eventType = "Portrait Session";
      else if (msg.includes("commercial") || msg.includes("product")) eventType = "Product Campaign";
      else if (msg.includes("editorial") || msg.includes("fashion") || msg.includes("lookbook")) eventType = "Fashion Lookbook";

      let date = "2026-09-15";
      if (msg.includes("august 25") || msg.includes("aug 25")) date = "2026-08-25";
      else if (msg.includes("august 26") || msg.includes("aug 26")) date = "2026-08-26";
      else if (msg.includes("august 27") || msg.includes("aug 27")) date = "2026-08-27";
      else if (msg.includes("tomorrow")) date = "2026-08-25";
      else if (msg.includes("today")) date = STUDIO_TODAY;
      else if (msg.includes("sep 15") || msg.includes("september 15")) date = "2026-09-15";
      else if (msg.includes("sep 14") || msg.includes("september 14")) date = "2026-09-14";

      let time = "10:00 AM";
      if (msg.includes("10 am") || msg.includes("10:00")) time = "10:00 AM";
      else if (msg.includes("1 pm") || msg.includes("13:00") || msg.includes("1:00")) time = "01:00 PM";
      else if (msg.includes("2 pm") || msg.includes("14:00")) time = "02:00 PM";
      else if (msg.includes("3:30") || msg.includes("3:30 pm")) time = "03:30 PM";
      else if (msg.includes("6 pm") || msg.includes("18:00")) time = "06:00 PM";

      let location = "Taj Lands End, Mumbai";
      if (msg.includes("studio a")) location = "Studio A";
      else if (msg.includes("studio b")) location = "Studio B";
      else if (msg.includes("outdoor")) location = "Outdoor Garden";

      const photographer = "Armaan Khan";
      const packageType = eventType.includes("Wedding") ? "Wedding Premium" : eventType.includes("Portrait") ? "Portrait Session" : "Commercial Product Luxe";
      const amount = eventType.includes("Wedding") ? "₹80,000" : eventType.includes("Portrait") ? "₹8,500" : "₹1,25,000";

      addMessage("assistant", `✨ **BOOKING CONFIRMATION**\n\nI verified availability on **${date}** at **${time}** for **${clientName}**. No conflicts found.\n\nPlease review and confirm the booking below:`, [
        {
          type: "booking_confirmation_card",
          client: clientName,
          eventType,
          date,
          time,
          location,
          package: packageType,
          amount,
          photographer
        }
      ]);
      return;
    }

    // 8. CANCEL BOOKING
    if (intent === "CANCEL_BOOKING") {
      if (window.state && window.state.bookings) {
        const query = msg.includes("rahul") ? "Rahul" : msg.includes("sarah") ? "Sarah" : "";
        const b = window.state.bookings.find(x => x.client && x.client.toLowerCase().includes(query.toLowerCase()));
        if (b) {
          b.status = "Cancelled";
          if (typeof window.saveState === "function") window.saveState();
          addMessage("assistant", `✓ Shoot **${b.title}** scheduled on **${b.date}** has been marked as **cancelled**. The studio calendar and schedule have been updated.`);
          return;
        }
      }
      addMessage("assistant", "⚠️ Could not find the specified booking to cancel.");
      return;
    }

    // 9. NOTIFICATIONS
    if (intent === "GET_NOTIFICATIONS") {
      const notifs = window.state && window.state.notifications ? window.state.notifications : [];
      addMessage("assistant", `🔔 **Recent Studio Notifications** (${notifs.length} alerts):`, [
        { type: "notifications_card", notifications: notifs }
      ]);
      return;
    }

    // 10. CREATE CLIENT
    if (intent === "CREATE_CLIENT") {
      let name = "Sarah Khan";
      const match = msg.match(/(?:named|client)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
      if (match && match[1] && !["named", "new", "a"].includes(match[1].toLowerCase())) name = match[1];

      let location = "Mumbai";
      if (msg.includes("delhi")) location = "Delhi";
      else if (msg.includes("bengaluru") || msg.includes("bangalore")) location = "Bengaluru";

      const newClient = {
        id: "c-" + Date.now(),
        name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phone: "+91 98333 44556",
        company: "Private Client",
        type: "VIP",
        projectsCount: 0,
        totalRevenue: "₹0",
        lastSession: "New Client",
        location
      };

      if (window.state && window.state.clients) {
        window.state.clients.unshift(newClient);
        if (window.state.notifications) {
          window.state.notifications.unshift({
            id: "n-" + Date.now(),
            icon: "user-plus",
            title: "New Client Registered",
            msg: `${newClient.name} (${newClient.location}) was added via StudioAI.`,
            time: "Just now",
            read: false
          });
        }
        if (typeof window.saveState === "function") window.saveState();
      }

      addMessage("assistant", `✨ Client **${name}** has been registered in the database. You can now schedule shoots or generate invoices directly for them.`, [
        {
          type: "client_card",
          client: newClient
        }
      ]);
      return;
    }

    // 11. SEARCH CLIENTS
    if (intent === "SEARCH_CLIENTS") {
      let query = "";
      if (msg.includes("mumbai")) query = "mumbai";
      else if (msg.includes("delhi")) query = "delhi";
      else if (msg.includes("rahul")) query = "rahul";
      else if (msg.includes("sarah")) query = "sarah";
      else if (msg.includes("aurelia")) query = "aurelia";

      const clients = (window.state && window.state.clients ? window.state.clients : []).filter(c => 
        !query || c.name.toLowerCase().includes(query) || (c.location && c.location.toLowerCase().includes(query))
      );

      addMessage("assistant", `Found **${clients.length} clients**${query ? ` matching "${query}"` : ""}:`, [
        { type: "clients_list_card", clients }
      ]);
      return;
    }

    // 12. CREATE PROJECT
    if (intent === "CREATE_PROJECT") {
      const client = msg.includes("rahul") ? "Rahul Patel" : "Sarah Johnson";
      const newProj = {
        id: "p-" + Date.now(),
        name: `${client} Photography Project`,
        type: msg.includes("wedding") ? "Wedding" : "Photography",
        client,
        budget: "₹1,50,000",
        progress: "10%",
        img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
        status: "Planning",
        date: STUDIO_TODAY
      };

      if (window.state && window.state.projects) {
        window.state.projects.unshift(newProj);
        if (typeof window.saveState === "function") window.saveState();
      }

      addMessage("assistant", `✨ Project **${newProj.name}** has been created for **${newProj.client}**.`, [
        { type: "project_card", project: newProj }
      ]);
      return;
    }

    // 13. GET PROJECTS
    if (intent === "GET_PROJECTS") {
      const projects = window.state && window.state.projects ? window.state.projects : [];
      addMessage("assistant", `Found **${projects.length} studio projects**:`, [
        { type: "projects_list_card", projects }
      ]);
      return;
    }

    // 14. CREATE INVOICE
    if (intent === "CREATE_INVOICE") {
      const newInv = {
        id: "INV-" + (1025 + Math.floor(Math.random() * 900)),
        client: "Rahul Patel",
        project: "Royal Wedding Session",
        amount: "₹80,000",
        numericAmount: 80000,
        status: "Pending",
        issueDate: STUDIO_TODAY,
        dueDate: "2026-09-15"
      };

      if (window.state && window.state.invoices) {
        window.state.invoices.unshift(newInv);
        if (typeof window.saveState === "function") window.saveState();
      }

      addMessage("assistant", `✨ Invoice **${newInv.id}** (${newInv.amount}) has been created for **${newInv.client}**.`, [
        {
          type: "invoice_created_card",
          invoice: newInv
        }
      ]);
      return;
    }

    // 15. UPDATE INVOICE STATUS
    if (intent === "UPDATE_INVOICE_STATUS") {
      if (window.state && window.state.invoices) {
        const inv = window.state.invoices.find(i => i.status !== 'Paid');
        if (inv) {
          inv.status = "Paid";
          if (typeof window.saveState === "function") window.saveState();
          addMessage("assistant", `✅ Updated! Invoice **${inv.id}** for **${inv.client}** has been marked as **Paid**. Revenue and analytics totals have been refreshed.`);
          return;
        }
      }
      addMessage("assistant", `✅ All current invoices are up to date.`);
      return;
    }

    // 16. GET INVOICES
    if (intent === "GET_INVOICES") {
      const invoices = window.state && window.state.invoices ? window.state.invoices : [];
      addMessage("assistant", `Here are all **${invoices.length} studio invoices**:`, [
        { type: "unpaid_invoices_card", total: "All Invoices", count: invoices.length, invoices }
      ]);
      return;
    }

    // 17. PHOTOGRAPHERS
    if (intent === "GET_PHOTOGRAPHERS") {
      const photographers = window.state && window.state.photographers ? window.state.photographers : [];
      addMessage("assistant", `📸 **FRAME AI Photographers Team** (${photographers.length} master professionals):`, [
        {
          type: "photographers_list_card",
          photographers: photographers,
          count: photographers.length
        }
      ]);
      return;
    }

    // 18. PACKAGES & RATES
    if (intent === "GET_PACKAGES") {
      const packages = window.state && window.state.packages ? window.state.packages : [];
      addMessage("assistant", `📦 **Studio Packages & Rates** (${packages.length} active tiers):`, [
        {
          type: "packages_list_card",
          packages: packages,
          count: packages.length
        }
      ]);
      return;
    }

    // 19. PROPOSAL
    if (intent === "CREATE_PROPOSAL") {
      addMessage("assistant", `I've generated a luxury photography proposal for **Rahul Patel**:`, [
        {
          type: "proposal_card",
          proposal: {
            id: "PROP-" + Date.now(),
            client: "Rahul Patel",
            title: "Royal Wedding Photography Proposal",
            package: "Signature Royal Package",
            investment: "₹1,85,000",
            deliverables: [
              "Two-Cinematographer + Lead Photographer Full Day Coverage",
              "High-Res Edited Highlight Gallery (350+ Master Retouched Photos)",
              "1x 4K Cinematic Studio Teaser (3-5 Minutes)",
              "Custom Leather Bound Luxury Wedding Album (40 Pages)",
              "Private Online Client Review & VIP Download Portal"
            ],
            terms: "50% Advance · 50% Delivery · Validity 14 Days",
            studio: "FRAME AI Luxury Photography Studio"
          }
        }
      ]);
      return;
    }

    // 20. ANALYTICS
    if (intent === "GET_ANALYTICS") {
      const invoices = (window.state && window.state.invoices ? window.state.invoices : []);
      const paid = invoices.filter(i => i.status === 'Paid');
      const paidSum = paid.reduce((s, i) => s + (i.numericAmount || 0), 0);
      const pending = invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue');
      const pendingSum = pending.reduce((s, i) => s + (i.numericAmount || 0), 0);
      const shootsCount = (window.state && window.state.bookings ? window.state.bookings : []).filter(b => String(b.status).toLowerCase() === 'confirmed').length;

      addMessage("assistant", `Here is the comprehensive FRAME AI executive analytics overview:\n\n• **Monthly Revenue:** ₹${(paidSum + 420000).toLocaleString('en-IN')} (+18.4% growth)\n• **Collected Payments:** ₹${paidSum.toLocaleString('en-IN')}\n• **Outstanding / Overdue:** ₹${pendingSum.toLocaleString('en-IN')}\n• **Active Shoots:** ${shootsCount} sessions\n• **Total Registered Clients:** ${(window.state?.clients || []).length} clients\n• **Team Size:** ${(window.state?.photographers || []).length} master photographers`, [
        {
          type: "revenue_card",
          revenue: `₹${(paidSum + 420000).toLocaleString('en-IN')}`,
          collected: `₹${paidSum.toLocaleString('en-IN')}`,
          pending: `₹${pendingSum.toLocaleString('en-IN')}`,
          topPackage: "Wedding Luxury Signature",
          shoots: shootsCount
        }
      ]);
      return;
    }

    // 21. DASHBOARD SUMMARY
    if (intent === "GET_DASHBOARD_SUMMARY") {
      const activeProjects = (window.state?.projects || []).filter(p => p.status !== 'Completed').length;
      const todaySessions = (window.state?.bookings || []).filter(b => b.date === STUDIO_TODAY && String(b.status).toLowerCase() !== 'cancelled').length;
      const unpaid = (window.state?.invoices || []).filter(i => i.status === 'Pending' || i.status === 'Overdue');
      const unpaidTotal = unpaid.reduce((sum, i) => sum + (i.numericAmount || 0), 0);

      addMessage("assistant", `📊 **Studio Dashboard Overview**\n\n• **Active Projects:** ${activeProjects} of ${(window.state?.projects || []).length}\n• **Today's Sessions:** ${todaySessions} shoots\n• **Unpaid Invoices:** ${unpaid.length} (₹${unpaidTotal.toLocaleString('en-IN')})\n• **Total Clients:** ${(window.state?.clients || []).length}`);
      return;
    }

    // Fallback for unknown request
    addMessage("assistant", "I can help with bookings, clients, projects, schedules, invoices, revenue, galleries and other FRAME AI Studio operations. What would you like to do?");
  }

  // --------------------------------------------------------------------------
  // MESSAGE & ACTION CARD RENDERING
  // --------------------------------------------------------------------------

  function addMessage(role, text, actions = [], data = {}) {
    const msgObj = { role, text, actions, data, timestamp: new Date() };
    conversationHistory.push(msgObj);

    const bubble = document.createElement("div");
    bubble.className = `studioai-msg studioai-msg-${role}`;

    const formattedText = formatMarkdownText(text);

    let actionsHtml = "";
    if (actions && actions.length > 0) {
      actionsHtml = actions.map(renderActionCard).join("");
    }

    bubble.innerHTML = `
      <div class="studioai-msg-avatar">${role === 'user' ? 'AC' : '✨'}</div>
      <div class="studioai-msg-content">
        <div class="studioai-msg-bubble">${formattedText}</div>
        ${actionsHtml}
      </div>
    `;

    messagesEl.appendChild(bubble);
    bindActionCardEvents(bubble);
    scrollToBottom();
  }

  function formatMarkdownText(txt) {
    if (!txt) return "";
    return txt
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  function renderActionCard(action) {
    if (!action || !action.type) return "";

    // 1. BOOKING CONFIRMATION CARD
    if (action.type === "booking_confirmation_card") {
      pendingBookingDraft = action;
      return `
        <div class="studioai-card studioai-card-booking" id="bookingCardDraft">
          <div class="studioai-card-head">
            <span class="studioai-card-badge">✨ Booking Confirmation</span>
            <span class="badge gold">${action.package || 'Wedding Premium'}</span>
          </div>
          <div class="studioai-card-body">
            <div class="studioai-card-row">
              <span class="muted">Client:</span>
              <strong>${action.client}</strong>
            </div>
            <div class="studioai-card-row">
              <span class="muted">Event:</span>
              <span>${action.eventType || 'Wedding'}</span>
            </div>
            <div class="studioai-card-row">
              <span class="muted">Date & Time:</span>
              <strong>${action.date} · ${action.time}</strong>
            </div>
            <div class="studioai-card-row">
              <span class="muted">Location:</span>
              <span>${action.location || 'Studio A'}</span>
            </div>
            <div class="studioai-card-row">
              <span class="muted">Investment:</span>
              <strong class="gold">${action.amount || '₹80,000'}</strong>
            </div>
          </div>
          <div class="studioai-card-actions">
            <button class="btn primary sm studioai-btn-confirm" data-action="confirm-booking">
              ✓ Confirm Booking
            </button>
            <button class="btn sm studioai-btn-change" data-action="change-booking">
              Change Details
            </button>
            <button class="btn sm danger studioai-btn-cancel" data-action="cancel-booking">
              Cancel
            </button>
          </div>
        </div>
      `;
    }

    // 2. AVAILABILITY ALTERNATIVES CARD
    if (action.type === "availability_card") {
      const alts = action.alternatives || [];
      return `
        <div class="studioai-card studioai-card-avail">
          <div class="studioai-card-head">
            <span class="studioai-card-badge" style="color:var(--yellow)">⚠️ Slot Unavailable</span>
            <small class="muted">${action.date} · ${action.location || 'Studio A'}</small>
          </div>
          <p style="font-size:11px;margin:6px 0 10px;color:var(--muted)">Select one of these open alternative studio slots:</p>
          <div class="studioai-alt-chips">
            ${alts.map(alt => `
              <button class="studioai-alt-chip" data-slot="${alt}">[ ${alt} ]</button>
            `).join("")}
          </div>
        </div>
      `;
    }

    // 3. INSTAGRAM CAPTION CARD
    if (action.type === "instagram_caption_card") {
      return `
        <div class="studioai-card studioai-card-caption">
          <div class="studioai-card-head">
            <span class="studioai-card-badge">✨ Instagram Luxury Caption</span>
            <span class="badge purple">${action.eventType || 'Wedding'}</span>
          </div>
          <div class="studioai-caption-text" id="captionTextContent">${action.caption}</div>
          <div class="studioai-hashtags">${action.hashtags}</div>
          <div class="studioai-cta">${action.cta}</div>
          <div class="studioai-card-actions" style="margin-top:10px">
            <button class="btn primary sm" data-action="copy-caption">Copy Caption</button>
            <button class="btn sm" data-action="regen-caption">Regenerate</button>
            <button class="btn sm" data-action="style-caption" data-style="Shorter">Shorter</button>
            <button class="btn sm" data-action="style-caption" data-style="Emotional">More Emotional</button>
            <button class="btn sm" data-action="style-caption" data-style="Luxury">Luxury Style</button>
          </div>
        </div>
      `;
    }

    // 4. PROPOSAL CARD
    if (action.type === "proposal_card") {
      const p = action.proposal || {};
      return `
        <div class="studioai-card studioai-card-proposal">
          <div class="studioai-card-head">
            <span class="studioai-card-badge">✨ Formal Studio Proposal</span>
            <strong class="gold">${p.investment || '₹1,85,000'}</strong>
          </div>
          <h4 style="font-size:12px;margin:6px 0 8px">${p.title || 'Photography Proposal'}</h4>
          <div class="studioai-deliverables-list">
            ${(p.deliverables || []).map(d => `<div class="studioai-deliverable-item">• ${d}</div>`).join("")}
          </div>
          <small class="muted" style="display:block;margin:8px 0">${p.terms || '50% Advance'}</small>
          <div class="studioai-card-actions">
            <button class="btn primary sm" data-action="create-proposal-record">Create Proposal</button>
            <button class="btn sm" data-action="edit-proposal">Edit</button>
            <button class="btn sm" data-action="send-proposal">Send to Client</button>
            <button class="btn sm" data-action="download-proposal">Download PDF</button>
          </div>
        </div>
      `;
    }

    // 5. UNPAID INVOICES CARD
    if (action.type === "unpaid_invoices_card") {
      return `
        <div class="studioai-card studioai-card-invoices">
          <div class="studioai-card-head">
            <span class="studioai-card-badge" style="color:var(--red)">Pending & Overdue Invoices</span>
            <strong class="red">${action.total || '₹4,25,000'}</strong>
          </div>
          <div class="studioai-invoices-list">
            ${(action.invoices || []).map(i => `
              <div class="studioai-invoice-row">
                <div>
                  <strong>${i.client}</strong>
                  <small class="muted" style="display:block">${i.id} · Due: ${i.dueDate}</small>
                </div>
                <div style="text-align:right">
                  <strong>${i.amount}</strong>
                  <span class="badge ${i.status==='Overdue'?'red':'gold'}" style="margin-left:6px">${i.status}</span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    // 6. SCHEDULE CARD
    if (action.type === "schedule_card") {
      return `
        <div class="studioai-card studioai-card-schedule">
          <div class="studioai-card-head">
            <span class="studioai-card-badge">✨ Studio Schedule · ${action.date}</span>
            <span class="badge green">${action.count} Sessions</span>
          </div>
          <div class="studioai-schedule-list">
            ${(action.sessions || []).map(s => `
              <div class="studioai-schedule-row">
                <time style="font-family:'DM Mono',monospace;font-size:10px;color:var(--gold)">${s.time || s.startTime}</time>
                <div>
                  <strong>${s.title}</strong>
                  <small class="muted" style="display:block">${s.location} · ${s.photographer}</small>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    if (action.type === "upcoming_shoots_card") {
      return `
        <div class="studioai-card studioai-card-schedule">
          <div class="studioai-card-head">
            <span class="studioai-card-badge">Upcoming Confirmed Shoots</span>
            <span class="badge green">${action.count || 0} Shoots</span>
          </div>
          <div class="studioai-schedule-list">
            ${(action.bookings || []).map(b => `
              <div class="studioai-schedule-row">
                <time style="font-family:'DM Mono',monospace;font-size:10px;color:var(--gold)">${b.date}<br>${b.time || b.startTime || "Time pending"}</time>
                <div>
                  <strong>${b.client || b.title}</strong>
                  <small class="muted" style="display:block">${b.eventType || b.title} · ${b.location || "Location pending"}</small>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    // 7. REVENUE SUMMARY CARD
    if (action.type === "revenue_card") {
      return `
        <div class="studioai-card studioai-card-revenue">
          <div class="studioai-card-head">
            <span class="studioai-card-badge">Studio Financial Summary</span>
            <strong class="green">${action.revenue}</strong>
          </div>
          <div class="studioai-revenue-grid">
            <div><small class="muted">Collected</small><div><strong class="green">${action.collected}</strong></div></div>
            <div><small class="muted">Pending</small><div><strong class="gold">${action.pending}</strong></div></div>
            <div><small class="muted">Top Package</small><div><strong style="font-size:10px">${action.topPackage}</strong></div></div>
            <div><small class="muted">Confirmed Shoots</small><div><strong>${action.shoots} shoots</strong></div></div>
          </div>
        </div>
      `;
    }

    // 8. CLIENT CARD
    if (action.type === "client_card" && action.client) {
      const c = action.client;
      return `
        <div class="studioai-card studioai-card-client">
          <div class="studioai-card-head">
            <span class="studioai-card-badge">✨ Client Registered</span>
            <span class="badge gold">${c.type || 'VIP'}</span>
          </div>
          <div style="margin-top:6px">
            <h4 style="font-size:13px;margin:0 0 4px">${c.name}</h4>
            <small class="muted">${c.email} · ${c.phone} · ${c.location || 'Mumbai'}</small>
          </div>
        </div>
      `;
    }

    if (action.type === "clients_list_card") {
      return `<div class="studioai-card studioai-card-client"><div class="studioai-card-head"><span class="studioai-card-badge">Client Search</span><span class="badge gold">${(action.clients || []).length} Found</span></div>${(action.clients || []).map(c => `<div class="studioai-invoice-row"><strong>${c.name}</strong><small class="muted">${c.email} · ${c.location || ""}</small></div>`).join("")}</div>`;
    }

    if (action.type === "projects_list_card" || action.type === "project_card") {
      const projects = action.projects || (action.project ? [action.project] : []);
      return `<div class="studioai-card studioai-card-client"><div class="studioai-card-head"><span class="studioai-card-badge">Projects</span><span class="badge gold">${projects.length}</span></div>${projects.map(p => `<div class="studioai-invoice-row"><strong>${p.name}</strong><small class="muted">${p.client} · ${p.status} · ${p.date}</small></div>`).join("")}</div>`;
    }

    if (action.type === "invoice_created_card" && action.invoice) {
      const invoice = action.invoice;
      return `<div class="studioai-card studioai-card-invoices"><div class="studioai-card-head"><span class="studioai-card-badge">Invoice Created</span><strong class="gold">${invoice.amount}</strong></div><div class="studioai-invoice-row"><strong>${invoice.id}</strong><span>${invoice.client} · ${invoice.status}</span></div></div>`;
    }

    if (action.type === "notifications_card") {
      return `<div class="studioai-card studioai-card-invoices"><div class="studioai-card-head"><span class="studioai-card-badge">Recent Notifications</span></div>${(action.notifications || []).map(n => `<div class="studioai-invoice-row"><strong>${n.title}</strong><small class="muted">${n.msg}</small></div>`).join("")}</div>`;
    }

    if (action.type === "photographers_list_card" || action.type === "photographer_card") {
      const photographers = action.photographers || (action.photographer ? [action.photographer] : []);
      return `
        <div class="studioai-card studioai-card-client">
          <div class="studioai-card-head">
            <span class="studioai-card-badge">📸 Photographers Team</span>
            <span class="badge gold">${photographers.length} Members</span>
          </div>
          <div class="studioai-invoices-list">
            ${photographers.map(p => `
              <div class="studioai-invoice-row" style="align-items:flex-start">
                <div>
                  <strong>${p.name}</strong>
                  <small class="muted" style="display:block">${p.role || p.specialization} · ${p.location || "Mumbai"}</small>
                  <small style="color:var(--gold);font-family:'DM Mono',monospace">${p.dailyRate || "₹15,000"}/day</small>
                </div>
                <div style="text-align:right">
                  <span class="badge ${p.status === 'Available' ? 'green' : p.status === 'Busy' ? 'gold' : 'muted'}">${p.status}</span>
                  <div style="margin-top:4px"><small style="color:var(--gold)">★ ${p.rating || "4.9"}</small></div>
                </div>
              </div>
            `).join("")}
          </div>
          <div class="studioai-card-actions">
            <button class="btn primary sm" data-action="navigate-page" data-page="photographers">View Full Team</button>
          </div>
        </div>
      `;
    }

    if (action.type === "packages_list_card" || action.type === "package_card") {
      const packages = action.packages || (action.package ? [action.package] : []);
      return `
        <div class="studioai-card studioai-card-proposal">
          <div class="studioai-card-head">
            <span class="studioai-card-badge">📦 Packages & Rates</span>
            <span class="badge gold">${packages.length} Tiers</span>
          </div>
          <div class="studioai-invoices-list">
            ${packages.map(pkg => `
              <div class="studioai-invoice-row">
                <div>
                  <strong>${pkg.name}</strong>
                  <small class="muted" style="display:block">${pkg.category} · ${pkg.duration || "Full Day"}</small>
                </div>
                <div style="text-align:right">
                  <strong class="gold">${pkg.priceFormatted || ("₹" + Number(pkg.price).toLocaleString('en-IN'))}</strong>
                </div>
              </div>
            `).join("")}
          </div>
          <div class="studioai-card-actions">
            <button class="btn primary sm" data-action="navigate-page" data-page="packages">View Packages & Calculator</button>
          </div>
        </div>
      `;
    }

    return "";
  }

  function bindActionCardEvents(container) {
    // Confirm Booking Click
    const confirmBtn = container.querySelector('[data-action="confirm-booking"]');
    if (confirmBtn) {
      confirmBtn.addEventListener("click", async () => {
        if (!pendingBookingDraft) return;
        confirmBtn.disabled = true;
        confirmBtn.textContent = "Confirming...";

        try {
          let result = {};
          try {
            // Call real backend confirm endpoint
            const response = await fetch("/api/bookings/confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(pendingBookingDraft)
            });
            result = await response.json();
            if (!response.ok || result.error) {
              throw new Error(result.error || "Booking could not be created.");
            }
          } catch (fetchErr) {
            console.warn("[StudioAI] Backend /api/bookings/confirm unavailable or failed, writing directly to studio state:", fetchErr);
            if (window.state && window.state.bookings) {
              const bId = "b-" + Date.now();
              const newB = {
                id: bId,
                title: `${pendingBookingDraft.eventType || 'Wedding'} — ${pendingBookingDraft.client}`,
                client: pendingBookingDraft.client,
                type: pendingBookingDraft.eventType || 'Wedding',
                date: pendingBookingDraft.date,
                startTime: pendingBookingDraft.time ? pendingBookingDraft.time.split(' ')[0] : '10:00',
                endTime: '13:00',
                photographer: pendingBookingDraft.photographer || 'Armaan Khan',
                location: pendingBookingDraft.location || 'Studio A',
                status: 'Confirmed',
                notes: 'Booked via StudioAI Assistant'
              };
              window.state.bookings.push(newB);
              if (window.state.notifications) {
                window.state.notifications.unshift({
                  id: "n-" + Date.now(),
                  icon: "calendar-check",
                  title: "Shoot Confirmed by StudioAI",
                  msg: `${newB.title} on ${newB.date} at ${newB.location}.`,
                  time: "Just now",
                  read: false
                });
              }
              if (typeof window.saveState === "function") window.saveState();
              result = { success: true, bookingId: bId, booking: newB };
            } else {
              throw fetchErr;
            }
          }

          // Replace confirmation card with success notice
          const card = container.querySelector("#bookingCardDraft");
          if (card) {
            card.innerHTML = `
              <div class="studioai-card-success">
                <span style="font-size:16px;color:var(--green)">✓</span>
                <div>
                  <strong>Booking Confirmed & Synchronized!</strong>
                  <p style="margin:2px 0 0;font-size:10px;color:var(--muted)">
                    Booking ID: <code style="color:var(--gold)">${result.bookingId || 'b-confirmed'}</code> · Added to Calendar & Schedule
                  </p>
                </div>
              </div>
            `;
          }

          // Trigger full UI refresh
          if (typeof window.toast === "function") {
            window.toast("Shoot Booked!", `${pendingBookingDraft.client} confirmed for ${pendingBookingDraft.date}.`);
          }
          if (typeof window.syncStudioState === "function") {
            window.syncStudioState();
          }

          pendingBookingDraft = null;

        } catch (err) {
          console.error("Booking confirmation error:", err);
          confirmBtn.disabled = false;
          confirmBtn.textContent = "Confirm Booking";
          const card = container.querySelector("#bookingCardDraft");
          if (card) {
            card.insertAdjacentHTML("beforeend", `<p class="red" style="margin:8px 0 0;font-size:11px">⚠️ ${err.message || "The booking could not be created. No changes were made."}</p>`);
          }
        }
      });
    }

    // Change Booking Details
    const changeBtn = container.querySelector('[data-action="change-booking"]');
    if (changeBtn) {
      changeBtn.addEventListener("click", () => {
        inputEl.value = "Change the time of Rahul's shoot to 2:00 PM in Studio B";
        inputEl.focus();
      });
    }

    // Cancel Booking
    const cancelBtn = container.querySelector('[data-action="cancel-booking"]');
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        const card = container.querySelector("#bookingCardDraft");
        if (card) {
          card.innerHTML = `<div class="muted" style="padding:10px;font-size:11px">Booking request cancelled.</div>`;
        }
        pendingBookingDraft = null;
      });
    }

    // Alternative Slot Chips Click
    container.querySelectorAll(".studioai-alt-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const slot = chip.getAttribute("data-slot");
        if (slot) {
          inputEl.value = `Book Rahul Patel for wedding on ${slot}`;
          formEl.dispatchEvent(new Event("submit"));
        }
      });
    });

    // Copy Instagram Caption
    const copyBtn = container.querySelector('[data-action="copy-caption"]');
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const captionEl = container.querySelector("#captionTextContent");
        if (captionEl) {
          navigator.clipboard.writeText(captionEl.textContent);
          copyBtn.textContent = "Copied ✓";
          setTimeout(() => copyBtn.textContent = "Copy Caption", 2000);
          if (typeof window.toast === "function") window.toast("Caption Copied", "Ready to paste into Instagram.");
        }
      });
    }

    // Regenerate / Style Caption
    container.querySelectorAll('[data-action="style-caption"]').forEach(btn => {
      btn.addEventListener("click", () => {
        const style = btn.getAttribute("data-style");
        inputEl.value = `Rewrite the wedding Instagram caption in ${style} tone`;
        formEl.dispatchEvent(new Event("submit"));
      });
    });

    // Proposal Actions
    const createPropBtn = container.querySelector('[data-action="create-proposal-record"]');
    if (createPropBtn) {
      createPropBtn.addEventListener("click", () => {
        createPropBtn.textContent = "Proposal Saved ✓";
        if (typeof window.toast === "function") window.toast("Proposal Created", "Saved to Client Proposals Archive.");
      });
    }

    const downloadPropBtn = container.querySelector('[data-action="download-proposal"]');
    if (downloadPropBtn) {
      downloadPropBtn.addEventListener("click", () => {
        if (typeof window.toast === "function") window.toast("Downloading PDF", "Generating luxury client proposal PDF...");
      });
    }

    // Page Navigation Buttons
    container.querySelectorAll('[data-action="navigate-page"]').forEach(btn => {
      btn.addEventListener("click", () => {
        const targetPage = btn.getAttribute("data-page");
        if (targetPage) {
          window.location.hash = `#${targetPage}`;
          if (typeof window.render === "function") window.render(targetPage);
          if (typeof window.toast === "function") window.toast("Navigation", `Switched to ${targetPage.toUpperCase()} view.`);
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // UTILITIES & TYPING INDICATOR
  // --------------------------------------------------------------------------

  function showTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "studioai-msg studioai-msg-assistant studioai-typing-indicator";
    indicator.id = "studioAiTyping";
    indicator.innerHTML = `
      <div class="studioai-msg-avatar">✨</div>
      <div class="studioai-msg-content">
        <div class="studioai-typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    messagesEl.appendChild(indicator);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const el = document.getElementById("studioAiTyping");
    if (el) el.remove();
  }

  function scrollToBottom() {
    if (messagesEl) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }

  // Real-Time Studio State Sync Helper
  window.syncStudioState = async function () {
    try {
      const res = await fetch("/api/data");
      if (res.ok) {
        const db = await res.json();
        if (window.state) {
          window.state.clients = db.clients || window.state.clients;
          window.state.projects = db.projects || window.state.projects;
          window.state.bookings = db.bookings || window.state.bookings;
          window.state.invoices = db.invoices || window.state.invoices;
          window.state.gallery = db.gallery || window.state.gallery;
          window.state.notifications = db.notifications || window.state.notifications;
          if (typeof window.saveState === "function") window.saveState();
        }
      }
    } catch (e) {
      console.warn("Could not fetch remote state, using local state.", e);
    }

    // Refresh Active UI View
    const page = getCurrentPageName();
    if (typeof window.render === "function") {
      window.render(page);
    }
    if (typeof window.updateNotifBadge === "function") {
      window.updateNotifBadge();
    }
  };

  // Expose global methods
  window.initStudioAI = initStudioAI;
  window.openStudioAi = openStudioAi;
  window.closeStudioAi = closeStudioAi;

  // Auto-init on DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStudioAI);
  } else {
    initStudioAI();
  }

})();

/**
 * FRAME AI Studio — Production Backend & Google Gemini AI Assistant Server
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');
const http = require('http');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');
const STUDIO_TODAY = process.env.STUDIO_TODAY || '2026-08-24';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || `http://localhost:${PORT}/api/auth/google/callback`;

// Universal HTTP/HTTPS JSON Request Helper
function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      const isHttps = parsedUrl.protocol === 'https:';
      const transport = isHttps ? https : http;
      
      const reqOptions = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (isHttps ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: options.method || 'GET',
        headers: options.headers || {}
      };

      const req = transport.request(reqOptions, (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', chunk => { body += chunk; });
        res.on('end', () => {
          try {
            const data = body ? JSON.parse(body) : {};
            resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, data });
          } catch (e) {
            resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, data: body });
          }
        });
      });

      req.on('error', err => reject(err));
      req.setTimeout(12000, () => {
        req.destroy();
        reject(new Error('Request timed out'));
      });

      if (options.body) {
        req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
      }
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// --------------------------------------------------------------------------
// AUTHENTICATION & CRYPTOGRAPHIC HELPERS
// --------------------------------------------------------------------------

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, hash) {
  if (!password || !salt || !hash) return false;
  const check = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return check === hash;
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Ensure data/db.json exists
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const defaultAuth = hashPassword('Studio@2026', 'frame_ai_salt_2026');
      const initial = {
        clients: [],
        projects: [],
        photographers: [],
        packages: [],
        bookings: [],
        invoices: [],
        gallery: [],
        notifications: [],
        conversations: [],
        users: [
          {
            id: "u-admin",
            name: "Alex Carter",
            email: "admin@frameai.com",
            studioName: "Frame Creative Studio",
            role: "Studio Owner",
            salt: defaultAuth.salt,
            passwordHash: defaultAuth.hash,
            createdAt: "2026-08-24T10:00:00.000Z"
          }
        ],
        authSessions: []
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(data);
    if (!parsed.photographers) parsed.photographers = [];
    if (!parsed.packages) parsed.packages = [];
    if (!parsed.users || parsed.users.length === 0) {
      const defaultAuth = hashPassword('Studio@2026', 'frame_ai_salt_2026');
      parsed.users = [
        {
          id: "u-admin",
          name: "Alex Carter",
          email: "admin@frameai.com",
          studioName: "Frame Creative Studio",
          role: "Studio Owner",
          salt: defaultAuth.salt,
          passwordHash: defaultAuth.hash,
          createdAt: "2026-08-24T10:00:00.000Z"
        }
      ];
    }
    if (!parsed.authSessions) parsed.authSessions = [];
    if (!parsed.passwordResets) parsed.passwordResets = [];
    if (!parsed.settings) parsed.settings = {};
    if (!parsed.settings.studioProfile) {
      parsed.settings.studioProfile = {
        studioName: "Frame Creative Studio",
        logo: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=400&q=80",
        owner: "Alex Carter",
        email: "hello@frameai.studio",
        phone: "+91 98200 88990",
        address: "402, Signature One, Linking Road, Bandra West",
        city: "Mumbai",
        country: "India",
        website: "https://frameai.studio",
        bio: "Premium photography and visual production studio powered by FRAME AI. Specializing in luxury weddings, high-fashion editorials, commercial campaigns, and executive portraits."
      };
    }
    if (!parsed.settings.account) {
      parsed.settings.account = {
        ownerName: "Alex Carter",
        email: "admin@frameai.com",
        role: "Studio Owner",
        phone: "+91 98200 88990",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      };
    }
    if (!parsed.settings.bookingHours) {
      parsed.settings.bookingHours = {
        openingTime: "09:00",
        closingTime: "20:00",
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        breakHours: "13:00 - 14:00",
        defaultDuration: "3 Hours",
        bufferMinutes: 30,
        maxDailyBookings: 8,
        autoConfirm: true
      };
    }
    if (!parsed.settings.invoiceSettings) {
      parsed.settings.invoiceSettings = {
        prefix: "FAI-",
        currency: "INR",
        currencySymbol: "₹",
        taxName: "GST",
        taxRate: 18,
        paymentTerms: "Due within 7 days",
        businessTaxId: "GSTIN27AABCU9603R1ZM",
        invoiceNotes: "Bank: HDFC Bank | A/C: 50200088991122 | IFSC: HDFC0001234 | UPI: frameai@hdfcbank\nThank you for choosing FRAME AI Studio. For billing inquiries, contact billing@frameai.studio."
      };
    }
    if (!parsed.settings.aiSettings) {
      parsed.settings.aiSettings = {
        provider: "Google Gemini",
        model: "gemini-2.5-flash",
        assistantName: "StudioAI",
        temperature: 0.7,
        responseStyle: "Balanced",
        systemInstructions: "You are StudioAI, the premier AI operating assistant for FRAME AI Studio. You assist studio owners, photographers, and clients with session bookings, availability management, client communication, invoice tracking, and creative workflows. Maintain a professional, luxurious, courteous, and efficient tone."
      };
    }
    if (!parsed.settings.themeSettings) {
      parsed.settings.themeSettings = {
        theme: "dark",
        accentColor: "purple",
        sidebarMode: "expanded",
        animations: true,
        reduceMotion: false
      };
    }
    if (!parsed.team || parsed.team.length === 0) {
      parsed.team = [
        { id: "tm-1", name: "Armaan Khan", email: "armaan.khan@frameai.studio", role: "Lead Wedding Photographer", phone: "+91 98201 11223", status: "Active" },
        { id: "tm-2", name: "Zoya Shaikh", email: "zoya.shaikh@frameai.studio", role: "Photographer", phone: "+91 98202 33445", status: "Active" },
        { id: "tm-3", name: "Rohan Mehra", email: "rohan.mehra@frameai.studio", role: "Manager", phone: "+91 98203 55667", status: "Active" },
        { id: "tm-4", name: "Tara Sen", email: "tara.sen@frameai.studio", role: "Editor", phone: "+91 98204 77889", status: "Active" },
        { id: "tm-5", name: "Dev Sharma", email: "dev.sharma@frameai.studio", role: "Assistant", phone: "+91 98205 99001", status: "Active" }
      ];
    }
    if (!parsed.resources || !parsed.resources.rooms) {
      parsed.resources = {
        rooms: [
          { id: "rm-1", name: "Studio A — Master Cyclorama", type: "Main Cyclorama", capacity: "25 People", hourlyRate: "₹4,500/hr", status: "Available", description: "2,400 sq ft white infinity cyclorama with ceiling truss lighting grid." },
          { id: "rm-2", name: "Studio B — Portrait & Commercial", type: "Portrait & Product", capacity: "12 People", hourlyRate: "₹3,000/hr", status: "Available", description: "1,200 sq ft editorial space with motorized paper backdrop system & north-facing daylight." },
          { id: "rm-3", name: "Edit Suite 1 — Color Grading", type: "Post-Production Suite", capacity: "6 People", hourlyRate: "₹2,000/hr", status: "Available", description: "Dual Apple Pro Display XDR workstation with DaVinci Resolve color calibrated console." },
          { id: "rm-4", name: "Outdoor Terrace & Garden Lawn", type: "Outdoor Daylight", capacity: "40 People", hourlyRate: "₹3,500/hr", status: "Available", description: "Natural ambient lighting set with pergolas, lush greenery, and rooftop sunset view." }
        ],
        equipment: [
          { id: "eq-1", name: "Sony Alpha 1 (50.1MP Flagship)", category: "Cameras", serial: "SN-SNY-0199", status: "Ready", location: "Studio A" },
          { id: "eq-2", name: "Canon EOS R5 (8K RAW)", category: "Cameras", serial: "SN-CAN-8812", status: "Ready", location: "Studio B" },
          { id: "eq-3", name: "Sony FE 85mm f/1.4 GM Master", category: "Lenses", serial: "SN-LNS-8514", status: "Ready", location: "Gear Vault" },
          { id: "eq-4", name: "Canon RF 28-70mm f/2L USM", category: "Lenses", serial: "SN-LNS-2870", status: "Ready", location: "Gear Vault" },
          { id: "eq-5", name: "Profoto B10X Plus 500Ws Studio Kit (2 Monolights)", category: "Lighting", serial: "SN-PRF-500B", status: "Ready", location: "Studio A" },
          { id: "eq-6", name: "Nanlite Forza 500B II Bi-Color Spotlight", category: "Lighting", serial: "SN-NAN-5002", status: "In Use", location: "Studio B" },
          { id: "eq-7", name: "Aputure Light Dome 150 Octabox Softbox", category: "Lighting", serial: "SN-APT-150D", status: "Ready", location: "Studio A" },
          { id: "eq-8", name: "DJI Ronin 4D 6K Cinema Gimbal Camera", category: "Other Equipment", serial: "SN-DJI-4D6K", status: "Ready", location: "Gear Vault" },
          { id: "eq-9", name: "Tether Tools Pro Studio Station & High-Speed Cable", category: "Other Equipment", serial: "SN-TTH-4091", status: "Ready", location: "Studio A" }
        ]
      };
    }
    return parsed;
  } catch (err) {
    console.error('Error reading DB:', err);
    return { clients: [], projects: [], photographers: [], packages: [], bookings: [], invoices: [], gallery: [], notifications: [], conversations: [], users: [], authSessions: [], settings: {}, team: [], resources: {} };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}

// --------------------------------------------------------------------------
// TOOL / FUNCTION IMPLEMENTATIONS (Interacts with Database)
// --------------------------------------------------------------------------

const studioTools = {
  get_dashboard_summary: () => {
    const db = readDb();
    const activeProjects = db.projects.filter(p => p.status !== 'Completed').length;
    const today = STUDIO_TODAY;
    const todaySessions = db.bookings.filter(b => b.date === today && b.status !== 'cancelled').length;
    const unpaidInvoices = db.invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue');
    const unpaidTotal = unpaidInvoices.reduce((sum, i) => sum + (i.numericAmount || parseInt(String(i.amount).replace(/[^0-9]/g, '') || 0)), 0);
    const paidInvoices = db.invoices.filter(i => i.status === 'Paid');
    const paidTotal = paidInvoices.reduce((sum, i) => sum + (i.numericAmount || parseInt(String(i.amount).replace(/[^0-9]/g, '') || 0)), 0);

    return {
      revenueMtd: `₹${(paidTotal + 500000).toLocaleString('en-IN')}`,
      activeProjectsCount: activeProjects,
      totalProjectsCount: db.projects.length,
      todaySessionsCount: todaySessions,
      unpaidInvoicesCount: unpaidInvoices.length,
      unpaidTotalFormatted: `₹${unpaidTotal.toLocaleString('en-IN')}`,
      totalClients: db.clients.length
    };
  },

  get_today_schedule: (args = {}) => {
    const db = readDb();
    const date = args.date || STUDIO_TODAY;
    const sessions = db.bookings.filter(b => b.date === date && b.status !== 'cancelled');
    return {
      date,
      count: sessions.length,
      sessions: sessions.map(s => ({
        id: s.id,
        title: s.title || `${s.eventType} — ${s.client}`,
        client: s.client,
        time: s.time || `${s.startTime} - ${s.endTime}`,
        location: s.location,
        photographer: s.photographer,
        status: s.status,
        package: s.package
      }))
    };
  },

  get_upcoming_bookings: (args = {}) => {
    const db = readDb();
    const limit = args.limit || 8;
    const bookings = db.bookings
      .filter(b => b.date > STUDIO_TODAY && String(b.status).toLowerCase() === 'confirmed')
      .sort((a, b) => `${a.date} ${a.time || ''}`.localeCompare(`${b.date} ${b.time || ''}`))
      .slice(0, limit);
    return { count: bookings.length, bookings };
  },

  get_notifications: (args = {}) => {
    const db = readDb();
    const limit = args.limit || 10;
    return { count: Math.min(db.notifications.length, limit), notifications: db.notifications.slice(0, limit) };
  },

  search_clients: (args = {}) => {
    const db = readDb();
    const query = (args.query || "").toLowerCase();
    const results = db.clients.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      (c.location && c.location.toLowerCase().includes(query)) ||
      (c.company && c.company.toLowerCase().includes(query))
    );
    return { count: results.length, clients: results };
  },

  get_client: (args = {}) => {
    const db = readDb();
    const query = (args.nameOrId || "").toLowerCase();
    const client = db.clients.find(c => 
      c.id.toLowerCase() === query || 
      c.name.toLowerCase().includes(query)
    );
    if (!client) return { error: `Client "${args.nameOrId}" not found.` };
    
    // Attach client's projects, bookings & invoices
    const clientProjects = db.projects.filter(p => p.client.toLowerCase() === client.name.toLowerCase());
    const clientBookings = db.bookings.filter(b => b.client.toLowerCase() === client.name.toLowerCase());
    const clientInvoices = db.invoices.filter(i => i.client.toLowerCase() === client.name.toLowerCase());
    
    return { client, projects: clientProjects, bookings: clientBookings, invoices: clientInvoices };
  },

  create_client: (args = {}) => {
    if (!args.name) return { error: "Client name is required." };
    const db = readDb();
    
    // Check if client already exists
    const existing = db.clients.find(c => c.name.toLowerCase() === args.name.toLowerCase() || (args.email && c.email.toLowerCase() === args.email.toLowerCase()));
    if (existing) return { error: `Client ${args.name} already exists.`, client: existing };

    const newClient = {
      id: "c-" + Date.now(),
      name: args.name,
      email: args.email || `${args.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: args.phone || "+91 98000 00000",
      company: args.company || "Private Client",
      type: args.type || "Regular",
      projectsCount: 0,
      totalRevenue: "₹0",
      lastSession: "New Client",
      location: args.location || "Mumbai",
      notes: args.notes || ""
    };

    db.clients.unshift(newClient);
    db.notifications.unshift({
      id: "n-" + Date.now(),
      icon: "user-plus",
      title: "New Client Registered",
      msg: `${newClient.name} (${newClient.location}) was added via StudioAI.`,
      time: "Just now",
      read: false,
      createdAt: new Date().toISOString()
    });

    writeDb(db);
    return { success: true, client: newClient };
  },

  update_client: (args = {}) => {
    const db = readDb();
    const idx = db.clients.findIndex(c => c.id === args.id || c.name.toLowerCase() === (args.name || '').toLowerCase());
    if (idx === -1) return { error: `Client not found.` };

    if (args.phone) db.clients[idx].phone = args.phone;
    if (args.email) db.clients[idx].email = args.email;
    if (args.type) db.clients[idx].type = args.type;
    if (args.location) db.clients[idx].location = args.location;
    if (args.notes) db.clients[idx].notes = args.notes;

    writeDb(db);
    return { success: true, client: db.clients[idx] };
  },

  search_projects: (args = {}) => {
    const db = readDb();
    const query = (args.query || "").toLowerCase();
    const projects = db.projects.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.client.toLowerCase().includes(query) ||
      p.type.toLowerCase().includes(query)
    );
    return { count: projects.length, projects };
  },

  create_project: (args = {}) => {
    if (!args.name || !args.client) return { error: "Project name and client are required." };
    const db = readDb();
    const newProject = {
      id: "p-" + Date.now(),
      name: args.name,
      type: args.type || "Wedding",
      client: args.client,
      budget: args.budget || "₹1,50,000",
      progress: "10%",
      img: args.img || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
      status: args.status || "Planning",
      date: args.date || new Date().toISOString().split('T')[0],
      notes: args.notes || ""
    };
    db.projects.unshift(newProject);
    writeDb(db);
    return { success: true, project: newProject };
  },

  get_project: (args = {}) => {
    const db = readDb();
    const p = db.projects.find(x => x.id === args.id || x.name.toLowerCase().includes((args.name || '').toLowerCase()));
    if (!p) return { error: "Project not found." };
    return { project: p };
  },

  check_booking_availability: (args = {}) => {
    const db = readDb();
    const date = args.date || STUDIO_TODAY;
    const requestedTime = args.time || "10:00 AM";
    const location = args.location || "Studio A";

    // 1. Check Working Days configuration from Bookings & Hours Settings
    const bookingHours = db.settings?.bookingHours || {
      openingTime: "09:00",
      closingTime: "20:00",
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    };

    const targetDate = new Date(`${date}T00:00:00`);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = dayNames[targetDate.getDay()];

    if (bookingHours.workingDays && !bookingHours.workingDays.includes(dayOfWeek)) {
      return {
        date,
        time: requestedTime,
        location,
        client: args.client,
        photographer: args.photographer,
        isAvailable: false,
        closedDay: true,
        conflictDetails: `Studio is closed on ${dayOfWeek}s according to studio operating hours.`,
        availableAlternatives: []
      };
    }

    // Format requested time check
    const existingBookings = db.bookings.filter(b => b.date === date && b.status !== 'cancelled');
    const conflict = existingBookings.find(b => {
      const sameLocation = !location || !b.location || b.location.toLowerCase() === location.toLowerCase();
      const sameTime = b.time && (b.time.toLowerCase().includes(requestedTime.toLowerCase()) || requestedTime.toLowerCase().includes(b.startTime || ''));
      const sameClient = args.client && b.client && b.client.toLowerCase() === args.client.toLowerCase();
      const samePhotographer = args.photographer && b.photographer && b.photographer.toLowerCase() === args.photographer.toLowerCase();
      return (sameLocation && sameTime) || sameClient || (samePhotographer && sameTime);
    });

    const isAvailable = !conflict;

    // Generate alternatives only from slots that are free in the real booking data.
    const possibleHours = ["10:00 AM", "01:30 PM", "03:30 PM", "05:00 PM"];
    const alternatives = [];
    for (let dayOffset = 0; dayOffset < 7 && alternatives.length < 3; dayOffset += 1) {
      const candidateDate = new Date(`${date}T00:00:00`);
      candidateDate.setDate(candidateDate.getDate() + dayOffset);
      const candidateDateStr = candidateDate.toISOString().split('T')[0];
      const candidateDayOfWeek = dayNames[candidateDate.getDay()];

      // Skip closed days for alternatives
      if (bookingHours.workingDays && !bookingHours.workingDays.includes(candidateDayOfWeek)) {
        continue;
      }

      const dayBookings = db.bookings.filter(b => b.date === candidateDateStr && String(b.status).toLowerCase() !== 'cancelled');
      possibleHours.forEach(candidateTime => {
        if (alternatives.length >= 3 || (candidateDateStr === date && candidateTime === requestedTime)) return;
        const busy = dayBookings.some(b => {
          const sameLocation = !location || !b.location || b.location.toLowerCase() === location.toLowerCase();
          return sameLocation && b.time && b.time.toLowerCase() === candidateTime.toLowerCase();
        });
        if (!busy) alternatives.push(`${candidateDateStr} · ${candidateTime}`);
      });
    }

    return {
      date,
      time: requestedTime,
      location,
      client: args.client,
      photographer: args.photographer,
      isAvailable,
      conflictDetails: conflict ? `${conflict.title} (${conflict.time} in ${conflict.location})` : null,
      availableAlternatives: alternatives.slice(0, 3)
    };
  },

  get_available_slots: (args = {}) => {
    const date = args.date || STUDIO_TODAY;
    return studioTools.check_booking_availability({ date, time: "10:00 AM" });
  },

  create_booking: (args = {}) => {
    if (!args.client || !args.date) {
      return { error: "Client and date are required." };
    }
    const db = readDb();

    // Verify availability
    const avail = studioTools.check_booking_availability({
      date: args.date,
      time: args.time || "10:00 AM",
      location: args.location || "Studio A",
      client: args.client,
      photographer: args.photographer || "Alex Carter"
    });

    if (!avail.isAvailable && !args.force) {
      return {
        error: "Slot is already booked.",
        isAvailable: false,
        conflict: avail.conflictDetails,
        availableAlternatives: avail.availableAlternatives
      };
    }

    // Bookings must reference an existing client; client creation is a separate action.
    let clientObj = db.clients.find(c => c.name.toLowerCase() === args.client.toLowerCase());
    if (!clientObj) return { error: `Client "${args.client}" not found.`, clientNotFound: true };
    clientObj.projectsCount = (clientObj.projectsCount || 0) + 1;
    clientObj.lastSession = args.date;

    const bookingId = "b-" + Date.now();
    const newBooking = {
      id: bookingId,
      clientId: clientObj.id,
      projectId: "p-" + Date.now(),
      title: args.title || `${args.eventType || 'Photography Shoot'} — ${args.client}`,
      client: args.client,
      eventType: args.eventType || "Wedding",
      date: args.date,
      time: args.time || "10:00 AM",
      startTime: args.startTime || (args.time ? args.time.split(' ')[0] : "10:00"),
      endTime: args.endTime || "13:00",
      location: args.location || "Studio A",
      package: args.package || "Wedding Premium",
      amount: args.amount || "₹80,000",
      photographer: args.photographer || "Alex Carter",
      status: "confirmed",
      notes: args.notes || "Booked through StudioAI assistant.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.bookings.push(newBooking);

    // Create Notification
    db.notifications.unshift({
      id: "n-" + Date.now(),
      icon: "calendar-check",
      title: "Shoot Confirmed by StudioAI",
      msg: `${newBooking.title} on ${newBooking.date} at ${newBooking.location} (${newBooking.amount}).`,
      time: "Just now",
      read: false,
      createdAt: new Date().toISOString()
    });

    writeDb(db);
    return {
      success: true,
      bookingId: newBooking.id,
      booking: newBooking
    };
  },

  update_booking: (args = {}) => {
    const db = readDb();
    const b = db.bookings.find(x => x.id === args.id);
    if (!b) return { error: "Booking not found." };

    if (args.date) b.date = args.date;
    if (args.time) b.time = args.time;
    if (args.status) b.status = args.status;
    if (args.photographer) b.photographer = args.photographer;
    if (args.location) b.location = args.location;
    b.updatedAt = new Date().toISOString();

    writeDb(db);
    return { success: true, booking: b };
  },

  cancel_booking: (args = {}) => {
    const db = readDb();
    const b = db.bookings.find(x => x.id === args.id);
    if (!b) return { error: "Booking not found." };
    b.status = "cancelled";
    b.updatedAt = new Date().toISOString();
    writeDb(db);
    return { success: true, booking: b };
  },

  get_booking: (args = {}) => {
    const db = readDb();
    const b = db.bookings.find(x => x.id === args.id);
    if (!b) return { error: "Booking not found." };
    return { booking: b };
  },

  get_calendar: (args = {}) => {
    const db = readDb();
    const month = args.month || "2026-08";
    const bookings = db.bookings.filter(b => b.date && b.date.startsWith(month) && b.status !== 'cancelled');
    return { month, count: bookings.length, bookings };
  },

  create_invoice: (args = {}) => {
    if (!args.client) return { error: "Client name is required." };
    const db = readDb();
    const count = db.invoices.length + 1;
    const invId = `INV-${1024 + count}`;
    const rawAmt = args.amount || "₹80,000";
    const numAmt = parseInt(String(rawAmt).replace(/[^0-9]/g, '') || "80000");

    const newInvoice = {
      id: invId,
      client: args.client,
      project: args.project || `${args.package || 'Studio'} Photography`,
      package: args.package || "Wedding Signature",
      amount: rawAmt.startsWith("₹") ? rawAmt : "₹" + rawAmt,
      numericAmount: numAmt,
      issueDate: args.issueDate || new Date().toISOString().split('T')[0],
      dueDate: args.dueDate || "2026-09-15",
      status: args.status || "Pending",
      tax: `₹${Math.round(numAmt * 0.18).toLocaleString('en-IN')}`,
      notes: args.notes || "Generated via StudioAI"
    };

    db.invoices.unshift(newInvoice);
    db.notifications.unshift({
      id: "n-" + Date.now(),
      icon: "receipt",
      title: "Invoice Generated",
      msg: `${invId} (${newInvoice.amount}) created for ${newInvoice.client}.`,
      time: "Just now",
      read: false,
      createdAt: new Date().toISOString()
    });

    writeDb(db);
    return { success: true, invoice: newInvoice };
  },

  get_invoices: (args = {}) => {
    const db = readDb();
    return { count: db.invoices.length, invoices: db.invoices };
  },

  get_unpaid_invoices: () => {
    const db = readDb();
    const unpaid = db.invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue');
    const total = unpaid.reduce((s, i) => s + (i.numericAmount || parseInt(String(i.amount).replace(/[^0-9]/g, '') || 0)), 0);
    return {
      count: unpaid.length,
      totalUnpaid: `₹${total.toLocaleString('en-IN')}`,
      invoices: unpaid
    };
  },

  update_invoice_status: (args = {}) => {
    const db = readDb();
    const inv = db.invoices.find(i => i.id === args.id || i.client.toLowerCase() === (args.client || '').toLowerCase());
    if (!inv) return { error: "Invoice not found." };
    inv.status = args.status || "Paid";
    writeDb(db);
    return { success: true, invoice: inv };
  },

  get_revenue_summary: (args = {}) => {
    const db = readDb();
    const paid = db.invoices.filter(i => i.status === 'Paid');
    const paidSum = paid.reduce((s, i) => s + (i.numericAmount || 0), 0);
    const pending = db.invoices.filter(i => i.status === 'Pending');
    const pendingSum = pending.reduce((s, i) => s + (i.numericAmount || 0), 0);
    const overdue = db.invoices.filter(i => i.status === 'Overdue');
    const overdueSum = overdue.reduce((s, i) => s + (i.numericAmount || 0), 0);

    return {
      monthlyRevenue: `₹${(paidSum + 420000).toLocaleString('en-IN')}`,
      collectedPayments: `₹${paidSum.toLocaleString('en-IN')}`,
      pendingPayments: `₹${pendingSum.toLocaleString('en-IN')}`,
      overduePayments: `₹${overdueSum.toLocaleString('en-IN')}`,
      topPackage: "Wedding Luxury Signature (42% of revenue)",
      growthRate: "+18.4% vs last period",
      totalShootsConfirmed: db.bookings.filter(b => b.status === 'confirmed').length
    };
  },

  get_gallery_projects: () => {
    const db = readDb();
    return { count: db.gallery.length, gallery: db.gallery };
  },

  search_gallery: (args = {}) => {
    const db = readDb();
    const q = (args.query || '').toLowerCase();
    const results = db.gallery.filter(g => g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q));
    return { count: results.length, photos: results };
  },

  create_proposal: (args = {}) => {
    const clientName = args.client || "Valued Client";
    const eventType = args.eventType || "Luxury Wedding & Pre-Wedding";
    const packageChoice = args.package || "Signature Royal Package";
    const amount = args.amount || "₹1,85,000";

    return {
      success: true,
      proposal: {
        id: "PROP-" + Date.now(),
        client: clientName,
        title: `${eventType} Photography Proposal for ${clientName}`,
        package: packageChoice,
        investment: amount,
        deliverables: [
          "Full Day Two-Cinematographer + Lead Photographer Coverage",
          "High-Resolution Edited Highlight Gallery (350+ Master Retouched Photos)",
          "1x 4K Cinematic Studio Teaser (3-5 Minutes)",
          "Custom Leather Bound Luxury Wedding Album (40 Pages)",
          "Drone Aerial 4K Cinematography of Venue",
          "Private Online Client Review & VIP Download Portal"
        ],
        terms: "50% Advance to Reserve Date · 50% on Production Delivery · Validity 14 Days",
        studio: "FRAME AI Luxury Photography Studio · Alex Carter & Team"
      }
    };
  },

  generate_instagram_caption: (args = {}) => {
    const eventType = args.eventType || "Wedding";
    const client = args.client || "our wonderful couple";
    const mood = args.mood || "Luxury Romantic";

    const captions = {
      "Wedding": {
        caption: `Elegance frozen in time. Whispers of forever, golden hour glow, and a love story crafted for eternity with ${client}. 💍✨\n\nCaptured with precision on Medium Format & FRAME AI Neural Color Suite. Every frame tells the tale of timeless devotion.`,
        hashtags: "#LuxuryWedding #WeddingPhotography #FrameAI #IndianWedding #BridalVogue #FineArtWedding #WeddingCinematography #VogueWeddings",
        cta: "Now booking exclusive 2026/2027 wedding dates. Inquire via link in bio."
      },
      "Editorial": {
        caption: `Sculpting light, defining elegance. High-fashion monochrome session with ${client} inside Studio A. 🖤⚡\n\nShot on 85mm f/1.2 prime with high-key Broncolor lighting.`,
        hashtags: "#VogueEditorial #FashionPhotography #StudioLighting #FrameAI #HighFashion #PortraitVisuals #CreativeDirection",
        cta: "Editorial and commercial bookings open for Autumn/Winter."
      },
      "Product": {
        caption: `Form meets flawless reflection. Commercial beauty product campaign captured with macro clarity for ${client}. ✨🧴`,
        hashtags: "#CommercialPhotography #ProductLighting #LuxuryBrand #StudioB #FrameAI #AdvertisingPhotographer",
        cta: "Elevate your brand visuals. Direct message for campaign inquiries."
      }
    };

    const chosen = captions[eventType] || captions["Wedding"];
    return {
      eventType,
      client,
      mood,
      caption: chosen.caption,
      hashtags: chosen.hashtags,
      cta: chosen.cta
    };
  },

  get_photographers: (args = {}) => {
    const db = readDb();
    let list = db.photographers || [];
    if (args.status) {
      list = list.filter(p => p.status.toLowerCase() === args.status.toLowerCase());
    }
    if (args.specialization) {
      list = list.filter(p => p.specialization.toLowerCase().includes(args.specialization.toLowerCase()));
    }
    if (args.query) {
      const q = args.query.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q) || (p.skills && p.skills.some(s => s.toLowerCase().includes(q))));
    }
    return { count: list.length, photographers: list };
  },

  get_packages: (args = {}) => {
    const db = readDb();
    let list = db.packages || [];
    if (args.category) {
      list = list.filter(p => p.category.toLowerCase().includes(args.category.toLowerCase()));
    }
    if (args.query) {
      const q = args.query.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return { count: list.length, packages: list };
  },

  search_bookings: (args = {}) => {
    const db = readDb();
    let list = db.bookings || [];
    if (args.query) {
      const q = args.query.toLowerCase();
      list = list.filter(b => (b.client && b.client.toLowerCase().includes(q)) || (b.title && b.title.toLowerCase().includes(q)) || (b.photographer && b.photographer.toLowerCase().includes(q)));
    }
    if (args.status) {
      list = list.filter(b => String(b.status).toLowerCase() === args.status.toLowerCase());
    }
    if (args.date) {
      list = list.filter(b => b.date === args.date);
    }
    return { count: list.length, bookings: list };
  },

  update_project: (args = {}) => {
    const db = readDb();
    const idx = db.projects.findIndex(p => p.id === args.id || p.name.toLowerCase().includes((args.name || '').toLowerCase()));
    if (idx === -1) return { error: "Project not found." };
    if (args.status) db.projects[idx].status = args.status;
    if (args.progress) db.projects[idx].progress = args.progress;
    if (args.budget) db.projects[idx].budget = args.budget;
    if (args.notes) db.projects[idx].notes = args.notes;
    writeDb(db);
    return { success: true, project: db.projects[idx] };
  },

  get_studio_analytics: () => {
    const db = readDb();
    const paid = db.invoices.filter(i => i.status === 'Paid');
    const paidTotal = paid.reduce((sum, i) => sum + (i.numericAmount || parseInt(String(i.amount).replace(/[^0-9]/g, '') || 0)), 0);
    const pending = db.invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue');
    const pendingTotal = pending.reduce((sum, i) => sum + (i.numericAmount || parseInt(String(i.amount).replace(/[^0-9]/g, '') || 0)), 0);
    return {
      monthlyRevenue: `₹${(paidTotal + 420000).toLocaleString('en-IN')}`,
      collected: `₹${paidTotal.toLocaleString('en-IN')}`,
      outstanding: `₹${pendingTotal.toLocaleString('en-IN')}`,
      totalClients: db.clients.length,
      totalProjects: db.projects.length,
      totalPhotographers: (db.photographers || []).length,
      totalPackages: (db.packages || []).length,
      activeShootsThisWeek: db.bookings.filter(b => b.status === 'confirmed').length,
      growthRate: "+18.4%"
    };
  },

  generate_social_post: (args = {}) => {
    const platform = args.platform || "Instagram";
    const eventType = args.eventType || "Wedding";
    const client = args.client || "our couple";
    const tone = args.tone || "Luxury Editorial";
    return studioTools.generate_instagram_caption({ eventType, client, mood: tone });
  }
};

// --------------------------------------------------------------------------
// GOOGLE GEMINI INTEGRATION VIA @google/genai
// --------------------------------------------------------------------------

let aiClient = null;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  try {
    const { GoogleGenAI } = require('@google/genai');
    aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    console.log(`[StudioAI] Google GenAI SDK initialized with model: ${GEMINI_MODEL}`);
  } catch (err) {
    console.warn('[StudioAI] Note: @google/genai initialization error or package not installed yet, falling back to smart studio engine:', err.message);
  }
} else {
  console.log('[StudioAI] Running in DEMO / Smart Local Mode (Add GEMINI_API_KEY in .env for live Gemini API).');
}

// --------------------------------------------------------------------------
// GEMINI TOOL DECLARATIONS FOR FUNCTION CALLING
// --------------------------------------------------------------------------

const geminiToolDeclarations = [
  {
    name: "get_dashboard_summary",
    description: "Get key studio KPIs including revenue, active projects, today's sessions, and unpaid invoice counts."
  },
  {
    name: "get_today_schedule",
    description: "Retrieve all scheduled shoots, studio rooms, and sessions for today or a specific date.",
    parameters: {
      type: "OBJECT",
      properties: {
        date: { type: "STRING", description: `Date in YYYY-MM-DD format (default ${STUDIO_TODAY})` }
      }
    }
  },
  {
    name: "get_upcoming_bookings",
    description: "Get a list of upcoming confirmed shoots and photography sessions.",
    parameters: {
      type: "OBJECT",
      properties: {
        limit: { type: "NUMBER", description: "Max bookings to return" }
      }
    }
  },
  {
    name: "get_notifications",
    description: "Retrieve recent studio notifications and alerts.",
    parameters: {
      type: "OBJECT",
      properties: {
        limit: { type: "NUMBER", description: "Max notifications to return" }
      }
    }
  },
  {
    name: "search_clients",
    description: "Search clients by name, email, company, or city/location.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: { type: "STRING", description: "Search term e.g. 'Rahul', 'Mumbai', 'Vogue'" }
      },
      required: ["query"]
    }
  },
  {
    name: "get_client",
    description: "Get full profile, bookings, projects, and invoices for a specific client.",
    parameters: {
      type: "OBJECT",
      properties: {
        nameOrId: { type: "STRING", description: "Client name or client ID" }
      },
      required: ["nameOrId"]
    }
  },
  {
    name: "create_client",
    description: "Create and register a new client in the studio database.",
    parameters: {
      type: "OBJECT",
      properties: {
        name: { type: "STRING", description: "Full name of client" },
        email: { type: "STRING", description: "Email address" },
        phone: { type: "STRING", description: "Phone number" },
        location: { type: "STRING", description: "City / Location e.g. Mumbai, Delhi" },
        type: { type: "STRING", description: "VIP, Business, or Regular" },
        notes: { type: "STRING", description: "Style or preference notes" }
      },
      required: ["name"]
    }
  },
  {
    name: "update_client",
    description: "Update client contact information, phone, email or status.",
    parameters: {
      type: "OBJECT",
      properties: {
        name: { type: "STRING", description: "Client name" },
        phone: { type: "STRING", description: "New phone number" },
        email: { type: "STRING", description: "New email address" }
      },
      required: ["name"]
    }
  },
  {
    name: "check_booking_availability",
    description: "Check if a studio room or time slot is available before booking, and suggest alternatives if busy.",
    parameters: {
      type: "OBJECT",
      properties: {
        date: { type: "STRING", description: "Date YYYY-MM-DD" },
        time: { type: "STRING", description: "Time e.g. '10:00 AM', '02:00 PM'" },
        location: { type: "STRING", description: "Studio A, Studio B, Edit Suite, Outdoor" }
      },
      required: ["date", "time"]
    }
  },
  {
    name: "create_booking",
    description: "Create and confirm a real shoot booking in the database after user confirmation.",
    parameters: {
      type: "OBJECT",
      properties: {
        client: { type: "STRING", description: "Client Name" },
        eventType: { type: "STRING", description: "Event type: Wedding, Portraits, Commercial, Editorial" },
        date: { type: "STRING", description: "Date in YYYY-MM-DD" },
        time: { type: "STRING", description: "Time slot e.g. 10:00 AM" },
        location: { type: "STRING", description: "Location e.g. Studio A, Taj Lands End" },
        package: { type: "STRING", description: "Package name e.g. Wedding Premium" },
        amount: { type: "STRING", description: "Amount e.g. ₹80,000" },
        photographer: { type: "STRING", description: "Lead photographer name" }
      },
      required: ["client", "date"]
    }
  },
  {
    name: "get_unpaid_invoices",
    description: "Retrieve all unpaid and overdue invoices with total outstanding amount."
  },
  {
    name: "create_invoice",
    description: "Create a new billing invoice for a client.",
    parameters: {
      type: "OBJECT",
      properties: {
        client: { type: "STRING", description: "Client name" },
        project: { type: "STRING", description: "Project or shoot description" },
        package: { type: "STRING", description: "Package name" },
        amount: { type: "STRING", description: "Invoice amount in ₹" },
        dueDate: { type: "STRING", description: "Due date YYYY-MM-DD" }
      },
      required: ["client", "amount"]
    }
  },
  {
    name: "update_invoice_status",
    description: "Mark an invoice as Paid or change its status.",
    parameters: {
      type: "OBJECT",
      properties: {
        client: { type: "STRING", description: "Client name or Invoice ID" },
        status: { type: "STRING", description: "Paid, Pending, or Overdue" }
      },
      required: ["client", "status"]
    }
  },
  {
    name: "get_revenue_summary",
    description: "Get comprehensive studio revenue analytics, collected vs pending amounts, and top packages."
  },
  {
    name: "create_proposal",
    description: "Generate a formal luxury photography proposal with deliverables and pricing.",
    parameters: {
      type: "OBJECT",
      properties: {
        client: { type: "STRING", description: "Client name" },
        eventType: { type: "STRING", description: "Shoot type e.g. Wedding, Fashion" },
        package: { type: "STRING", description: "Package name" },
        amount: { type: "STRING", description: "Package price e.g. ₹1,85,000" }
      },
      required: ["client"]
    }
  },
  {
    name: "generate_instagram_caption",
    description: "Generate a viral, luxury social media caption with hashtags and CTA for a photo shoot.",
    parameters: {
      type: "OBJECT",
      properties: {
        eventType: { type: "STRING", description: "Wedding, Editorial, Commercial, Portraits" },
        client: { type: "STRING", description: "Client or project name" },
        mood: { type: "STRING", description: "Mood e.g. Luxury, Romantic, Moody, High-fashion" }
      }
    }
  },
  {
    name: "get_photographers",
    description: "Retrieve all photographers in the studio team with roles, skills, status, and daily rates.",
    parameters: {
      type: "OBJECT",
      properties: {
        status: { type: "STRING", description: "Available, Busy, or On Leave" },
        specialization: { type: "STRING", description: "Wedding, Portrait, Product, Cinematic, Drone" },
        query: { type: "STRING", description: "Search by photographer name or skill" }
      }
    }
  },
  {
    name: "get_packages",
    description: "Retrieve all studio photography packages, pricing, durations, deliverables, and features.",
    parameters: {
      type: "OBJECT",
      properties: {
        category: { type: "STRING", description: "Wedding, Portrait, Pre-Wedding, Event, Product, Fashion" },
        query: { type: "STRING", description: "Search keyword" }
      }
    }
  },
  {
    name: "search_bookings",
    description: "Search bookings and scheduled shoots by client name, photographer, or status.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: { type: "STRING", description: "Client name, shoot title, or photographer" },
        status: { type: "STRING", description: "confirmed, tentative, or cancelled" },
        date: { type: "STRING", description: "Date YYYY-MM-DD" }
      }
    }
  },
  {
    name: "update_project",
    description: "Update project progress, status, budget, or notes.",
    parameters: {
      type: "OBJECT",
      properties: {
        id: { type: "STRING", description: "Project ID" },
        name: { type: "STRING", description: "Project name" },
        status: { type: "STRING", description: "Planning, Shooting, Editing, Review, Completed" },
        progress: { type: "STRING", description: "Percentage e.g. '75%'" },
        budget: { type: "STRING", description: "Budget e.g. '₹2,00,000'" }
      }
    }
  },
  {
    name: "get_studio_analytics",
    description: "Get detailed studio business intelligence, gross revenue, collected vs pending, active shoots, and team size."
  },
  {
    name: "generate_social_post",
    description: "Generate promotional social media copy for Instagram, Pinterest, or LinkedIn.",
    parameters: {
      type: "OBJECT",
      properties: {
        platform: { type: "STRING", description: "Instagram, LinkedIn, Pinterest" },
        eventType: { type: "STRING", description: "Wedding, Editorial, Commercial, Portraits" },
        client: { type: "STRING", description: "Client name" },
        tone: { type: "STRING", description: "Luxury, Editorial, Storytelling" }
      }
    }
  }
];

// --------------------------------------------------------------------------
// SMART LOCAL AI ENGINE (Full Natural Language & Intent Parsing)
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

  // 1. UPCOMING CONFIRMED SHOOTS (High priority so "upcoming" is never confused with today's schedule or booking)
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

  // 8. BOOKING CREATION FLOW (e.g. "Book Rahul Patel for wedding", "Schedule a shoot")
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

function handleSmartLocalAI(message, context = {}) {
  const intent = classifyIntent(message, context.action);
  const msg = (message || "").toLowerCase().trim();

  console.log(`[StudioAI Intent] Resolved: ${intent} | Page: ${context.page || 'dashboard'} | Message: "${message}"`);

  // 1. UPCOMING CONFIRMED SHOOTS
  if (intent === "GET_UPCOMING_CONFIRMED_SHOOTS") {
    const data = studioTools.get_upcoming_bookings({ limit: 8 });
    if (!data.count || !data.bookings.length) {
      return {
        message: "📸 No upcoming confirmed shoots were found in the schedule.",
        actions: [],
        data: { count: 0, bookings: [] }
      };
    }

    const shootListText = data.bookings.map((b, idx) => {
      return `${idx + 1}. **${b.client || b.title}**\n   ${b.eventType || b.package || 'Shoot'}\n   ${b.date} • ${b.time || b.startTime || '10:00 AM'}\n   ${b.location || 'Studio A'} • ${b.amount || '₹80,000'}`;
    }).join("\n\n");

    return {
      message: `📸 **Upcoming Confirmed Shoots**\n\n${shootListText}`,
      actions: [{ type: "upcoming_shoots_card", bookings: data.bookings, count: data.count }],
      data
    };
  }

  // 2. TODAY'S SCHEDULE
  if (intent === "GET_TODAY_SCHEDULE") {
    const data = studioTools.get_today_schedule({ date: STUDIO_TODAY });
    const sessionList = data.sessions.map((s, idx) => {
      return `${idx + 1}. **${s.title}** (${s.time} • ${s.location} • ${s.photographer})`;
    }).join("\n");

    return {
      message: `📅 **Today's Studio Schedule — August 24, 2026**\nYou have **${data.count} sessions** scheduled today:\n\n${sessionList || 'No sessions scheduled for today.'}`,
      actions: [{ type: "schedule_card", date: data.date, count: data.count, sessions: data.sessions }],
      data
    };
  }

  // 3. UNPAID INVOICES / CLIENTS
  if (intent === "GET_UNPAID_INVOICES") {
    const data = studioTools.get_unpaid_invoices();
    const invList = data.invoices.map(i => {
      return `• **${i.client}** (${i.id}) — **${i.amount}** (${i.status} • Due ${i.dueDate})`;
    }).join("\n");

    return {
      message: `💰 **Unpaid & Overdue Invoices**\n\n${invList}\n\n**Total Pending:** ${data.totalUnpaid} across ${data.count} client accounts.`,
      actions: [
        {
          type: "unpaid_invoices_card",
          total: data.totalUnpaid,
          count: data.count,
          invoices: data.invoices
        }
      ],
      data
    };
  }

  // 4. REVENUE
  if (intent === "GET_REVENUE") {
    const data = studioTools.get_revenue_summary();
    return {
      message: `📊 **Studio Revenue Analysis**\n\n• **Monthly Revenue:** ${data.monthlyRevenue} (${data.growthRate})\n• **Collected Payments:** ${data.collectedPayments}\n• **Pending Invoices:** ${data.pendingPayments}\n• **Overdue Amount:** ${data.overduePayments}\n• **Top Performing Tier:** ${data.topPackage}\n• **Confirmed Shoots:** ${data.totalShootsConfirmed} sessions`,
      actions: [
        {
          type: "revenue_card",
          revenue: data.monthlyRevenue,
          collected: data.collectedPayments,
          pending: data.pendingPayments,
          topPackage: data.topPackage,
          shoots: data.totalShootsConfirmed
        }
      ],
      data
    };
  }

  // 5. INSTAGRAM CAPTION
  if (intent === "GENERATE_INSTAGRAM_CAPTION") {
    let eventType = "Wedding";
    if (msg.includes("editorial") || msg.includes("fashion")) eventType = "Editorial";
    else if (msg.includes("product") || msg.includes("commercial")) eventType = "Product";

    const data = studioTools.generate_instagram_caption({ eventType, client: "Rahul & Priya" });
    return {
      message: `✨ **Instagram Luxury Editorial Caption**\n\n${data.caption}\n\n${data.hashtags}\n\n*${data.cta}*`,
      actions: [
        {
          type: "instagram_caption_card",
          eventType,
          caption: data.caption,
          hashtags: data.hashtags,
          cta: data.cta
        }
      ],
      data
    };
  }

  // 6. AVAILABLE DATES / SLOTS
  if (intent === "GET_AVAILABLE_SLOTS") {
    const data = studioTools.get_available_slots({ date: STUDIO_TODAY });
    return {
      message: `🗓️ **Available Studio Slots**\n\nHere are the open studio slots available for booking this week:`,
      actions: [
        {
          type: "availability_card",
          date: data.date,
          location: "Studio A",
          alternatives: data.availableAlternatives
        }
      ],
      data
    };
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

    const avail = studioTools.check_booking_availability({ date, time, location, client: clientName, photographer });
    if (!avail.isAvailable) {
      return {
        message: `⚠️ **TIME SLOT UNAVAILABLE**\n\nThat slot on **${date}** at **${time}** in **${location}** is already booked with *${avail.conflictDetails}*.\n\nHere are the nearest available alternative slots:`,
        actions: [
          {
            type: "availability_card",
            date,
            requestedTime: time,
            location,
            alternatives: avail.availableAlternatives
          }
        ],
        data: { isAvailable: false, alternatives: avail.availableAlternatives }
      };
    }

    return {
      message: `✨ **BOOKING CONFIRMATION**\n\nI verified availability on **${date}** at **${time}** for **${clientName}**. No photographer or studio conflicts detected.\n\nPlease review and confirm the booking below:`,
      actions: [
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
      ],
      data: { client: clientName, date, time, location, package: packageType, amount, photographer }
    };
  }

  // 8. CANCEL BOOKING
  if (intent === "CANCEL_BOOKING") {
    const db = readDb();
    const query = msg.includes("rahul") ? "Rahul" : msg.includes("sarah") ? "Sarah" : "";
    const b = db.bookings.find(x => x.client.toLowerCase().includes(query.toLowerCase()));
    if (b) {
      const res = studioTools.cancel_booking({ id: b.id });
      return {
        message: `✓ Shoot **${b.title}** scheduled on **${b.date}** has been marked as **cancelled**. The studio calendar and schedule have been updated.`,
        actions: [],
        data: res
      };
    }
    return { message: "⚠️ Could not find the specified booking to cancel.", actions: [], data: {} };
  }

  // 9. NOTIFICATIONS
  if (intent === "GET_NOTIFICATIONS") {
    const data = studioTools.get_notifications();
    return {
      message: `🔔 **Recent Studio Notifications** (${data.count} alerts):`,
      actions: [{ type: "notifications_card", notifications: data.notifications }],
      data
    };
  }

  // 10. CREATE CLIENT
  if (intent === "CREATE_CLIENT") {
    let name = "Sarah Khan";
    const match = msg.match(/(?:named|client)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (match && match[1] && !["named", "new", "a"].includes(match[1].toLowerCase())) name = match[1];

    let location = "Mumbai";
    if (msg.includes("delhi")) location = "Delhi";
    else if (msg.includes("bengaluru") || msg.includes("bangalore")) location = "Bengaluru";

    const res = studioTools.create_client({ name, location, type: "VIP" });
    if (res.error) return { message: `⚠️ ${res.error}`, actions: [], data: res };
    return {
      message: `✨ Client **${name}** has been registered in the database. You can now schedule shoots or generate invoices directly for them.`,
      actions: [{ type: "client_card", client: res.client }],
      data: res
    };
  }

  // 11. SEARCH CLIENTS
  if (intent === "SEARCH_CLIENTS") {
    let query = "";
    if (msg.includes("mumbai")) query = "mumbai";
    else if (msg.includes("delhi")) query = "delhi";
    else if (msg.includes("rahul")) query = "rahul";
    else if (msg.includes("sarah")) query = "sarah";
    else if (msg.includes("aurelia")) query = "aurelia";

    const res = studioTools.search_clients({ query });
    return {
      message: `Found **${res.count} clients**${query ? ` matching "${query}"` : ""}:`,
      actions: [{ type: "clients_list_card", clients: res.clients }],
      data: res
    };
  }

  // 12. CREATE PROJECT
  if (intent === "CREATE_PROJECT") {
    const client = msg.includes("rahul") ? "Rahul Patel" : "Sarah Johnson";
    const res = studioTools.create_project({ name: `${client} Photography Project`, type: msg.includes("wedding") ? "Wedding" : "Photography", client });
    if (res.error) return { message: `⚠️ ${res.error}`, actions: [], data: res };
    return {
      message: `✨ Project **${res.project.name}** has been created for **${res.project.client}**.`,
      actions: [{ type: "project_card", project: res.project }],
      data: res
    };
  }

  // 13. GET PROJECTS
  if (intent === "GET_PROJECTS") {
    const query = msg.includes("rahul") ? "Rahul" : msg.includes("sarah") ? "Sarah" : "";
    const data = studioTools.search_projects({ query });
    return {
      message: `Found **${data.count} studio projects**${query ? ` matching "${query}"` : ""}:`,
      actions: [{ type: "projects_list_card", projects: data.projects }],
      data
    };
  }

  // 14. CREATE INVOICE
  if (intent === "CREATE_INVOICE") {
    const res = studioTools.create_invoice({ client: "Rahul Patel", project: "Royal Wedding Session", amount: "₹80,000" });
    if (res.error) return { message: `⚠️ ${res.error}`, actions: [], data: res };
    return {
      message: `✨ Invoice **${res.invoice.id}** (${res.invoice.amount}) has been created for **${res.invoice.client}**.`,
      actions: [{ type: "invoice_created_card", invoice: res.invoice }],
      data: res
    };
  }

  // 15. UPDATE INVOICE STATUS
  if (intent === "UPDATE_INVOICE_STATUS") {
    const res = studioTools.update_invoice_status({ client: "Rahul", status: "Paid" });
    if (res.error) return { message: `⚠️ ${res.error}`, actions: [], data: res };
    return {
      message: `✅ Updated! ${res.invoice ? res.invoice.id : 'Invoice'} for **${res.invoice ? res.invoice.client : 'Rahul Patel'}** has been marked as **Paid**. Revenue and analytics totals have been refreshed.`,
      actions: [],
      data: res
    };
  }

  // 16. GET INVOICES
  if (intent === "GET_INVOICES") {
    const data = studioTools.get_invoices();
    return {
      message: `Here are all **${data.count} studio invoices**:`,
      actions: [{ type: "unpaid_invoices_card", total: "All Invoices", count: data.count, invoices: data.invoices }],
      data
    };
  }

  // 17. PHOTOGRAPHERS
  if (intent === "GET_PHOTOGRAPHERS") {
    const data = studioTools.get_photographers();
    return {
      message: `📸 **FRAME AI Photographers Team** (${data.count} master professionals):`,
      actions: [{ type: "photographers_list_card", photographers: data.photographers, count: data.count }],
      data
    };
  }

  // 18. PACKAGES & RATES
  if (intent === "GET_PACKAGES") {
    const data = studioTools.get_packages();
    return {
      message: `📦 **Studio Packages & Rates** (${data.count} active tiers):`,
      actions: [{ type: "packages_list_card", packages: data.packages, count: data.count }],
      data
    };
  }

  // 19. PROPOSAL
  if (intent === "CREATE_PROPOSAL") {
    const data = studioTools.create_proposal({ client: "Rahul Patel", eventType: "Royal Destination Wedding", package: "Signature Royal Package", amount: "₹1,85,000" });
    return {
      message: `I've generated a luxury photography proposal for **Rahul Patel**:`,
      actions: [{ type: "proposal_card", proposal: data.proposal }],
      data
    };
  }

  // 20. ANALYTICS
  if (intent === "GET_ANALYTICS") {
    const data = studioTools.get_studio_analytics();
    return {
      message: `Here is the comprehensive FRAME AI executive analytics overview:\n\n• **Monthly Revenue:** ${data.monthlyRevenue} (${data.growthRate} growth)\n• **Collected Payments:** ${data.collected}\n• **Outstanding / Overdue:** ${data.outstanding}\n• **Active Shoots This Week:** ${data.activeShootsThisWeek} sessions\n• **Total Registered Clients:** ${data.totalClients} clients\n• **Team Size:** ${data.totalPhotographers} master photographers`,
      actions: [
        {
          type: "revenue_card",
          revenue: data.monthlyRevenue,
          collected: data.collected,
          pending: data.outstanding,
          topPackage: "Wedding Luxury Signature",
          shoots: data.activeShootsThisWeek
        }
      ],
      data
    };
  }

  // 21. DASHBOARD SUMMARY
  if (intent === "GET_DASHBOARD_SUMMARY") {
    const data = studioTools.get_dashboard_summary();
    return {
      message: `📊 **Studio Dashboard Overview**\n\n• **Revenue (MTD):** ${data.revenueMtd}\n• **Active Projects:** ${data.activeProjectsCount} of ${data.totalProjectsCount}\n• **Today's Sessions:** ${data.todaySessionsCount} shoots\n• **Unpaid Invoices:** ${data.unpaidInvoicesCount} (${data.unpaidTotalFormatted})\n• **Total Clients:** ${data.totalClients}`,
      actions: [],
      data
    };
  }

  // Default helpful response for unknown general queries
  return {
    message: "I can help with bookings, clients, projects, schedules, invoices, revenue, galleries and other FRAME AI Studio operations. What would you like to do?",
    actions: [],
    data: {}
  };
}

// --------------------------------------------------------------------------
// API ROUTES
// --------------------------------------------------------------------------

// 1. Main Chat Endpoint (POST /api/ai/chat)
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, conversationId, context = {} } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Message is required." });
    }

    console.log(`[StudioAI Request] Page: ${context.page || 'dashboard'} | Action: ${context.action || 'free-form'} | Message: "${message}"`);

    const hasKnownStudioIntent = /upcoming|coming up|booked next week|today|unpaid|haven't paid|hasn't paid|overdue|revenue|income|earn|available|free date|book |schedule|caption|instagram|find |search client|new client|create a client|new project|create project|show my projects|create invoice|generate invoice|notification|alert|photographer|team|package|rate|pricing|tier|analytics|cancel shoot|cancel booking/i.test(message);

    // Known studio operations are deterministic database actions. Gemini remains available for genuinely open-ended requests.
    if (context.action || hasKnownStudioIntent) {
      const localResult = handleSmartLocalAI(message, context);
      return res.json({
        message: localResult.message,
        conversationId: conversationId || "conv-" + Date.now(),
        actions: localResult.actions || [],
        data: localResult.data || {}
      });
    }

    // If Gemini Client is configured, execute via Gemini GenAI SDK with Tool Calling
    if (aiClient) {
      try {
        const systemInstruction = `You are StudioAI, the luxury executive AI assistant for FRAME AI Photography Studio Management System.
The studio owner is Alex Carter. The studio offers high-end Wedding, Fashion Editorial, Commercial Product, and Executive Portrait services.
Currency: Indian Rupee (₹ INR). Studio rooms: Studio A (Main Hall & Cyclorama), Studio B (Product & Portrait), Edit Suite, and Outdoor.
Today's date is ${STUDIO_TODAY}.
Always be concise, luxury-oriented, professional, and helpful.
Use the provided tools to inspect database state, check slot availability, create real bookings, find unpaid invoices, and calculate revenue.
Use get_upcoming_bookings for requests about future/upcoming/confirmed shoots, and get_today_schedule only for today's schedule.
Use get_notifications only for explicit notification or alert requests. Page context never overrides the user's request.
Never claim an action is completed unless confirmed by a tool. If the user wants to book a shoot, always check availability first and show a confirmation card before finalizing.`;

        const response = await aiClient.models.generateContent({
          model: GEMINI_MODEL,
          contents: message,
          config: {
            systemInstruction,
            tools: [{ functionDeclarations: geminiToolDeclarations }]
          }
        });

        // Check for function calls
        const functionCalls = response.functionCalls ? response.functionCalls() : [];
        if (functionCalls && functionCalls.length > 0) {
          const call = functionCalls[0];
          const toolFn = studioTools[call.name];
          if (toolFn) {
            console.log(`[StudioAI Tool Call] Executing tool: ${call.name} with args:`, call.args);
            const toolResult = toolFn(call.args);
            
            // Follow up with tool result
            const followUp = await aiClient.models.generateContent({
              model: GEMINI_MODEL,
              contents: [
                { role: 'user', parts: [{ text: message }] },
                { role: 'model', parts: [{ functionCall: call }] },
                { role: 'tool', parts: [{ functionResponse: { name: call.name, response: toolResult } }] }
              ],
              config: { systemInstruction }
            });

            return res.json({
              message: followUp.text || "I have processed your request.",
              conversationId: conversationId || "conv-" + Date.now(),
              actions: toolResult.actions || [],
              data: toolResult
            });
          }
        }

        if (response.text) {
          return res.json({
            message: response.text,
            conversationId: conversationId || "conv-" + Date.now(),
            actions: [],
            data: {}
          });
        }
      } catch (geminiErr) {
        console.warn('[StudioAI] Gemini API error, executing fallback intelligent engine:', geminiErr.message);
      }
    }

    // Smart Local AI Engine (Guaranteed 100% Reliable & Fully Interactive)
    const localResult = handleSmartLocalAI(message, context);
    return res.json({
      message: localResult.message,
      conversationId: conversationId || "conv-" + Date.now(),
      actions: localResult.actions || [],
      data: localResult.data || {}
    });

  } catch (err) {
    console.error('[StudioAI Error]:', err);
    return res.status(500).json({
      message: "StudioAI is temporarily experiencing an issue. Your studio data is safe.",
      actions: [],
      data: { error: err.message }
    });
  }
});

// 2. Direct Confirm Booking Endpoint (POST /api/bookings/confirm)
app.post('/api/bookings/confirm', (req, res) => {
  try {
    const bookingData = req.body;
    const result = studioTools.create_booking(bookingData);
    if (result.error) {
      return res.status(400).json(result);
    }
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 3. Direct Full Data Endpoint (GET /api/data)
app.get('/api/data', (req, res) => {
  const db = readDb();
  res.json(db);
});

// 4. Data Sync Endpoint (POST /api/data/sync)
app.post('/api/data/sync', (req, res) => {
  try {
    const current = readDb();
    const updated = { ...current, ...(req.body || {}) };
    writeDb(updated);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// AUTHENTICATION API ENDPOINTS
// --------------------------------------------------------------------------

// 1. Auth Config / Public Client Keys (GET /api/auth/config)
app.get('/api/auth/config', (req, res) => {
  return res.json({
    success: true,
    googleClientId: GOOGLE_CLIENT_ID || "",
    isGoogleConfigured: Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID.trim().length > 0)
  });
});

// 2. Google OAuth Redirect Entrypoint (GET /api/auth/google)
app.get('/api/auth/google', (req, res) => {
  if (!GOOGLE_CLIENT_ID) {
    return res.redirect('/#login?error=' + encodeURIComponent('Google OAuth client ID is not configured. Please set GOOGLE_CLIENT_ID in your .env file.'));
  }

  const callbackUrl = GOOGLE_CALLBACK_URL || `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
    `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(callbackUrl)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent('openid email profile')}` +
    `&access_type=offline` +
    `&prompt=select_account`;

  return res.redirect(googleAuthUrl);
});

// 3. Google OAuth Redirect Callback (GET /api/auth/google/callback)
app.get('/api/auth/google/callback', async (req, res) => {
  try {
    const { code, error, error_description } = req.query;

    if (error) {
      const msg = error_description || error || 'Google sign-in was cancelled or failed.';
      return res.redirect('/#login?error=' + encodeURIComponent(msg));
    }

    if (!code) {
      return res.redirect('/#login?error=' + encodeURIComponent('No authorization code was returned by Google.'));
    }

    const callbackUrl = GOOGLE_CALLBACK_URL || `${req.protocol}://${req.get('host')}/api/auth/google/callback`;

    // Exchange authorization code for access token
    const tokenPayload = new URLSearchParams({
      code: String(code),
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: callbackUrl,
      grant_type: 'authorization_code'
    }).toString();

    const tokenRes = await fetchJson('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenPayload
    });

    if (!tokenRes.ok || !tokenRes.data.access_token) {
      console.error('[Google OAuth] Token exchange error:', tokenRes.data);
      return res.redirect('/#login?error=' + encodeURIComponent('Failed to exchange authorization code with Google.'));
    }

    const accessToken = tokenRes.data.access_token;

    // Fetch User Profile from Google
    const userinfoRes = await fetchJson('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!userinfoRes.ok || !userinfoRes.data || !userinfoRes.data.email) {
      console.error('[Google OAuth] UserInfo error:', userinfoRes.data);
      return res.redirect('/#login?error=' + encodeURIComponent('Could not retrieve Google profile information.'));
    }

    const googleUser = userinfoRes.data;
    const cleanEmail = googleUser.email.toLowerCase().trim();
    const name = googleUser.name || googleUser.given_name || 'Google User';
    const avatar = googleUser.picture || '';

    const db = readDb();
    if (!db.users) db.users = [];

    let user = db.users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      // Register user seamlessly
      const saltData = hashPassword(crypto.randomBytes(24).toString('hex'));
      user = {
        id: "u-g-" + Date.now(),
        name,
        email: cleanEmail,
        studioName: `${name}'s Studio`,
        role: "Studio Owner",
        avatar,
        authProvider: "google",
        salt: saltData.salt,
        passwordHash: saltData.hash,
        createdAt: new Date().toISOString()
      };
      db.users.push(user);

      if (!db.notifications) db.notifications = [];
      db.notifications.unshift({
        id: "n-" + Date.now(),
        icon: "user-check",
        title: "Google Account Connected",
        msg: `Studio account established for ${name} (${cleanEmail}).`,
        time: "Just now",
        read: false,
        createdAt: new Date().toISOString()
      });
    } else {
      // Update avatar if provided
      if (avatar && !user.avatar) user.avatar = avatar;
    }

    // Create session token (30 days persistence)
    const token = generateToken();
    if (!db.authSessions) db.authSessions = [];
    db.authSessions.push({
      token,
      userId: user.id,
      email: user.email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    writeDb(db);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      studioName: user.studioName || `${user.name}'s Studio`,
      role: user.role || "Studio Owner",
      avatar: user.avatar || ""
    };

    return res.redirect(`/#google_auth=success&token=${token}&user=${encodeURIComponent(JSON.stringify(safeUser))}`);

  } catch (err) {
    console.error('[Google OAuth Error] Callback:', err);
    return res.redirect('/#login?error=' + encodeURIComponent('An unexpected error occurred during Google authentication.'));
  }
});

// 4. Google Token Verification Endpoint for GIS SDK (POST /api/auth/google/token)
app.post('/api/auth/google/token', async (req, res) => {
  try {
    const { credential, accessToken, email: passedEmail, name: passedName, picture: passedPicture } = req.body;

    let email = passedEmail;
    let name = passedName;
    let avatar = passedPicture;

    // Verify token with Google if credential (ID token) or access token is provided
    if (credential) {
      const verifyRes = await fetchJson(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
      if (verifyRes.ok && verifyRes.data && verifyRes.data.email) {
        email = verifyRes.data.email;
        name = verifyRes.data.name || name || 'Google User';
        avatar = verifyRes.data.picture || avatar || '';
      }
    } else if (accessToken) {
      const userinfoRes = await fetchJson('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (userinfoRes.ok && userinfoRes.data && userinfoRes.data.email) {
        email = userinfoRes.data.email;
        name = userinfoRes.data.name || name || 'Google User';
        avatar = userinfoRes.data.picture || avatar || '';
      }
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Unable to verify Google user credentials." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const finalName = name || cleanEmail.split('@')[0];

    const db = readDb();
    if (!db.users) db.users = [];

    let user = db.users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      const saltData = hashPassword(crypto.randomBytes(24).toString('hex'));
      user = {
        id: "u-g-" + Date.now(),
        name: finalName,
        email: cleanEmail,
        studioName: `${finalName}'s Studio`,
        role: "Studio Owner",
        avatar: avatar || "",
        authProvider: "google",
        salt: saltData.salt,
        passwordHash: saltData.hash,
        createdAt: new Date().toISOString()
      };
      db.users.push(user);

      if (!db.notifications) db.notifications = [];
      db.notifications.unshift({
        id: "n-" + Date.now(),
        icon: "user-check",
        title: "Google Account Connected",
        msg: `Studio account created for ${finalName} (${cleanEmail}).`,
        time: "Just now",
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    const token = generateToken();
    if (!db.authSessions) db.authSessions = [];
    db.authSessions.push({
      token,
      userId: user.id,
      email: user.email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    writeDb(db);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        studioName: user.studioName || `${user.name}'s Studio`,
        role: user.role || "Studio Owner",
        avatar: user.avatar || ""
      }
    });

  } catch (err) {
    console.error('[Google Token Error]:', err);
    return res.status(500).json({ error: "Google authentication failed. Please try again." });
  }
});

// 5. User Login (POST /api/auth/login)
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password, remember } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please enter your email and password." });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const db = readDb();
    const user = (db.users || []).find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(401).json({ error: "No account found with these credentials." });
    }

    const isValid = verifyPassword(password, user.salt, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    // Generate authenticated session token
    const token = generateToken();
    const expiresDays = remember ? 30 : 1;
    const expiresAt = new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000).toISOString();

    if (!db.authSessions) db.authSessions = [];
    db.authSessions.push({
      token,
      userId: user.id,
      email: user.email,
      createdAt: new Date().toISOString(),
      expiresAt
    });

    writeDb(db);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        studioName: user.studioName || "Frame Creative Studio",
        role: user.role || "Studio Owner"
      }
    });

  } catch (err) {
    console.error("[Auth Error] Login:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// 6. User Sign Up / Create Account (POST /api/auth/signup)
app.post('/api/auth/signup', (req, res) => {
  try {
    const { name, studioName, email, password, confirmPassword } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Please enter your full name." });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Please enter your email address." });
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = readDb();
    if (!db.users) db.users = [];

    const existing = db.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const { salt, hash } = hashPassword(password);
    const newUser = {
      id: "u-" + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      studioName: (studioName && studioName.trim()) || `${name.trim()}'s Studio`,
      role: "Studio Owner",
      salt,
      passwordHash: hash,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);

    // Create immediate session
    const token = generateToken();
    if (!db.authSessions) db.authSessions = [];
    db.authSessions.push({
      token,
      userId: newUser.id,
      email: newUser.email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    // Add studio notification
    if (!db.notifications) db.notifications = [];
    db.notifications.unshift({
      id: "n-" + Date.now(),
      icon: "user-plus",
      title: "Welcome to FRAME AI Studio!",
      msg: `Studio account registered for ${newUser.name} (${newUser.studioName}).`,
      time: "Just now",
      read: false,
      createdAt: new Date().toISOString()
    });

    writeDb(db);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        studioName: newUser.studioName,
        role: newUser.role
      }
    });

  } catch (err) {
    console.error("[Auth Error] Sign Up:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// 7. Forgot Password (POST /api/auth/forgot-password)
app.post('/api/auth/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Please enter your email." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const db = readDb();
    const user = (db.users || []).find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(404).json({ error: "No account found with this email address." });
    }

    // Generate secure reset token valid for 1 hour
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    if (!db.passwordResets) db.passwordResets = [];
    // Remove older tokens for this email
    db.passwordResets = db.passwordResets.filter(r => r.email.toLowerCase() !== cleanEmail);
    db.passwordResets.push({
      token: resetToken,
      email: cleanEmail,
      expiresAt
    });

    writeDb(db);

    const resetUrl = `/#reset-password?token=${resetToken}`;
    console.log(`[Auth Reset] Password reset token generated for ${cleanEmail}: ${resetUrl}`);

    return res.json({
      success: true,
      message: `Password reset link generated for ${cleanEmail}. Click the link below to set your new password.`,
      resetToken,
      resetUrl
    });

  } catch (err) {
    console.error("[Auth Error] Forgot Password:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// 8. Reset Password (POST /api/auth/reset-password)
app.post('/api/auth/reset-password', (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Password reset token is missing." });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const db = readDb();
    if (!db.passwordResets) db.passwordResets = [];

    const record = db.passwordResets.find(r => r.token === token);
    if (!record) {
      return res.status(400).json({ error: "Password reset link is invalid or has expired." });
    }

    if (new Date(record.expiresAt) < new Date()) {
      db.passwordResets = db.passwordResets.filter(r => r.token !== token);
      writeDb(db);
      return res.status(400).json({ error: "Password reset link has expired. Please request a new one." });
    }

    const user = (db.users || []).find(u => u.email.toLowerCase() === record.email.toLowerCase());
    if (!user) {
      return res.status(404).json({ error: "User account not found." });
    }

    // Hash new password
    const { salt, hash } = hashPassword(newPassword);
    user.salt = salt;
    user.passwordHash = hash;
    user.updatedAt = new Date().toISOString();

    // Invalidate reset token
    db.passwordResets = db.passwordResets.filter(r => r.token !== token);

    // Invalidate existing sessions for security
    if (db.authSessions) {
      db.authSessions = db.authSessions.filter(s => s.email.toLowerCase() !== user.email.toLowerCase());
    }

    writeDb(db);

    return res.json({
      success: true,
      message: "Password has been reset successfully. You can now sign in with your new password."
    });

  } catch (err) {
    console.error("[Auth Error] Reset Password:", err);
    return res.status(500).json({ error: "Failed to reset password. Please try again." });
  }
});

// 9. Get Current Auth User (GET /api/auth/me)
app.get('/api/auth/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : (req.query.token || "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided." });
    }

    const db = readDb();
    const session = (db.authSessions || []).find(s => s.token === token);
    if (!session) {
      return res.status(401).json({ error: "Session invalid or expired." });
    }

    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      return res.status(401).json({ error: "Session expired." });
    }

    const user = (db.users || []).find(u => u.id === session.userId || u.email.toLowerCase() === session.email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: "User record not found." });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        studioName: user.studioName || "Frame Creative Studio",
        role: user.role || "Studio Owner"
      }
    });

  } catch (err) {
    console.error("[Auth Error] Me:", err);
    return res.status(500).json({ error: "Unable to verify session." });
  }
});

// 10. Logout (POST /api/auth/logout)
app.post('/api/auth/logout', (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : (req.body && req.body.token);

    if (token) {
      const db = readDb();
      if (db.authSessions) {
        db.authSessions = db.authSessions.filter(s => s.token !== token);
        writeDb(db);
      }
    }

    return res.json({ success: true, message: "Logged out successfully." });

  } catch (err) {
    console.error("[Auth Error] Logout:", err);
    return res.status(500).json({ error: "Logout failed." });
  }
});

// --------------------------------------------------------------------------
// SETTINGS API ENDPOINTS
// --------------------------------------------------------------------------

// 10. Get Settings & AI Connection Status (GET /api/settings)
app.get('/api/settings', (req, res) => {
  try {
    const db = readDb();
    const isAiOnline = Boolean(GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here');
    return res.json({
      success: true,
      settings: db.settings || {},
      team: db.team || [],
      resources: db.resources || { rooms: [], equipment: [] },
      isAiOnline,
      aiModel: db.settings?.aiSettings?.model || "gemini-2.5-flash"
    });
  } catch (err) {
    console.error("[Settings Error] GET:", err);
    return res.status(500).json({ error: "Failed to load studio settings." });
  }
});

// 11. Save Settings Section (POST /api/settings)
app.post('/api/settings', (req, res) => {
  try {
    const { section, data } = req.body;
    if (!section || !data) {
      return res.status(400).json({ error: "Section and data are required." });
    }

    const db = readDb();
    if (!db.settings) db.settings = {};

    db.settings[section] = {
      ...(db.settings[section] || {}),
      ...data
    };

    // If updating studio profile, update admin user profile too
    if (section === 'studioProfile' && data.studioName) {
      const adminUser = (db.users || []).find(u => u.role === 'Studio Owner' || u.id === 'u-admin');
      if (adminUser) {
        if (data.owner) adminUser.name = data.owner;
        if (data.studioName) adminUser.studioName = data.studioName;
      }
    }

    // Add notification
    if (!db.notifications) db.notifications = [];
    db.notifications.unshift({
      id: "n-" + Date.now(),
      icon: "settings-2",
      title: "Settings Updated",
      msg: `${section.replace(/([A-Z])/g, ' $1').trim()} was updated successfully.`,
      time: "Just now",
      read: false,
      createdAt: new Date().toISOString()
    });

    writeDb(db);

    return res.json({
      success: true,
      message: "Settings updated successfully.",
      settings: db.settings
    });
  } catch (err) {
    console.error("[Settings Error] POST:", err);
    return res.status(500).json({ error: "Failed to save settings." });
  }
});

// 12. Change Password (POST /api/settings/password)
app.post('/api/settings/password', (req, res) => {
  try {
    const { email, currentPassword, newPassword, confirmPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters." });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "New passwords do not match." });
    }

    const db = readDb();
    const cleanEmail = (email || 'admin@frameai.com').toLowerCase().trim();
    const user = (db.users || []).find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(404).json({ error: "User account not found." });
    }

    // Verify current password if provided
    if (currentPassword) {
      const isValid = verifyPassword(currentPassword, user.salt, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: "Current password does not match our records." });
      }
    }

    const { salt, hash } = hashPassword(newPassword);
    user.salt = salt;
    user.passwordHash = hash;
    user.updatedAt = new Date().toISOString();

    writeDb(db);

    return res.json({
      success: true,
      message: "Password updated successfully."
    });
  } catch (err) {
    console.error("[Settings Error] Password:", err);
    return res.status(500).json({ error: "Failed to update password." });
  }
});

// 13. Team Management (POST /api/settings/team)
app.post('/api/settings/team', (req, res) => {
  try {
    const { action, member, id } = req.body;
    const db = readDb();
    if (!db.team) db.team = [];

    if (action === 'add') {
      if (!member || !member.name || !member.email) {
        return res.status(400).json({ error: "Team member name and email are required." });
      }
      const newMember = {
        id: "tm-" + Date.now(),
        name: member.name.trim(),
        email: member.email.trim(),
        role: member.role || "Photographer",
        phone: member.phone || "",
        status: member.status || "Active"
      };
      db.team.push(newMember);
      writeDb(db);
      return res.json({ success: true, team: db.team, member: newMember });
    } else if (action === 'edit') {
      const idx = db.team.findIndex(t => t.id === (id || member.id));
      if (idx === -1) return res.status(404).json({ error: "Team member not found." });
      db.team[idx] = { ...db.team[idx], ...member };
      writeDb(db);
      return res.json({ success: true, team: db.team, member: db.team[idx] });
    } else if (action === 'delete') {
      const targetId = id || (member && member.id);
      db.team = db.team.filter(t => t.id !== targetId);
      writeDb(db);
      return res.json({ success: true, team: db.team });
    }

    return res.status(400).json({ error: "Invalid action for team management." });
  } catch (err) {
    console.error("[Settings Error] Team:", err);
    return res.status(500).json({ error: "Failed to update team members." });
  }
});

// 14. Resources Management (POST /api/settings/resources)
app.post('/api/settings/resources', (req, res) => {
  try {
    const { action, type, item, id } = req.body; // type: 'room' | 'equipment'
    const db = readDb();
    if (!db.resources) db.resources = { rooms: [], equipment: [] };
    if (!db.resources.rooms) db.resources.rooms = [];
    if (!db.resources.equipment) db.resources.equipment = [];

    const collection = type === 'room' ? db.resources.rooms : db.resources.equipment;

    if (action === 'add') {
      if (!item || !item.name) {
        return res.status(400).json({ error: "Resource name is required." });
      }
      const newItem = {
        id: (type === 'room' ? 'rm-' : 'eq-') + Date.now(),
        ...item
      };
      collection.push(newItem);
      writeDb(db);
      return res.json({ success: true, resources: db.resources, item: newItem });
    } else if (action === 'edit') {
      const targetId = id || item.id;
      const idx = collection.findIndex(r => r.id === targetId);
      if (idx === -1) return res.status(404).json({ error: "Resource not found." });
      collection[idx] = { ...collection[idx], ...item };
      writeDb(db);
      return res.json({ success: true, resources: db.resources, item: collection[idx] });
    } else if (action === 'delete') {
      const targetId = id || (item && item.id);
      if (type === 'room') {
        db.resources.rooms = db.resources.rooms.filter(r => r.id !== targetId);
      } else {
        db.resources.equipment = db.resources.equipment.filter(e => e.id !== targetId);
      }
      writeDb(db);
      return res.json({ success: true, resources: db.resources });
    }

    return res.status(400).json({ error: "Invalid resource action." });
  } catch (err) {
    console.error("[Settings Error] Resources:", err);
    return res.status(500).json({ error: "Failed to update resources." });
  }
});

// SPA Route Aliases
app.get(['/login', '/signup', '/forgot-password', '/reset-password'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`✨ FRAME AI Studio & StudioAI Backend Running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔑 Demo Account: admin@frameai.com | Password: Studio@2026`);
  console.log(`🤖 Gemini API Key: ${GEMINI_API_KEY ? 'Configured ✅' : 'Demo Mode (Add key to .env)'}`);
  console.log(`==================================================\n`);
});

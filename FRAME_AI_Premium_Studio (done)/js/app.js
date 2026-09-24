/**
 * FRAME AI — Premium Smart Photography Studio Management
 * Complete Dynamic Application Logic & Interactive State Store
 */

// High quality studio photography asset presets
const PRESET_IMGS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80", // Wedding
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80", // Fashion campaign
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80", // Portraits
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80", // Product
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80", // Editorial
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80", // Wedding couple
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80", // Male portrait
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80", // Female portrait
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80", // Architecture/Studio
  "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&w=900&q=80"  // Creative portrait
];

// Initial Seed Data
const initialData = {
  clients: [
    { id: "c-1", name: "Sarah Johnson", email: "sarah@email.com", phone: "+91 98765 43210", company: "Private Client", type: "VIP", projectsCount: 12, totalRevenue: "₹2,45,000", lastSession: "20 Aug 2026", notes: "Prefers warm tone lighting and fast turnaround." },
    { id: "c-2", name: "Rahul Patel", email: "rahul.patel@gmail.com", phone: "+91 98200 12345", company: "Patel Holdings", type: "VIP", projectsCount: 4, totalRevenue: "₹3,10,000", lastSession: "18 Aug 2026", notes: "Looking for luxury wedding and pre-wedding coverage." },
    { id: "c-3", name: "Daniel Miller", email: "daniel@email.com", phone: "+91 98111 22334", company: "Private Client", type: "VIP", projectsCount: 8, totalRevenue: "₹1,85,000", lastSession: "18 Aug 2026", notes: "Wedding and anniversary portrait package." },
    { id: "c-4", name: "Aurelia Cosmetics", email: "hello@aurelia.com", phone: "+91 99223 34455", company: "Aurelia Group", type: "Business", projectsCount: 6, totalRevenue: "₹3,20,000", lastSession: "15 Aug 2026", notes: "Clean cosmetic studio lighting required." },
    { id: "c-5", name: "Nova Technologies", email: "contact@nova.com", phone: "+91 97334 45566", company: "Nova Tech Inc", type: "Business", projectsCount: 5, totalRevenue: "₹1,45,000", lastSession: "12 Aug 2026", notes: "Corporate headshots and executive branding." },
    { id: "c-6", name: "Olivia Carter", email: "olivia@email.com", phone: "+91 96445 56677", company: "Creative Vogue", type: "Regular", projectsCount: 4, totalRevenue: "₹95,000", lastSession: "10 Aug 2026", notes: "Editorial fashion portfolio." },
    { id: "c-7", name: "Sarah Khan", email: "sarah.khan@vogueindia.com", phone: "+91 98333 44556", company: "Vogue India", type: "VIP", projectsCount: 2, totalRevenue: "₹1,20,000", lastSession: "08 Aug 2026", notes: "High fashion & celebrity portraits." },
    { id: "c-8", name: "Michael Anderson", email: "michael@email.com", phone: "+91 95556 67788", company: "Anderson Studio", type: "Regular", projectsCount: 3, totalRevenue: "₹65,000", lastSession: "08 Aug 2026", notes: "Traditional family & wedding shoots." },
    { id: "c-9", name: "Emma Wilson", email: "emma@email.com", phone: "+91 94667 78899", company: "Wilson Arts", type: "Regular", projectsCount: 3, totalRevenue: "₹55,000", lastSession: "05 Aug 2026", notes: "Fashion test shoots and lookbook." }
  ],
  projects: [
    { id: "p-1", name: "Sarah & Daniel Wedding", type: "Wedding", client: "Sarah Johnson", budget: "₹1,85,000", progress: "78%", img: PRESET_IMGS[0], status: "Editing", date: "2026-08-20", notes: "Full day coverage in Studio A and outdoor lawn." },
    { id: "p-2", name: "Rahul & Priya Royal Wedding", type: "Wedding", client: "Rahul Patel", budget: "₹2,50,000", progress: "50%", img: PRESET_IMGS[5], status: "Planning", date: "2026-09-15", notes: "Destination wedding at Taj Lands End, Mumbai." },
    { id: "p-3", name: "Aurelia Summer Campaign", type: "Campaign", client: "Aurelia Cosmetics", budget: "₹2,40,000", progress: "62%", img: PRESET_IMGS[1], status: "Shooting", date: "2026-08-18", notes: "Product line and 4 models in Studio B." },
    { id: "p-4", name: "Nova Corporate Portraits", type: "Portraits", client: "Nova Technologies", budget: "₹95,000", progress: "40%", img: PRESET_IMGS[2], status: "Booked", date: "2026-08-15", notes: "30 team portraits in Studio A." },
    { id: "p-5", name: "Maison Collection", type: "Product", client: "Maison", budget: "₹1,25,000", progress: "90%", img: PRESET_IMGS[3], status: "Review", date: "2026-08-14", notes: "Luxury leather goods and accessories." },
    { id: "p-6", name: "Olivia Portraits", type: "Editorial", client: "Olivia Carter", budget: "₹75,000", progress: "30%", img: PRESET_IMGS[4], status: "Editing", date: "2026-08-10", notes: "Monochrome high-fashion editorial set." }
  ],
  photographers: [
    {
      id: "ph-1",
      name: "Armaan Khan",
      role: "Lead Wedding Photographer",
      specialization: "Wedding Photographer",
      email: "armaan.khan@frameai.studio",
      phone: "+91 98201 11223",
      experience: "8 Years",
      employmentType: "Full-time",
      status: "Available",
      currentAssignment: "Available for booking",
      rating: 4.9,
      reviewsCount: 128,
      dailyRate: "₹18,000",
      location: "Mumbai",
      assignedProjectsCount: 14,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Senior lead wedding specialist renowned for grand destination ceremonies, royal palace celebrations, and emotional candid framing.",
      skills: ["Candid Wedding", "Bridal Portraits", "Off-Camera Flash", "Sony Alpha Master", "Drone Certified"],
      totalShoots: 240,
      completedProjects: ["Rahul & Priya Royal Wedding", "Sarah & Daniel Wedding", "Mehta Grand Sangeet"],
      earnings: "₹4,32,000"
    },
    {
      id: "ph-2",
      name: "Riya Mehta",
      role: "Senior Portrait Specialist",
      specialization: "Portrait Photographer",
      email: "riya.mehta@frameai.studio",
      phone: "+91 98334 22334",
      experience: "6 Years",
      employmentType: "Full-time",
      status: "Busy",
      currentAssignment: "Olivia Carter Autumn Lookbook",
      rating: 4.95,
      reviewsCount: 94,
      dailyRate: "₹15,000",
      location: "Mumbai",
      assignedProjectsCount: 11,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "Editorial and fine-art portraiture specialist with expertise in magazine covers, high-key studio strobe lighting and natural light moods.",
      skills: ["Studio Strobes", "Beauty Retouching", "Fashion Editorial", "Hasselblad Medium Format", "Art Direction"],
      totalShoots: 182,
      completedProjects: ["Olivia Portraits", "Emma Wilson Model Portfolio", "Vogue Studio Series"],
      earnings: "₹3,15,000"
    },
    {
      id: "ph-3",
      name: "Kabir Shah",
      role: "Event & Gala Specialist",
      specialization: "Event Photographer",
      email: "kabir.shah@frameai.studio",
      phone: "+91 98112 33445",
      experience: "5 Years",
      employmentType: "Freelance",
      status: "Available",
      currentAssignment: "Available for booking",
      rating: 4.8,
      reviewsCount: 76,
      dailyRate: "₹12,500",
      location: "Delhi / Mumbai",
      assignedProjectsCount: 8,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      bio: "Dynamic corporate gala and high-energy live event photographer specializing in low-light environments and instant delivery workflows.",
      skills: ["Low Light", "Corporate Events", "Gala & Concerts", "Fast Tethering", "Dual Camera Rig"],
      totalShoots: 145,
      completedProjects: ["Nova Corporate Executive Headshots", "Global Tech Summit 2026", "Maison Launch Gala"],
      earnings: "₹2,60,000"
    },
    {
      id: "ph-4",
      name: "Sana Patel",
      role: "Commercial Product Lead",
      specialization: "Product Photographer",
      email: "sana.patel@frameai.studio",
      phone: "+91 99225 44556",
      experience: "7 Years",
      employmentType: "Full-time",
      status: "Available",
      currentAssignment: "Available for booking",
      rating: 4.9,
      reviewsCount: 110,
      dailyRate: "₹16,000",
      location: "Bengaluru",
      assignedProjectsCount: 12,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      bio: "Commercial still-life and luxury cosmetics photographer adept with macro optics, refractive liquid splashes, and e-commerce catalogs.",
      skills: ["Macro Optics", "Liquid Motion", "Color Calibration", "Commercial Styling", "Focus Stacking"],
      totalShoots: 210,
      completedProjects: ["Aurelia Summer Campaign", "Maison Leather Goods", "Velvet Cosmetics"],
      earnings: "₹3,90,000"
    },
    {
      id: "ph-5",
      name: "Aditya Verma",
      role: "Cinematic Film Director",
      specialization: "Cinematic Photographer",
      email: "aditya.verma@frameai.studio",
      phone: "+91 97336 55667",
      experience: "9 Years",
      employmentType: "Freelance",
      status: "Busy",
      currentAssignment: "Aurelia Macro Video & Stills",
      rating: 4.98,
      reviewsCount: 142,
      dailyRate: "₹22,000",
      location: "Mumbai",
      assignedProjectsCount: 15,
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
      bio: "Award-winning cinematographer directing 4K cinematic wedding trailers, high-fashion reels, and commercial motion campaigns.",
      skills: ["4K / 8K Cinema", "Gimbal Mastery", "FPV Drone", "DaVinci Color Grading", "Audio Mixing"],
      totalShoots: 195,
      completedProjects: ["Royal Wedding Cinematic Film", "Aurelia Brand Video", "Monochrome Noir Reel"],
      earnings: "₹5,10,000"
    },
    {
      id: "ph-6",
      name: "Meera Joshi",
      role: "Fashion & Editorial Lead",
      specialization: "Fashion Photographer",
      email: "meera.joshi@frameai.studio",
      phone: "+91 98440 66778",
      experience: "6 Years",
      employmentType: "Full-time",
      status: "On Leave",
      currentAssignment: "On Leave",
      rating: 4.88,
      reviewsCount: 88,
      dailyRate: "₹15,500",
      location: "Mumbai",
      assignedProjectsCount: 9,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      bio: "High-fashion editorial photographer with work published in top lifestyle journals. Expert in moody contrast and dramatic studio gel lighting.",
      skills: ["Fashion Posing", "Gel Lighting", "Editorial Lookbook", "Creative Direction", "High-End Retouch"],
      totalShoots: 160,
      completedProjects: ["Maison Fashion Editorial", "Aurelia Summer Campaign Session", "Autumn Lookbook"],
      earnings: "₹2,95,000"
    },
    {
      id: "ph-7",
      name: "Alex Carter",
      role: "Studio Director & Master",
      specialization: "Studio Lead & Commercial",
      email: "alex.carter@frameai.studio",
      phone: "+91 98000 00123",
      experience: "11 Years",
      employmentType: "Full-time",
      status: "Available",
      currentAssignment: "Studio Leadership & Calibration",
      rating: 5.0,
      reviewsCount: 210,
      dailyRate: "₹25,000",
      location: "Mumbai",
      assignedProjectsCount: 22,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      bio: "Studio Director and Master Photographer overseeing lighting design, color accuracy, and high-stakes commercial accounts.",
      skills: ["Studio Architecture", "Commercial Lighting", "Master Colorist", "Client Direction", "Executive Portfolios"],
      totalShoots: 380,
      completedProjects: ["Nova Corporate Portraits", "Studio Setup & Calibration", "Sarah & Daniel Wedding Portraits"],
      earnings: "₹8,50,000"
    },
    {
      id: "ph-8",
      name: "Zoya Shaikh",
      role: "Pre-Wedding & Drone Specialist",
      specialization: "Pre-Wedding & Drone",
      email: "zoya.shaikh@frameai.studio",
      phone: "+91 96551 77889",
      experience: "4 Years",
      employmentType: "Freelance",
      status: "Available",
      currentAssignment: "Available for booking",
      rating: 4.75,
      reviewsCount: 52,
      dailyRate: "₹14,000",
      location: "Goa / Mumbai",
      assignedProjectsCount: 7,
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
      bio: "Aerial visual storyteller and landscape photographer bringing cinematic bird's-eye perspectives to luxury palace and beach weddings.",
      skills: ["Aerial Drone 4K", "Landscape Astrophotography", "GoPro & FPV", "Travel Logistics", "RAW Grading"],
      totalShoots: 88,
      completedProjects: ["Weekend Luxury Wedding Session", "Goa Resort Showcase", "Lawn Celebration"],
      earnings: "₹1,75,000"
    }
  ],
  packages: [
    {
      id: "pkg-1",
      name: "Wedding Classic",
      category: "Wedding",
      price: 45000,
      priceFormatted: "₹45,000",
      duration: "8 Hours",
      photographersCount: 2,
      editedPhotosCount: 300,
      videoIncluded: true,
      albumIncluded: false,
      droneCoverage: false,
      onlineGallery: true,
      retouching: "Signature Color Grading & Retouch",
      description: "Comprehensive wedding ceremony & reception coverage with 2 professional photographers and edited highlight captures.",
      deliverables: [
        "8 Hours Full Coverage",
        "2 Professional Photographers (Lead + Candid)",
        "300 High-Resolution Master Edited Photos",
        "Private Online Client Gallery (1 Year)",
        "Print-Ready Full Resolution Files",
        "48-Hour Sneak Peek Preview"
      ],
      popular: false,
      status: "Active"
    },
    {
      id: "pkg-2",
      name: "Wedding Premium",
      category: "Wedding",
      price: 75000,
      priceFormatted: "₹75,000",
      duration: "12 Hours",
      photographersCount: 3,
      editedPhotosCount: 600,
      videoIncluded: true,
      albumIncluded: true,
      droneCoverage: true,
      onlineGallery: true,
      retouching: "Advanced Editorial Retouching",
      description: "Our most popular luxury wedding tier with full-day multi-angle coverage, 4K highlights teaser and drone footage.",
      deliverables: [
        "12 Hours Unlimited Event Coverage",
        "3 Master Photographers (Lead + Candid + Creative)",
        "600 Carefully Hand-Edited Photos",
        "4K Cinematic Teaser (3-5 Minutes)",
        "Aerial Drone Master Shoots",
        "Custom Handcrafted Leather Flushmount Album",
        "VIP Priority Turnaround (7 Days)"
      ],
      popular: true,
      status: "Active"
    },
    {
      id: "pkg-3",
      name: "Portrait Session",
      category: "Portrait",
      price: 8500,
      priceFormatted: "₹8,500",
      duration: "2 Hours",
      photographersCount: 1,
      editedPhotosCount: 30,
      videoIncluded: false,
      albumIncluded: false,
      droneCoverage: false,
      onlineGallery: true,
      retouching: "High-End Beauty Retouching",
      description: "Studio cyclorama or natural light portrait session tailored for personal branding, headshots and agency lookbooks.",
      deliverables: [
        "2 Hours Dedicated Studio Session",
        "1 Senior Portrait Photographer",
        "30 Magazine-Grade Beauty Retouched Images",
        "2 Backdrop & Outfit Changes",
        "High-Resolution & Web Formats",
        "Studio Lighting Assistant Included"
      ],
      popular: false,
      status: "Active"
    },
    {
      id: "pkg-4",
      name: "Pre-Wedding Story",
      category: "Pre-Wedding",
      price: 25000,
      priceFormatted: "₹25,000",
      duration: "6 Hours",
      photographersCount: 2,
      editedPhotosCount: 150,
      videoIncluded: true,
      albumIncluded: false,
      droneCoverage: true,
      onlineGallery: true,
      retouching: "Cinematic Color Tone & Retouch",
      description: "Artistic multi-location couple narrative session combining scenic outdoor vistas and architectural aesthetics.",
      deliverables: [
        "6 Hours Multi-Location Coverage",
        "2 Photographers (Lead + Cinematographer)",
        "150 Master Color-Graded Photos",
        "60-Second Instagram Reel & Teaser",
        "Full Wardrobe & Styling Moodboard Guidance",
        "Online Cloud Gallery Download"
      ],
      popular: false,
      status: "Active"
    },
    {
      id: "pkg-5",
      name: "Event Coverage",
      category: "Event",
      price: 18000,
      priceFormatted: "₹18,000",
      duration: "5 Hours",
      photographersCount: 2,
      editedPhotosCount: 200,
      videoIncluded: true,
      albumIncluded: false,
      droneCoverage: false,
      onlineGallery: true,
      retouching: "Standard Event Retouching",
      description: "High-energy live event, corporate gala, milestone celebration, or conference coverage with instant tethering.",
      deliverables: [
        "5 Hours Live Event Coverage",
        "2 Dedicated Event Photographers",
        "200 Edited Candid & Stage Photos",
        "Same-Day 20-Photo Press & Social Release",
        "Low-Light Dual Camera Rig Performance",
        "Online High-Speed Download Gallery"
      ],
      popular: false,
      status: "Active"
    },
    {
      id: "pkg-6",
      name: "Product Photography",
      category: "Product",
      price: 12000,
      priceFormatted: "₹12,000",
      duration: "3 Hours",
      photographersCount: 1,
      editedPhotosCount: 50,
      videoIncluded: false,
      albumIncluded: false,
      droneCoverage: false,
      onlineGallery: true,
      retouching: "Pixel-Perfect Commercial Retouch",
      description: "Precision still-life, cosmetics, e-commerce catalog and creative hero product shots in Studio B.",
      deliverables: [
        "3 Hours Studio B Product Session",
        "1 Commercial Product Specialist",
        "50 Pixel-Perfect Retouched Images",
        "Clean White & Creative Styled Sets",
        "Macro Lens Liquid & Texture Stacking",
        "Full Worldwide Commercial Usage License"
      ],
      popular: false,
      status: "Active"
    },
    {
      id: "pkg-7",
      name: "Fashion Lookbook",
      category: "Fashion",
      price: 35000,
      priceFormatted: "₹35,000",
      duration: "6 Hours",
      photographersCount: 2,
      editedPhotosCount: 80,
      videoIncluded: true,
      albumIncluded: false,
      droneCoverage: false,
      onlineGallery: true,
      retouching: "High-End Editorial Beauty Retouch",
      description: "High-fashion editorial campaigns and brand lookbooks with dramatic gel lighting and high-end retouching.",
      deliverables: [
        "6 Hours Studio & Location Shoot",
        "2 Fashion Specialists (Strobe + Motion)",
        "80 High-End Beauty & Editorial Retouched Images",
        "Up to 8 Wardrobe Looks",
        "Creative Direction & Model Posing Guide",
        "Commercial Editorial License"
      ],
      popular: false,
      status: "Active"
    }
  ],
  bookings: [
    { id: "b-1", title: "Studio Preparation & Calibration", client: "Internal", type: "Setup", date: "2026-08-24", startTime: "09:00", endTime: "10:00", photographer: "Alex Carter", location: "Studio A", status: "Confirmed", notes: "Check strobes and backdrop motors." },
    { id: "b-2", title: "Sarah & Daniel Wedding Portraits", client: "Sarah Johnson", type: "Wedding Portraits", date: "2026-08-24", startTime: "10:30", endTime: "13:00", photographer: "Armaan Khan", location: "Studio A", status: "Confirmed", notes: "Bridal gown and formal suits." },
    { id: "b-3", title: "Aurelia Summer Campaign Session", client: "Aurelia Cosmetics", type: "Product Campaign", date: "2026-08-24", startTime: "13:00", endTime: "15:00", photographer: "Sana Patel", location: "Studio B", status: "Confirmed", notes: "Liquid splashes and macro lens lighting." },
    { id: "b-4", title: "Nova Corporate Executive Headshots", client: "Nova Technologies", type: "Corporate Portraits", date: "2026-08-24", startTime: "15:30", endTime: "17:30", photographer: "Kabir Shah", location: "Studio A", status: "Pending", notes: "Executive team members 1 through 8." },
    { id: "b-5", title: "Maison Fashion Editorial", client: "Maison", type: "Fashion Editorial", date: "2026-08-24", startTime: "18:00", endTime: "20:00", photographer: "Meera Joshi", location: "Studio A", status: "Confirmed", notes: "Evening dramatic lighting setup." },
    { id: "b-6", title: "Aurelia Macro Video & Stills", client: "Aurelia Cosmetics", type: "Product Campaign", date: "2026-08-25", startTime: "13:00", endTime: "16:00", photographer: "Aditya Verma", location: "Studio B", status: "Confirmed", notes: "Bottle textures and color swatches." },
    { id: "b-7", title: "Nova Leadership Video Branding", client: "Nova Technologies", type: "Corporate", date: "2026-08-26", startTime: "15:30", endTime: "18:00", photographer: "Kabir Shah", location: "Studio A", status: "Confirmed", notes: "Interview setup with sound dampening." },
    { id: "b-8", title: "Olivia Carter Autumn Lookbook", client: "Olivia Carter", type: "Editorial", date: "2026-08-27", startTime: "11:00", endTime: "14:30", photographer: "Riya Mehta", location: "Outdoor", status: "Confirmed", notes: "Natural lighting session in botanical garden." },
    { id: "b-9", title: "Rahul & Priya Royal Pre-Wedding", client: "Rahul Patel", type: "Pre-Wedding", date: "2026-09-14", startTime: "08:00", endTime: "14:00", photographer: "Zoya Shaikh", location: "Outdoor", status: "Confirmed", notes: "Palace lawn and drone aerial choreography." },
    { id: "b-10", title: "Rahul & Priya Grand Wedding Ceremony", client: "Rahul Patel", type: "Wedding", date: "2026-09-15", startTime: "10:00", endTime: "22:00", photographer: "Armaan Khan", location: "Outdoor", status: "Confirmed", notes: "Full resort coverage." }
  ],
  invoices: [
    { id: "INV-1024", client: "Sarah Johnson", project: "Wedding Portraits", amount: "₹1,85,000", numericAmount: 185000, issueDate: "2026-08-20", dueDate: "2026-08-30", status: "Paid", notes: "Paid via Direct Bank Transfer" },
    { id: "INV-1023", client: "Aurelia Cosmetics", project: "Summer Campaign", amount: "₹2,40,000", numericAmount: 240000, issueDate: "2026-08-18", dueDate: "2026-08-28", status: "Paid", notes: "Commercial usage license included" },
    { id: "INV-1022", client: "Nova Technologies", project: "Corporate Portraits", amount: "₹95,000", numericAmount: 95000, issueDate: "2026-08-15", dueDate: "2026-08-25", status: "Pending", notes: "Net 10 terms" },
    { id: "INV-1021", client: "Maison Collection", project: "Product Photography", amount: "₹1,25,000", numericAmount: 125000, issueDate: "2026-08-14", dueDate: "2026-08-24", status: "Pending", notes: "Advance received 50%" },
    { id: "INV-1020", client: "Olivia Carter", project: "Editorial Shoot", amount: "₹75,000", numericAmount: 75000, issueDate: "2026-08-10", dueDate: "2026-08-20", status: "Overdue", notes: "Reminder sent on 21 Aug" },
    { id: "INV-1019", client: "Michael Anderson", project: "Pre-Wedding Session", amount: "₹2,15,000", numericAmount: 215000, issueDate: "2026-08-08", dueDate: "2026-08-18", status: "Overdue", notes: "Follow-up scheduled" }
  ],
  gallery: [
    { id: "g-1", title: "Sarah & Daniel Wedding", category: "Wedding", client: "Sarah Johnson", img: PRESET_IMGS[0], rating: 5, status: "Published", date: "2026-08-20" },
    { id: "g-2", title: "Aurelia Summer Campaign", category: "Commercial", client: "Aurelia Cosmetics", img: PRESET_IMGS[1], rating: 5, status: "Published", date: "2026-08-18" },
    { id: "g-3", title: "Nova Leadership Portraits", category: "Portraits", client: "Nova Technologies", img: PRESET_IMGS[2], rating: 4, status: "Client Review", date: "2026-08-15" },
    { id: "g-4", title: "Maison Leather Goods", category: "Product", client: "Maison", img: PRESET_IMGS[3], rating: 5, status: "Published", date: "2026-08-14" },
    { id: "g-5", title: "Olivia High Fashion", category: "Editorial", client: "Olivia Carter", img: PRESET_IMGS[4], rating: 4, status: "Published", date: "2026-08-10" },
    { id: "g-6", title: "Golden Hour Romance", category: "Wedding", client: "Michael Anderson", img: PRESET_IMGS[5], rating: 5, status: "Published", date: "2026-08-08" },
    { id: "g-7", title: "Executive Noir", category: "Portraits", client: "Nova Technologies", img: PRESET_IMGS[6], rating: 4, status: "Private", date: "2026-08-05" },
    { id: "g-8", title: "Studio Light Study", category: "Editorial", client: "Emma Wilson", img: PRESET_IMGS[7], rating: 5, status: "Published", date: "2026-08-02" }
  ],
  notifications: [
    { id: "n-1", icon: "calendar-check", title: "New booking confirmed", msg: "Sarah & Daniel confirmed their wedding portrait session with Aarav Khan.", time: "8 min ago", read: false },
    { id: "n-2", icon: "wallet-cards", title: "Payment received", msg: "INV-1024 (₹1,85,000) has been paid by Sarah Johnson.", time: "42 min ago", read: false },
    { id: "n-3", icon: "camera", title: "Photographer assignment updated", msg: "Zoya Shaikh assigned to Olivia Carter Autumn Lookbook.", time: "1 hr ago", read: false },
    { id: "n-4", icon: "package", title: "Package tier published", msg: "Luxury Royal package updated with 4K Drone Coverage inclusions.", time: "2 hr ago", read: false }
  ],
  team: [
    { id: "tm-1", name: "Armaan Khan", email: "armaan.khan@frameai.studio", role: "Lead Wedding Photographer", phone: "+91 98201 11223", status: "Active" },
    { id: "tm-2", name: "Zoya Shaikh", email: "zoya.shaikh@frameai.studio", role: "Photographer", phone: "+91 98202 33445", status: "Active" },
    { id: "tm-3", name: "Rohan Mehra", email: "rohan.mehra@frameai.studio", role: "Manager", phone: "+91 98203 55667", status: "Active" },
    { id: "tm-4", name: "Tara Sen", email: "tara.sen@frameai.studio", role: "Editor", phone: "+91 98204 77889", status: "Active" },
    { id: "tm-5", name: "Dev Sharma", email: "dev.sharma@frameai.studio", role: "Assistant", phone: "+91 98205 99001", status: "Active" }
  ],
  resources: {
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
  },
  settings: {
    studioProfile: {
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
    },
    account: {
      ownerName: "Alex Carter",
      email: "admin@frameai.com",
      role: "Studio Owner",
      phone: "+91 98200 88990",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    bookingHours: {
      openingTime: "09:00",
      closingTime: "20:00",
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      breakHours: "13:00 - 14:00",
      defaultDuration: "3 Hours",
      bufferMinutes: 30,
      maxDailyBookings: 8,
      autoConfirm: true
    },
    invoiceSettings: {
      prefix: "FAI-",
      currency: "INR",
      currencySymbol: "₹",
      taxName: "GST",
      taxRate: 18,
      paymentTerms: "Due within 7 days",
      businessTaxId: "GSTIN27AABCU9603R1ZM",
      invoiceNotes: "Bank: HDFC Bank | A/C: 50200088991122 | IFSC: HDFC0001234 | UPI: frameai@hdfcbank\nThank you for choosing FRAME AI Studio. For billing inquiries, contact billing@frameai.studio."
    },
    aiSettings: {
      provider: "Google Gemini",
      model: "gemini-2.5-flash",
      assistantName: "StudioAI",
      temperature: 0.7,
      responseStyle: "Balanced",
      systemInstructions: "You are StudioAI, the premier AI operating assistant for FRAME AI Studio. You assist studio owners, photographers, and clients with session bookings, availability management, client communication, invoice tracking, and creative workflows. Maintain a professional, luxurious, courteous, and efficient tone."
    },
    themeSettings: {
      theme: "dark",
      accentColor: "purple",
      sidebarMode: "expanded",
      animations: true,
      reduceMotion: false
    },
    // Backward compatibility aliases
    studioName: "Frame Creative Studio",
    owner: "Alex Carter",
    email: "hello@frameai.studio",
    currency: "INR",
    bio: "Premium photography and visual production studio powered by FRAME AI. Specializing in luxury weddings, high-fashion editorials, commercial campaigns, and executive portraits.",
    theme: "dark",
    aiProcessing: "Automatic"
  },
  calendar: {
    year: 2026,
    month: 7, // August (0-indexed: 7 is August)
    selectedDate: "2026-08-24",
    view: "month", // "month" | "week" | "day"
    locationFilter: "all" // "all" | "Studio A" | "Studio B" | "Edit Suite" | "Outdoor"
  }
};

// State Management with LocalStorage
const STORAGE_KEY = "frame_ai_studio_state_v5";
let state = loadState();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Ensure nested settings structure exists
      const defaultSettings = initialData.settings;
      const loadedSettings = parsed.settings || {};
      
      const mergedSettings = {
        ...defaultSettings,
        ...loadedSettings,
        studioProfile: {
          ...defaultSettings.studioProfile,
          ...(loadedSettings.studioProfile || {}),
          studioName: loadedSettings.studioProfile?.studioName || loadedSettings.studioName || defaultSettings.studioProfile.studioName,
          owner: loadedSettings.studioProfile?.owner || loadedSettings.owner || defaultSettings.studioProfile.owner,
          email: loadedSettings.studioProfile?.email || loadedSettings.email || defaultSettings.studioProfile.email,
          bio: loadedSettings.studioProfile?.bio || loadedSettings.bio || defaultSettings.studioProfile.bio
        },
        account: {
          ...defaultSettings.account,
          ...(loadedSettings.account || {})
        },
        bookingHours: {
          ...defaultSettings.bookingHours,
          ...(loadedSettings.bookingHours || {})
        },
        invoiceSettings: {
          ...defaultSettings.invoiceSettings,
          ...(loadedSettings.invoiceSettings || {})
        },
        aiSettings: {
          ...defaultSettings.aiSettings,
          ...(loadedSettings.aiSettings || {})
        },
        themeSettings: {
          ...defaultSettings.themeSettings,
          ...(loadedSettings.themeSettings || {})
        },
        studioName: loadedSettings.studioProfile?.studioName || loadedSettings.studioName || defaultSettings.studioProfile.studioName,
        owner: loadedSettings.studioProfile?.owner || loadedSettings.owner || defaultSettings.studioProfile.owner,
        email: loadedSettings.studioProfile?.email || loadedSettings.email || defaultSettings.studioProfile.email,
        bio: loadedSettings.studioProfile?.bio || loadedSettings.bio || defaultSettings.studioProfile.bio,
        theme: loadedSettings.themeSettings?.theme || loadedSettings.theme || defaultSettings.themeSettings.theme
      };

      return {
        ...initialData,
        ...parsed,
        photographers: (parsed.photographers && parsed.photographers.length > 0) ? parsed.photographers : initialData.photographers,
        packages: (parsed.packages && parsed.packages.length > 0) ? parsed.packages : initialData.packages,
        team: (parsed.team && parsed.team.length > 0) ? parsed.team : initialData.team,
        resources: (parsed.resources && parsed.resources.rooms) ? parsed.resources : initialData.resources,
        settings: mergedSettings,
        calendar: { ...initialData.calendar, ...(parsed.calendar || {}) }
      };
    }
  } catch (e) {
    console.warn("Could not load saved state, using initial seed data.", e);
  }
  return JSON.parse(JSON.stringify(initialData));
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    // Optional backend sync if server is running
    if (typeof fetch === 'function') {
      fetch('/api/data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
      }).catch(() => {});
    }
  } catch (e) {
    console.error("Failed to save state to localStorage", e);
  }
}

// Global DOM Selectors
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function icon(name) {
  return `<i data-lucide="${name}"></i>`;
}

function initIcons() {
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function pageHead(title, desc, actions = "") {
  return `
    <div class="page-head">
      <div>
        <div class="eyebrow">FRAME AI / STUDIO</div>
        <h1>${title}</h1>
        <p>${desc}</p>
      </div>
      <div class="head-actions">${actions}</div>
    </div>
  `;
}

function statCard(iconName, title, value, sub, trend = "") {
  return `
    <div class="card stat">
      <div class="stat-top">
        <span class="stat-icon">${icon(iconName)}</span>
        <span class="muted">${sub}</span>
      </div>
      <h2>${value}</h2>
      ${trend ? `<span class="trend">${trend}</span>` : ""}
      <p>${title}</p>
      <div class="spark">
        <svg viewBox="0 0 180 28" preserveAspectRatio="none">
          <polyline points="0,22 18,19 35,24 53,12 70,18 88,7 106,14 125,5 142,11 160,3 180,8" fill="none" stroke="currentColor" stroke-width="1.6"/>
        </svg>
      </div>
    </div>
  `;
}

function projectCard(p) {
  return `
    <div class="project-card" data-project-id="${p.id}" onclick="openProjectDetails('${p.id}')">
      <div class="project-img" style="background-image:url('${p.img || PRESET_IMGS[0]}')"></div>
      <div class="project-meta">
        <strong>${p.name}</strong>
        <small>${p.type} · ${p.client}</small>
        <div class="cover-row" style="margin-top:7px">
          <span>${p.budget}</span>
          <span class="gold">${p.progress}</span>
        </div>
        <div class="bar">
          <span style="width:${p.progress}"></span>
        </div>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// PAGE RENDERERS
// --------------------------------------------------------------------------

// 1. DASHBOARD
function dashboard() {
  const activeProjectsCount = state.projects.filter(p => p.status !== 'Completed').length;
  const pendingInvoices = state.invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue');
  const pendingTotal = pendingInvoices.reduce((sum, i) => sum + (i.numericAmount || parseInt(i.amount.replace(/[^0-9]/g, '') || 0)), 0);
  const formattedPending = "₹" + pendingTotal.toLocaleString('en-IN');
  
  // Today's Bookings
  const todayStr = state.calendar.selectedDate || "2026-08-24";
  const todayBookings = state.bookings.filter(b => b.date === todayStr);

  return pageHead(
    `Good morning, ${state.settings.owner.split(' ')[0]} ✦`,
    "Here's what's happening across your studio today.",
    `<button class="btn" onclick="location.hash='calendar'"><i data-lucide="calendar"></i> Monday, 24 Aug 2026</button>
     <button class="btn ai" data-action="insights">✦ AI Insights</button>
     <button class="btn primary" data-action="new-project"><i data-lucide="plus"></i> New Project</button>`
  ) + `
    <div class="ai-banner">
      <div class="ai-orb"></div>
      <div>
        <div class="eyebrow">STUDIO INTELLIGENCE</div>
        <h2>Your studio is 18.4% ahead this month.</h2>
        <p>Revenue and booking activity are trending above your previous period across Studio A and B.</p>
      </div>
      <div class="banner-actions">
        <button class="btn ai" data-action="insights">View Insights</button>
        <button class="btn" onclick="this.closest('.ai-banner').style.display='none'">Dismiss</button>
      </div>
    </div>

    <div class="kpis">
      ${statCard("wallet-cards", "Revenue", "₹8,42,500", "vs last month", "+18.4%")}
      ${statCard("layers-3", "Active Projects", String(activeProjectsCount), `${state.projects.length} Total`, "+4 this week")}
      ${statCard("calendar-days", "Today's Sessions", String(todayBookings.length), "Next: 10:30 AM", "Active")}
      ${statCard("receipt", "Pending Invoices", formattedPending, `${pendingInvoices.length} invoices`, "Action")}
    </div>

    <div class="two-col">
      <div class="card chart-card">
        <div class="card-head">
          <h3>Revenue Overview</h3>
          <span>7D &nbsp; 30D &nbsp; 3M &nbsp; 6M &nbsp; 1Y</span>
        </div>
        <div class="chart-wrap">
          <canvas id="revenueChart"></canvas>
        </div>
        <small class="muted">↗ Revenue is up 18.4% compared with the previous 30 days.</small>
      </div>

      <div class="card schedule">
        <div class="card-head">
          <h3>Today's Schedule</h3>
          <span onclick="location.hash='calendar'">View Full Calendar →</span>
        </div>
        <div class="timeline">
          ${todayBookings.length > 0 ? todayBookings.map(b => `
            <div class="event" onclick="openBookingDetails('${b.id}')" style="cursor:pointer">
              <time>${b.startTime}</time>
              <span class="dot" style="background:${b.location === 'Studio A' ? 'var(--gold)' : b.location === 'Studio B' ? 'var(--purple)' : 'var(--green)'}"></span>
              <div>
                <strong>${b.title}</strong>
                <small>${b.client} · ${b.location} · ${b.photographer}</small>
              </div>
              <span class="badge ${b.status === 'Confirmed' ? 'green' : 'gold'}">${b.status}</span>
            </div>
          `).join("") : `<p class="muted" style="padding:15px 0">No sessions scheduled for today. <a href="#calendar" style="color:var(--gold)">Add one now →</a></p>`}
        </div>
        <button class="btn primary" style="width:100%;justify-content:center;margin-top:10px" data-action="new-booking">
          ${icon("plus")} Book New Session
        </button>
      </div>
    </div>

    <div class="bottom-grid">
      <div class="card">
        <div class="card-head">
          <h3>Recent Projects (${state.projects.length})</h3>
          <span onclick="location.hash='projects'">View All Projects →</span>
        </div>
        <div class="project-strip">
          ${state.projects.slice(0, 5).map(projectCard).join("")}
        </div>
      </div>

      <div class="card">
        <div class="card-head">
          <h3>AI Studio Recommendations</h3>
          <span>4 insights</span>
        </div>
        <div class="ai-list">
          <div class="ai-item" onclick="location.hash='photographers'" style="cursor:pointer">
            <span class="ai-mini" style="color:#55c58a">${icon("camera")}</span>
            <div>
              <strong>${state.photographers.filter(p=>p.status==='Available').length} of ${state.photographers.length} Photographers Ready</strong>
              <small>Click to view roster & assign sessions →</small>
            </div>
          </div>
          <div class="ai-item" onclick="location.hash='packages'" style="cursor:pointer">
            <span class="ai-mini" style="color:var(--gold)">${icon("package")}</span>
            <div>
              <strong>${state.packages.filter(p=>p.status==='Active').length} Active Packages Live</strong>
              <small>${[...new Set(state.packages.map(p=>p.category))].length} categories with ₹ pricing catalog →</small>
            </div>
          </div>
          <div class="ai-item">
            <span class="ai-mini">${icon("alert-circle")}</span>
            <div>
              <strong>${state.projects.filter(p=>p.status==='Shooting').length} active shoots in progress</strong>
              <small>Studio A equipment calibrated</small>
            </div>
          </div>
          <div class="ai-item">
            <span class="ai-mini">${icon("trending-up")}</span>
            <div>
              <strong>Wedding conversions up +24%</strong>
              <small>Lead: Armaan Khan · Wedding Classic & Premium</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 2. CLIENTS
function clients() {
  return pageHead(
    "Clients",
    `Manage ${state.clients.length} relationships across your entire studio.`,
    `<button class="btn" onclick="exportClientsCSV()">${icon("download")} Export</button>
     <button class="btn primary" data-action="new-client">${icon("plus")} Add Client</button>`
  ) + `
    <div class="card table-card">
      <div class="toolbar">
        <input class="input" id="clientSearch" placeholder="Search clients by name, email or company...">
        <select class="select" id="clientTypeFilter">
          <option value="">All Types</option>
          <option value="VIP">VIP</option>
          <option value="Business">Business</option>
          <option value="Regular">Regular</option>
          <option value="Lead">Lead</option>
        </select>
        <button class="btn" onclick="resetClientFilter()">${icon("rotate-ccw")} Reset</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>CLIENT</th>
            <th>EMAIL / PHONE</th>
            <th>PROJECTS</th>
            <th>TOTAL REVENUE</th>
            <th>LAST SESSION</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody id="clientRows">
          ${renderClientRows(state.clients)}
        </tbody>
      </table>
    </div>
  `;
}

function renderClientRows(list) {
  if (list.length === 0) {
    return `<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--muted)">No clients found. Click "+ Add Client" to create one.</td></tr>`;
  }
  return list.map(c => {
    const initials = c.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    return `
      <tr>
        <td>
          <div class="person">
            <span class="avatar">${initials}</span>
            <div>
              <strong>${c.name}</strong>
              <small>${c.company || "Direct Client"}</small>
            </div>
          </div>
        </td>
        <td>
          <div>${c.email}</div>
          <small class="muted">${c.phone || "—"}</small>
        </td>
        <td><strong>${c.projectsCount || 1}</strong></td>
        <td><strong>${c.totalRevenue || "₹0"}</strong></td>
        <td>${c.lastSession || "Just added"}</td>
        <td>
          <span class="badge ${c.type === 'VIP' ? 'gold' : c.type === 'Business' ? 'purple' : 'green'}">${c.type || 'Regular'}</span>
        </td>
        <td>
          <div style="display:flex;gap:4px">
            <button class="btn sm" onclick="openAction('new-booking', { client: '${c.name}' })" title="Book Session">${icon("calendar-plus")}</button>
            <button class="btn sm danger" onclick="deleteClient('${c.id}')" title="Delete Client">${icon("trash-2")}</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// 3. PROJECTS
function projects() {
  return pageHead(
    "Projects",
    `Track and manage ${state.projects.length} active and completed photography productions.`,
    `<button class="btn" onclick="filterProjects('all')">All</button>
     <button class="btn primary" data-action="new-project">${icon("plus")} New Project</button>`
  ) + `
    <div class="toolbar">
      <input class="input" id="projectSearch" placeholder="Search projects by name or client...">
      <select class="select" id="projectStatusFilter">
        <option value="">All Statuses</option>
        <option value="Planning">Planning</option>
        <option value="Booked">Booked</option>
        <option value="Shooting">Shooting</option>
        <option value="Editing">Editing</option>
        <option value="Review">Review</option>
        <option value="Completed">Completed</option>
      </select>
      <select class="select" id="projectTypeFilter">
        <option value="">All Types</option>
        <option value="Wedding">Wedding</option>
        <option value="Portrait">Portrait</option>
        <option value="Commercial">Commercial</option>
        <option value="Editorial">Editorial</option>
        <option value="Campaign">Campaign</option>
        <option value="Product">Product</option>
      </select>
    </div>
    <div class="grid3" id="projectsGrid">
      ${renderProjectCards(state.projects)}
    </div>
  `;
}

function renderProjectCards(list) {
  if (list.length === 0) {
    return `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted)">No projects match your filter. Click "+ New Project" to add one!</div>`;
  }
  return list.map(p => `
    <div class="card cover-card" style="cursor:pointer" onclick="openProjectDetails('${p.id}')">
      ${projectCard(p)}
    </div>
  `).join("");
}

// 4. BOOKINGS
function bookings() {
  return pageHead(
    "Bookings",
    `Manage upcoming studio sessions, locations and photographer schedules.`,
    `<button class="btn" onclick="location.hash='calendar'"><i data-lucide="calendar"></i> Calendar View</button>
     <button class="btn primary" data-action="new-booking">${icon("plus")} New Booking</button>`
  ) + `
    <div class="card table-card">
      <div class="toolbar">
        <input class="input" id="bookingSearch" placeholder="Search sessions by client, title or location...">
        <select class="select" id="bookingLocationFilter">
          <option value="">All Studios & Rooms</option>
          <option value="Studio A">Studio A</option>
          <option value="Studio B">Studio B</option>
          <option value="Edit Suite">Edit Suite</option>
          <option value="Outdoor">Outdoor</option>
        </select>
        <select class="select" id="bookingStatusFilter">
          <option value="">All Statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>DATE & TIME</th>
            <th>SESSION / CLIENT</th>
            <th>TYPE</th>
            <th>PHOTOGRAPHER</th>
            <th>LOCATION</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody id="bookingRows">
          ${renderBookingRows(state.bookings)}
        </tbody>
      </table>
    </div>
  `;
}

function renderBookingRows(list) {
  if (list.length === 0) {
    return `<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--muted)">No bookings found. Click "+ New Booking" to schedule a session.</td></tr>`;
  }
  return list.map(b => `
    <tr>
      <td>
        <strong>${b.date}</strong>
        <div class="muted" style="font-family:'DM Mono',monospace;font-size:10px">${b.startTime} - ${b.endTime}</div>
      </td>
      <td>
        <strong>${b.title}</strong>
        <small class="muted" style="display:block">${b.client}</small>
      </td>
      <td>${b.type}</td>
      <td>
        <div class="person">
          <span class="avatar sm">${b.photographer.split(" ").map(w=>w[0]).join("")}</span>
          <span>${b.photographer}</span>
        </div>
      </td>
      <td>
        <span class="badge ${b.location==='Studio A'?'gold':b.location==='Studio B'?'purple':b.location==='Edit Suite'?'green':'blue'}">
          ${b.location}
        </span>
      </td>
      <td>
        <span class="badge ${b.status==='Confirmed'?'green':b.status==='Completed'?'blue':'gold'}">${b.status}</span>
      </td>
      <td>
        <div style="display:flex;gap:4px">
          <button class="btn sm" onclick="openBookingDetails('${b.id}')" title="View details">${icon("eye")}</button>
          <button class="btn sm danger" onclick="deleteBooking('${b.id}')" title="Cancel & Delete">${icon("trash-2")}</button>
        </div>
      </td>
    </tr>
  `).join("");
}

// --------------------------------------------------------------------------
// 5. DYNAMIC INTERACTIVE CALENDAR SYSTEM (HIGHLY ENHANCED)
// --------------------------------------------------------------------------

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function calendar() {
  const cal = state.calendar;
  const currentMonthName = MONTH_NAMES[cal.month];
  const currentYear = cal.year;

  return `
    <div class="calendar-page-layout">
      ${pageHead(
        "Studio Calendar",
        "Interactive schedule for studio rooms, photo shoots, and creative production.",
        `<button class="btn primary" data-action="new-booking">${icon("plus")} New Booking</button>`
      )}

      <!-- Calendar Header Navigation & Filters -->
      <div class="cal-header-bar">
        <div class="cal-nav-group">
          <button class="btn sm" onclick="calPrev()">${icon("chevron-left")}</button>
          <div class="cal-current-title" id="calTitle">${currentMonthName} ${currentYear}</div>
          <button class="btn sm" onclick="calNext()">${icon("chevron-right")}</button>
          <button class="btn sm" onclick="calToday()">${icon("calendar")} Today</button>
        </div>

        <div class="cal-view-group">
          <button class="cal-view-btn ${cal.view === 'month' ? 'active' : ''}" onclick="setCalView('month')">Month</button>
          <button class="cal-view-btn ${cal.view === 'week' ? 'active' : ''}" onclick="setCalView('week')">Week</button>
          <button class="cal-view-btn ${cal.view === 'day' ? 'active' : ''}" onclick="setCalView('day')">Day</button>
        </div>

        <div class="cal-filter-group">
          <span class="muted" style="font-size:10px">Room:</span>
          <button class="cal-filter-chip ${cal.locationFilter === 'all' ? 'active' : ''}" onclick="setCalLocationFilter('all')">
            <span class="chip-dot" style="background:#fff"></span> All
          </button>
          <button class="cal-filter-chip ${cal.locationFilter === 'Studio A' ? 'active' : ''}" onclick="setCalLocationFilter('Studio A')">
            <span class="chip-dot" style="background:var(--gold)"></span> Studio A
          </button>
          <button class="cal-filter-chip ${cal.locationFilter === 'Studio B' ? 'active' : ''}" onclick="setCalLocationFilter('Studio B')">
            <span class="chip-dot" style="background:var(--purple)"></span> Studio B
          </button>
          <button class="cal-filter-chip ${cal.locationFilter === 'Edit Suite' ? 'active' : ''}" onclick="setCalLocationFilter('Edit Suite')">
            <span class="chip-dot" style="background:var(--green)"></span> Edit Suite
          </button>
          <button class="cal-filter-chip ${cal.locationFilter === 'Outdoor' ? 'active' : ''}" onclick="setCalLocationFilter('Outdoor')">
            <span class="chip-dot" style="background:var(--blue)"></span> Outdoor
          </button>
        </div>
      </div>

      <!-- Main Calendar Grid with Interactive Left Sidebar -->
      <div class="calendar-wrap">
        <!-- Interactive Mini Calendar on Left -->
        <div class="card mini-calendar">
          <div class="mini-cal-header">
            <strong>${currentMonthName} ${currentYear}</strong>
            <div style="display:flex;gap:4px">
              <button class="icon-btn" style="width:24px;height:24px" onclick="calPrev()">${icon("chevron-left")}</button>
              <button class="icon-btn" style="width:24px;height:24px" onclick="calNext()">${icon("chevron-right")}</button>
            </div>
          </div>

          <div class="mini-cal-grid">
            <div class="mini-cal-day-head">M</div>
            <div class="mini-cal-day-head">T</div>
            <div class="mini-cal-day-head">W</div>
            <div class="mini-cal-day-head">T</div>
            <div class="mini-cal-day-head">F</div>
            <div class="mini-cal-day-head">S</div>
            <div class="mini-cal-day-head">S</div>
            ${renderMiniCalendarDays(cal.year, cal.month)}
          </div>

          <div class="mini-cal-day-events">
            <h4>Sessions on ${formatDateFriendly(cal.selectedDate)}</h4>
            <div id="miniCalEventsList">
              ${renderMiniCalendarEvents(cal.selectedDate)}
            </div>
            <button class="btn sm primary" style="width:100%;margin-top:8px" onclick="openAction('new-booking', { date: '${cal.selectedDate}' })">
              ${icon("plus")} Add Session for this Date
            </button>
          </div>
        </div>

        <!-- Dynamic Main Board (Month / Week / Day view) -->
        <div class="card cal-month-board" id="mainCalBoard">
          ${cal.view === 'month' ? renderMonthView(cal.year, cal.month) : cal.view === 'week' ? renderWeekView(cal.selectedDate) : renderDayView(cal.selectedDate)}
        </div>
      </div>
    </div>
  `;
}

function formatDateFriendly(dateStr) {
  if (!dateStr) return "Today";
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Generate Month View Calendar Grid
function renderMonthView(year, month) {
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...
  // Convert so Monday is 0, Sunday is 6
  const startDay = (firstDayIndex + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  let cellsHtml = "";
  const locationFilter = state.calendar.locationFilter;

  // Previous month padding cells
  for (let i = startDay - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    cellsHtml += renderDayCell(dateStr, dayNum, true);
  }

  // Current month cells
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cellsHtml += renderDayCell(dateStr, day, false);
  }

  // Next month padding cells to complete 35 or 42 grid cells
  const totalRendered = startDay + daysInMonth;
  const totalSlots = totalRendered > 35 ? 42 : 35;
  const nextMonthPadding = totalSlots - totalRendered;
  for (let day = 1; day <= nextMonthPadding; day++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cellsHtml += renderDayCell(dateStr, day, true);
  }

  return `
    <div class="cal-weekdays-bar">
      <div class="cal-weekday-col">Mon</div>
      <div class="cal-weekday-col">Tue</div>
      <div class="cal-weekday-col">Wed</div>
      <div class="cal-weekday-col">Thu</div>
      <div class="cal-weekday-col">Fri</div>
      <div class="cal-weekday-col">Sat</div>
      <div class="cal-weekday-col">Sun</div>
    </div>
    <div class="cal-month-grid">
      ${cellsHtml}
    </div>
  `;
}

function renderDayCell(dateStr, dayNum, isOtherMonth) {
  const cal = state.calendar;
  const isToday = dateStr === "2026-08-24";
  const isSelected = dateStr === cal.selectedDate;
  
  // Filter bookings for this date
  let dayBookings = state.bookings.filter(b => b.date === dateStr);
  if (cal.locationFilter !== 'all') {
    dayBookings = dayBookings.filter(b => b.location === cal.locationFilter);
  }

  return `
    <div class="cal-day-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected-day' : ''}" 
         onclick="handleDayCellClick(event, '${dateStr}')">
      <div class="cal-day-top">
        <span class="cal-date-number">${dayNum}</span>
        <button class="cal-cell-add-btn" onclick="event.stopPropagation(); openAction('new-booking', { date: '${dateStr}' })" title="Add Booking for this date">+</button>
      </div>
      <div class="cal-events-container">
        ${dayBookings.slice(0, 3).map(b => {
          const roomClass = b.location === 'Studio A' ? 'studio-a' : b.location === 'Studio B' ? 'studio-b' : b.location === 'Edit Suite' ? 'edit-suite' : 'outdoor';
          return `
            <div class="cal-event-pill ${roomClass}" onclick="event.stopPropagation(); openBookingDetails('${b.id}')" title="${b.title} (${b.startTime} - ${b.endTime})">
              <span class="event-time">${b.startTime}</span>
              <span class="event-title">${b.title}</span>
            </div>
          `;
        }).join("")}
        ${dayBookings.length > 3 ? `<div class="cal-more-pill">+${dayBookings.length - 3} more</div>` : ""}
      </div>
    </div>
  `;
}

// Generate Mini Calendar Days
function renderMiniCalendarDays(year, month) {
  const firstDayIndex = new Date(year, month, 1).getDay();
  const startDay = (firstDayIndex + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  let html = "";

  // Prev month padding
  for (let i = startDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    html += `<div class="mini-cal-cell other-month" onclick="selectCalendarDate('${dateStr}')">${day}</div>`;
  }

  // Current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = dateStr === "2026-08-24";
    const isSelected = dateStr === state.calendar.selectedDate;
    const hasEvents = state.bookings.some(b => b.date === dateStr);

    html += `
      <div class="mini-cal-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" onclick="selectCalendarDate('${dateStr}')">
        <span>${day}</span>
        ${hasEvents ? '<span class="mini-dot"></span>' : ''}
      </div>
    `;
  }

  return html;
}

function renderMiniCalendarEvents(dateStr) {
  const events = state.bookings.filter(b => b.date === dateStr);
  if (events.length === 0) {
    return `<div style="font-size:10px;color:var(--muted);padding:8px 0">No sessions scheduled for this date.</div>`;
  }
  return events.map(b => `
    <div class="mini-event-item" onclick="openBookingDetails('${b.id}')" style="border-left-color:${b.location === 'Studio A' ? 'var(--gold)' : b.location === 'Studio B' ? 'var(--purple)' : 'var(--green)'}">
      <strong>${b.title}</strong>
      <small>${b.startTime} - ${b.endTime} · ${b.location}</small>
    </div>
  `).join("");
}

// Generate Week View
function renderWeekView(selectedDateStr) {
  const baseDate = selectedDateStr ? new Date(selectedDateStr) : new Date(2026, 7, 24);
  const dayOfWeek = (baseDate.getDay() + 6) % 7; // Monday is 0
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - dayOfWeek);

  let weekColsHtml = "";
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    const dateStr = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayDate.getDate()).padStart(2, '0')}`;
    const dayName = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][i];
    const isToday = dateStr === "2026-08-24";
    
    let dayEvents = state.bookings.filter(b => b.date === dateStr);
    if (state.calendar.locationFilter !== 'all') {
      dayEvents = dayEvents.filter(b => b.location === state.calendar.locationFilter);
    }

    weekColsHtml += `
      <div class="cal-week-col ${isToday ? 'today' : ''}" onclick="selectCalendarDate('${dateStr}')">
        <div class="cal-week-col-head">
          <small>${dayName}</small>
          <strong>${dayDate.getDate()}</strong>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;flex:1">
          ${dayEvents.map(b => `
            <div class="cal-week-card" onclick="event.stopPropagation(); openBookingDetails('${b.id}')">
              <span class="time-tag">${b.startTime} - ${b.endTime}</span>
              <strong>${b.title}</strong>
              <small>${b.location} · ${b.photographer}</small>
              <div style="margin-top:6px">
                <span class="badge ${b.status === 'Confirmed' ? 'green' : 'gold'}">${b.status}</span>
              </div>
            </div>
          `).join("")}
          <button class="btn sm" style="margin-top:auto;width:100%;justify-content:center" onclick="event.stopPropagation(); openAction('new-booking', { date: '${dateStr}' })">
            ${icon("plus")} Add
          </button>
        </div>
      </div>
    `;
  }

  return `
    <div class="cal-week-board">
      <div class="cal-week-grid">
        ${weekColsHtml}
      </div>
    </div>
  `;
}

// Generate Day View Timeline
function renderDayView(selectedDateStr) {
  const dateStr = selectedDateStr || "2026-08-24";
  const events = state.bookings.filter(b => b.date === dateStr);
  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

  return `
    <div class="cal-day-board">
      <div style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <h3 style="font-size:15px;margin:0">${formatDateFriendly(dateStr)}</h3>
          <p class="muted" style="margin:2px 0 0;font-size:10px">${events.length} sessions booked for this day</p>
        </div>
        <button class="btn primary sm" onclick="openAction('new-booking', { date: '${dateStr}' })">${icon("plus")} Add Session</button>
      </div>
      <div class="cal-day-timeline">
        ${hours.map(h => {
          const matching = events.filter(e => e.startTime.startsWith(h.slice(0, 2)));
          return `
            <div class="cal-hour-row">
              <span class="cal-hour-label">${h}</span>
              <div class="cal-hour-slot ${matching.length > 0 ? 'has-booking' : ''}" onclick="${matching.length > 0 ? `openBookingDetails('${matching[0].id}')` : `openAction('new-booking', { date: '${dateStr}', startTime: '${h}' })`}">
                ${matching.length > 0 ? matching.map(m => `
                  <div style="display:flex;align-items:center;gap:10px;width:100%">
                    <span class="badge ${m.location==='Studio A'?'gold':m.location==='Studio B'?'purple':'green'}">${m.location}</span>
                    <div>
                      <strong>${m.title}</strong>
                      <small class="muted" style="margin-left:8px">${m.startTime} - ${m.endTime} · ${m.photographer}</small>
                    </div>
                    <span class="badge ${m.status==='Confirmed'?'green':'gold'}" style="margin-left:auto">${m.status}</span>
                  </div>
                `).join("") : `<span class="muted" style="font-size:10px">+ Available — Click to book session at ${h}</span>`}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

// Calendar Interaction Handlers
function handleDayCellClick(e, dateStr) {
  selectCalendarDate(dateStr);
}

function selectCalendarDate(dateStr) {
  state.calendar.selectedDate = dateStr;
  const [y, m] = dateStr.split("-").map(Number);
  state.calendar.year = y;
  state.calendar.month = m - 1;
  saveState();
  if (location.hash === '#calendar' || location.hash === '') {
    render('calendar');
  }
}

function calPrev() {
  if (state.calendar.view === 'month') {
    if (state.calendar.month === 0) {
      state.calendar.month = 11;
      state.calendar.year--;
    } else {
      state.calendar.month--;
    }
  } else {
    // Shift week or day
    const cur = new Date(state.calendar.selectedDate);
    cur.setDate(cur.getDate() - (state.calendar.view === 'week' ? 7 : 1));
    state.calendar.selectedDate = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
    state.calendar.year = cur.getFullYear();
    state.calendar.month = cur.getMonth();
  }
  saveState();
  render('calendar');
}

function calNext() {
  if (state.calendar.view === 'month') {
    if (state.calendar.month === 11) {
      state.calendar.month = 0;
      state.calendar.year++;
    } else {
      state.calendar.month++;
    }
  } else {
    // Shift week or day
    const cur = new Date(state.calendar.selectedDate);
    cur.setDate(cur.getDate() + (state.calendar.view === 'week' ? 7 : 1));
    state.calendar.selectedDate = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
    state.calendar.year = cur.getFullYear();
    state.calendar.month = cur.getMonth();
  }
  saveState();
  render('calendar');
}

function calToday() {
  state.calendar.year = 2026;
  state.calendar.month = 7;
  state.calendar.selectedDate = "2026-08-24";
  saveState();
  render('calendar');
}

function setCalView(view) {
  state.calendar.view = view;
  saveState();
  render('calendar');
}

function setCalLocationFilter(loc) {
  state.calendar.locationFilter = loc;
  saveState();
  render('calendar');
}

// 6. GALLERY
function gallery() {
  return pageHead(
    "Gallery",
    `Visual production library with ${state.gallery.length} albums & creative media.`,
    `<button class="btn" onclick="openAction('new-gallery')">${icon("upload")} Upload</button>
     <button class="btn primary" data-action="new-gallery">${icon("plus")} New Gallery</button>`
  ) + `
    <div class="toolbar">
      <input class="input" id="gallerySearch" placeholder="Search gallery by title, category or client...">
      <button class="btn active" onclick="filterGallery('All', this)">All</button>
      <button class="btn" onclick="filterGallery('Published', this)">Published</button>
      <button class="btn" onclick="filterGallery('Client Review', this)">Client Review</button>
      <button class="btn" onclick="filterGallery('Private', this)">Private</button>
    </div>
    <div class="photo-grid" id="galleryGrid">
      ${renderGalleryPhotos(state.gallery)}
    </div>
  `;
}

function renderGalleryPhotos(list) {
  if (list.length === 0) {
    return `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted)">No gallery photos found. Click "+ New Gallery" to upload!</div>`;
  }
  return list.map(item => `
    <div class="photo" style="background-image:url('${item.img}')" onclick="openPhotoDetails('${item.id}')">
      <div class="photo-info">
        <span>${item.title}</span>
        <b>${'★'.repeat(item.rating || 5)}</b>
      </div>
    </div>
  `).join("");
}

// 7. PHOTOGRAPHERS TEAM
function photographers() {
  const total = state.photographers.length;
  const available = state.photographers.filter(p => p.status === 'Available').length;
  const busy = state.photographers.filter(p => p.status === 'Busy').length;
  const onLeave = state.photographers.filter(p => p.status === 'On Leave').length;

  return pageHead(
    "Photographers Team",
    "Manage your studio's photography professionals.",
    `<button class="btn" onclick="exportPhotographersCSV()">${icon("download")} Export Team</button>
     <button class="btn primary" data-action="new-photographer">${icon("user-plus")} Add Photographer</button>`
  ) + `
    <div class="kpis" style="margin-bottom:20px">
      <div class="card stat">
        <div class="stat-top">
          <span class="stat-icon">${icon("camera")}</span>
          <span class="muted">Studio Roster</span>
        </div>
        <h2>${total}</h2>
        <p>Total Photographers</p>
      </div>
      <div class="card stat">
        <div class="stat-top">
          <span class="stat-icon" style="color:#55c58a">${icon("check-circle-2")}</span>
          <span class="green">Ready for Booking</span>
        </div>
        <h2 style="color:#55c58a">${available}</h2>
        <p>Available</p>
      </div>
      <div class="card stat">
        <div class="stat-top">
          <span class="stat-icon" style="color:#e5b45c">${icon("clock")}</span>
          <span class="gold">On Assignment</span>
        </div>
        <h2 style="color:#e5b45c">${busy}</h2>
        <p>Busy / Assigned</p>
      </div>
      <div class="card stat">
        <div class="stat-top">
          <span class="stat-icon" style="color:#e87979">${icon("calendar-off")}</span>
          <span class="red">Unavailable</span>
        </div>
        <h2 style="color:#e87979">${onLeave}</h2>
        <p>On Leave</p>
      </div>
    </div>

    <div class="card table-card" style="margin-bottom:16px">
      <div class="toolbar" style="flex-wrap:wrap">
        <input class="input" id="photographerSearch" placeholder="Search photographers by name, role, specialization, email..." style="min-width:260px;flex:1">
        <select class="select" id="photographerStatusFilter" style="min-width:140px">
          <option value="">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Busy">Busy</option>
          <option value="On Leave">On Leave</option>
        </select>
        <select class="select" id="photographerSpecFilter" style="min-width:160px">
          <option value="">All Specializations</option>
          <option value="Wedding Photographer">Wedding Photographer</option>
          <option value="Portrait Photographer">Portrait Photographer</option>
          <option value="Event Photographer">Event Photographer</option>
          <option value="Product Photographer">Product Photographer</option>
          <option value="Cinematic Photographer">Cinematic Photographer</option>
          <option value="Fashion Photographer">Fashion Photographer</option>
          <option value="Studio Lead & Commercial">Studio Lead & Commercial</option>
          <option value="Pre-Wedding & Drone">Pre-Wedding & Drone</option>
        </select>
        <button class="btn" onclick="resetPhotographerFilter()">${icon("rotate-ccw")} Reset</button>
      </div>
    </div>

    <div class="photographers-grid" id="photographersGrid">
      ${renderPhotographerCards(state.photographers)}
    </div>
  `;
}

function renderPhotographerCards(list) {
  if (list.length === 0) {
    return `<div style="grid-column:1/-1;text-align:center;padding:48px 20px;color:var(--muted);background:var(--panel);border:1px dashed var(--line);border-radius:var(--radius)">
      <div style="font-size:32px;margin-bottom:8px">📷</div>
      <h3 style="color:var(--text-bright);margin-bottom:4px">No photographers found</h3>
      <p style="font-size:12px;margin-bottom:14px">Try adjusting your search query or availability filter.</p>
      <button class="btn primary" onclick="openAction('new-photographer')">${icon("plus")} Add New Photographer</button>
    </div>`;
  }
  return list.map(ph => {
    const statusClass = ph.status === 'Available' ? 'available' : ph.status === 'Busy' ? 'busy' : 'leave';
    const assignedCount = ph.assignedProjectsCount || (ph.completedProjects ? ph.completedProjects.length : 0) || 1;
    const ratingFormatted = Number(ph.rating || 5.0).toFixed(1);

    return `
      <div class="photographer-card" data-photographer-id="${ph.id}">
        <div class="photographer-card-top">
          <div class="photographer-avatar-wrap">
            <img class="photographer-avatar" src="${ph.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}" alt="${ph.name}" onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'">
            <span class="status-indicator-dot ${statusClass}" title="${ph.status}"></span>
          </div>
          <div class="photographer-meta">
            <h3>${ph.name}</h3>
            <div class="photographer-spec">
              ${icon("camera")}
              <span>${ph.role || ph.specialization}</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;margin-top:4px">
              <span class="badge ${statusClass}">${ph.status}</span>
              <span style="font-size:11px;color:var(--gold);display:flex;align-items:center;gap:2px">
                ★ <strong>${ratingFormatted}</strong>
              </span>
            </div>
          </div>
        </div>

        <div class="photographer-contact-row">
          <div>${icon("phone")} <a href="tel:${ph.phone}" style="color:inherit;text-decoration:none">${ph.phone}</a></div>
          <div>${icon("mail")} <a href="mailto:${ph.email}" style="color:inherit;text-decoration:none">${ph.email}</a></div>
          <div>${icon("map-pin")} <span>${ph.location || 'Mumbai'} · ${ph.experience || '5+ Years'} Exp</span></div>
        </div>

        <div class="photographer-stats-row">
          <div>
            <small>Experience</small>
            <strong>${ph.experience || '5+ Years'}</strong>
          </div>
          <div>
            <small>Assigned</small>
            <strong>${assignedCount} Projects</strong>
          </div>
          <div>
            <small>Rating</small>
            <strong class="gold">★ ${ratingFormatted}</strong>
          </div>
        </div>

        ${ph.currentAssignment && ph.currentAssignment !== 'Available for booking' ? `
          <div class="current-assignment-pill">
            <span>Assignment:</span>
            <strong>${ph.currentAssignment}</strong>
          </div>
        ` : ''}

        <div class="skills-tags-wrap">
          ${(ph.skills || [ph.specialization, "Lighting", "Editing"]).slice(0, 3).map(sk => `<span class="skill-tag">${sk}</span>`).join("")}
        </div>

        <div class="photographer-actions">
          <button class="btn sm" onclick="openPhotographerProfile('${ph.id}')" title="View Full Profile">
            ${icon("eye")} View
          </button>
          <button class="btn sm" onclick="openEditPhotographer('${ph.id}')" title="Edit Photographer">
            ${icon("edit-3")} Edit
          </button>
          <button class="btn sm danger" onclick="deletePhotographer('${ph.id}')" title="Delete Photographer">
            ${icon("trash-2")} Delete
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function resetPhotographerFilter() {
  const phSearch = $("#photographerSearch");
  const phStatus = $("#photographerStatusFilter");
  const phSpec = $("#photographerSpecFilter");
  if (phSearch) phSearch.value = "";
  if (phStatus) phStatus.value = "";
  if (phSpec) phSpec.value = "";
  const grid = $("#photographersGrid");
  if (grid) grid.innerHTML = renderPhotographerCards(state.photographers);
  initIcons();
}

function exportPhotographersCSV() {
  let csv = "Name,Role,Specialization,Email,Phone,Location,Experience,Status,Rating,Assigned Projects\n";
  state.photographers.forEach(p => {
    csv += `"${p.name}","${p.role || p.specialization}","${p.specialization}","${p.email}","${p.phone}","${p.location}","${p.experience}","${p.status}","${p.rating}","${p.assignedProjectsCount || 0}"\n`;
  });
  downloadFile("frame_ai_photographers_team.csv", csv);
  toast("Team Exported", "Photographer team roster downloaded as CSV.");
}

// 8. PACKAGES & RATES
let activePackageCategory = "All";

function packages() {
  const total = state.packages.length;
  const active = state.packages.filter(p => p.status === 'Active').length;
  const categories = [...new Set(state.packages.map(p => p.category))];
  const avgPrice = Math.round(state.packages.reduce((sum, p) => sum + (p.price || 0), 0) / (total || 1));

  return pageHead(
    "Packages & Rates",
    "Manage photography services, packages and pricing.",
    `<button class="btn" onclick="exportPackagesCSV()">${icon("download")} Export Rates</button>
     <button class="btn primary" data-action="new-package">${icon("package-plus")} Add Package</button>`
  ) + `
    <div class="kpis" style="margin-bottom:20px">
      <div class="card stat">
        <div class="stat-top">
          <span class="stat-icon">${icon("package")}</span>
          <span class="muted">Offerings</span>
        </div>
        <h2>${total}</h2>
        <p>Total Packages</p>
      </div>
      <div class="card stat">
        <div class="stat-top">
          <span class="stat-icon" style="color:#55c58a">${icon("check-circle")}</span>
          <span class="green">Published</span>
        </div>
        <h2 style="color:#55c58a">${active}</h2>
        <p>Active Packages</p>
      </div>
      <div class="card stat">
        <div class="stat-top">
          <span class="stat-icon" style="color:var(--gold)">${icon("wallet-cards")}</span>
          <span class="gold">Average Rate</span>
        </div>
        <h2 style="color:var(--gold)">₹${avgPrice.toLocaleString('en-IN')}</h2>
        <p>Avg. Starting Price</p>
      </div>
      <div class="card stat">
        <div class="stat-top">
          <span class="stat-icon" style="color:var(--purple)">${icon("layers-3")}</span>
          <span class="purple">Coverage Types</span>
        </div>
        <h2 style="color:var(--purple)">${categories.length}</h2>
        <p>Categories</p>
      </div>
    </div>

    <div class="card table-card" style="margin-bottom:16px">
      <div class="toolbar" style="flex-wrap:wrap">
        <input class="input" id="packageSearch" placeholder="Search packages by name, category, deliverables..." style="min-width:240px;flex:1">
        <div style="display:flex;gap:4px;flex-wrap:wrap" id="packageCategoryTabs">
          <button class="btn ${activePackageCategory === 'All' ? 'active' : ''}" onclick="filterPackageCategory('All', this)">All</button>
          <button class="btn ${activePackageCategory === 'Wedding' ? 'active' : ''}" onclick="filterPackageCategory('Wedding', this)">Wedding</button>
          <button class="btn ${activePackageCategory === 'Portrait' ? 'active' : ''}" onclick="filterPackageCategory('Portrait', this)">Portrait</button>
          <button class="btn ${activePackageCategory === 'Event' ? 'active' : ''}" onclick="filterPackageCategory('Event', this)">Event</button>
          <button class="btn ${activePackageCategory === 'Product' ? 'active' : ''}" onclick="filterPackageCategory('Product', this)">Product</button>
          <button class="btn ${activePackageCategory === 'Fashion' ? 'active' : ''}" onclick="filterPackageCategory('Fashion', this)">Fashion</button>
          <button class="btn ${activePackageCategory === 'Pre-Wedding' ? 'active' : ''}" onclick="filterPackageCategory('Pre-Wedding', this)">Pre-Wedding</button>
        </div>
        <select class="select" id="packageStatusFilter" style="width:130px">
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>

    <div class="packages-grid" id="packagesGrid">
      ${renderPackageCards(getPackageList())}
    </div>
  `;
}

function getPackageList() {
  return state.packages.filter(pkg => {
    const matchesCategory = activePackageCategory === "All" || pkg.category === activePackageCategory;
    return matchesCategory;
  });
}

function renderPackageCards(list) {
  if (list.length === 0) {
    return `<div style="grid-column:1/-1;text-align:center;padding:48px 20px;color:var(--muted);background:var(--panel);border:1px dashed var(--line);border-radius:var(--radius)">
      <div style="font-size:32px;margin-bottom:8px">📦</div>
      <h3 style="color:var(--text-bright);margin-bottom:4px">No packages found</h3>
      <p style="font-size:12px;margin-bottom:14px">Try selecting a different category or adjusting search.</p>
      <button class="btn primary" onclick="openAction('new-package')">${icon("plus")} Add New Package</button>
    </div>`;
  }
  return list.map(pkg => {
    const deliverables = Array.isArray(pkg.deliverables) ? pkg.deliverables : (pkg.deliverables || "").split("\n").filter(Boolean);
    const formattedPrice = pkg.priceFormatted || ("₹" + Number(pkg.price || 0).toLocaleString('en-IN'));

    return `
      <div class="package-card ${pkg.popular ? 'popular' : ''}" data-package-id="${pkg.id}">
        ${pkg.popular ? `<div class="popular-badge">★ POPULAR CHOICE</div>` : ''}
        
        <div>
          <span class="package-category-pill">${pkg.category || 'Package'}</span>
          <h3 class="package-title">${pkg.name}</h3>
          <p class="package-desc">${pkg.description || 'Professional studio photography package.'}</p>
        </div>

        <div class="package-price-wrap">
          <div>
            <small style="font-size:10px;color:var(--dim);text-transform:uppercase;letter-spacing:0.05em">Starting at</small>
            <div class="package-price">${formattedPrice}</div>
          </div>
          <div class="package-duration">
            ${icon("clock")} ${pkg.duration || 'Full Session'}
          </div>
        </div>

        <div class="package-inclusions-pills">
          <span class="inc-pill active">
            ${icon("camera")} ${pkg.photographersCount || 1} ${pkg.photographersCount === 1 ? 'Photographer' : 'Photographers'}
          </span>
          <span class="inc-pill active">
            ${icon("image")} ${pkg.editedPhotosCount || 50} Edited Photos
          </span>
          ${pkg.videoIncluded ? `<span class="inc-pill active">${icon("video")} Video</span>` : ''}
          ${pkg.droneCoverage ? `<span class="inc-pill active">${icon("send")} Drone</span>` : ''}
          ${pkg.albumIncluded ? `<span class="inc-pill active">${icon("book-open")} Album</span>` : ''}
        </div>

        <div class="package-deliverables-list">
          ${deliverables.slice(0, 5).map(item => `
            <div class="deliverable-item">
              ${icon("check")}
              <span>${item}</span>
            </div>
          `).join("")}
          ${deliverables.length > 5 ? `<div style="font-size:11px;color:var(--gold);padding-left:22px">+ ${deliverables.length - 5} more deliverables</div>` : ''}
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:6px;border-top:1px solid var(--line)">
          <span class="badge ${pkg.status === 'Active' ? 'green' : 'gold'}">${pkg.status || 'Active'}</span>
          <small class="muted">${deliverables.length} Deliverables</small>
        </div>

        <div class="package-actions">
          <button class="btn sm primary" onclick="openPackageDetails('${pkg.id}')" title="View Details & Book">
            ${icon("eye")} View Details
          </button>
          <button class="btn sm" onclick="openEditPackage('${pkg.id}')" title="Edit Package">
            ${icon("edit-3")} Edit
          </button>
          <button class="btn sm danger" onclick="deletePackage('${pkg.id}')" title="Delete Package">
            ${icon("trash-2")}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function filterPackageCategory(cat, btn) {
  activePackageCategory = cat;
  $$("#packageCategoryTabs button").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  const q = ($("#packageSearch") ? $("#packageSearch").value : "").toLowerCase().trim();
  const st = $("#packageStatusFilter") ? $("#packageStatusFilter").value : "";
  const filtered = state.packages.filter(pkg => {
    const matchesCat = cat === "All" || pkg.category === cat;
    const matchesQ = !q || 
      pkg.name.toLowerCase().includes(q) || 
      pkg.category.toLowerCase().includes(q) || 
      (pkg.description && pkg.description.toLowerCase().includes(q));
    const matchesStatus = !st || pkg.status === st;
    return matchesCat && matchesQ && matchesStatus;
  });
  const grid = $("#packagesGrid");
  if (grid) grid.innerHTML = renderPackageCards(filtered);
  initIcons();
}

function exportPackagesCSV() {
  let csv = "Package Name,Category,Price,Duration,Photographers,Edited Photos,Status,Description\n";
  state.packages.forEach(p => {
    csv += `"${p.name}","${p.category}","${p.price}","${p.duration}","${p.photographersCount}","${p.editedPhotosCount}","${p.status}","${(p.description || '').replace(/"/g, '""')}"\n`;
  });
  downloadFile("frame_ai_packages_rates.csv", csv);
  toast("Packages Exported", "Packages and pricing catalog downloaded as CSV.");
}

// 9. AI EDITING (WITH INTERACTIVE REAL-TIME SLIDERS & SPLIT PREVIEW)
function editing() {
  return pageHead(
    "AI Editing Suite",
    "Real-time neural retoucher and portrait enhancement engine.",
    `<button class="btn" onclick="resetEditor()">${icon("rotate-ccw")} Reset</button>
     <button class="btn" onclick="toast('Preset Saved', 'Saved as Studio Gold Signature Preset')">${icon("save")} Save Preset</button>
     <button class="btn primary" data-action="ai-process">${icon("wand-sparkles")} Generate Neural Preview</button>`
  ) + `
    <div class="editor">
      <aside class="tool-side">
        ${["crop", "sun", "contrast", "sun-medium", "cloud-sun", "thermometer", "droplets", "sparkles", "scan-face", "image", "palette"].map((n, i) => `
          <button class="tool-btn ${i === 1 ? 'active' : ''}" onclick="switchEditorTool(this, '${["Crop","Exposure","Contrast","Highlights","Shadows","Temperature","Tint","Clarity","Skin","Background","Color"][i]}')">
            ${icon(n)}
            <span>${["Crop","Exposure","Contrast","Highlights","Shadows","Temperature","Tint","Clarity","Skin","Background","Color"][i]}</span>
          </button>
        `).join("")}
      </aside>

      <div class="editor-stage">
        <div class="portrait" id="portraitPreview" style="background-image:url('${PRESET_IMGS[4]}')">
          <div class="portrait-before" id="portraitBefore" style="background-image:url('${PRESET_IMGS[4]}')"></div>
          <span class="before">BEFORE</span>
          <span class="after">AFTER (AI)</span>
          <div class="divider" id="portraitDivider"></div>
          <div class="handle" id="portraitHandle">↔</div>
        </div>
      </div>

      <aside class="control-side">
        <div class="control-section">
          <h4>AI ENHANCEMENT</h4>
          <div class="range-row">
            <label><span>Neural Intensity</span><span id="intensityVal">75%</span></label>
            <input type="range" class="slider-input" min="0" max="100" value="75" oninput="updateEditorSlider('intensity', this.value)">
          </div>
          <div class="range-row">
            <label><span>Skin Refinement</span><span id="skinVal">80%</span></label>
            <input type="range" class="slider-input" min="0" max="100" value="80" oninput="updateEditorSlider('skin', this.value)">
          </div>
          ${["Face Relighting", "Background Clean", "Color Harmony", "Noise Reduction"].map(x => `
            <div class="switch on" onclick="this.classList.toggle('on'); updateImageFilters();">
              <span>${x}</span>
              <i></i>
            </div>
          `).join("")}
        </div>

        <div class="control-section">
          <h4>LIGHTING & COLOR</h4>
          <div class="range-row">
            <label><span>Exposure</span><span id="exposureVal">+0.3 EV</span></label>
            <input type="range" class="slider-input" min="-100" max="100" value="30" oninput="updateEditorSlider('exposure', this.value)">
          </div>
          <div class="range-row">
            <label><span>Contrast</span><span id="contrastVal">+12</span></label>
            <input type="range" class="slider-input" min="-50" max="50" value="12" oninput="updateEditorSlider('contrast', this.value)">
          </div>
          <div class="range-row">
            <label><span>Saturation</span><span id="saturationVal">+5</span></label>
            <input type="range" class="slider-input" min="-50" max="50" value="5" oninput="updateEditorSlider('saturation', this.value)">
          </div>
        </div>

        <button class="btn primary" style="width:100%;justify-content:center;margin-top:12px" onclick="toast('Changes Applied', 'Image saved and updated in gallery.');">
          Apply Changes
        </button>
      </aside>
    </div>
  `;
}

// 10. INVOICES
function invoices() {
  const totalRev = state.invoices.reduce((s, i) => s + (i.numericAmount || parseInt(i.amount.replace(/[^0-9]/g, '') || 0)), 0);
  const paidRev = state.invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + (i.numericAmount || parseInt(i.amount.replace(/[^0-9]/g, '') || 0)), 0);
  const pendingRev = state.invoices.filter(i => i.status === 'Pending').reduce((s, i) => s + (i.numericAmount || parseInt(i.amount.replace(/[^0-9]/g, '') || 0)), 0);
  const overdueRev = state.invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + (i.numericAmount || parseInt(i.amount.replace(/[^0-9]/g, '') || 0)), 0);

  return pageHead(
    "Invoices & Billing",
    `Manage ${state.invoices.length} invoices, track payments and financial reporting.`,
    `<button class="btn" onclick="exportInvoicesCSV()">${icon("download")} Export CSV</button>
     <button class="btn primary" data-action="new-invoice">${icon("plus")} New Invoice</button>`
  ) + `
    <div class="invoice-stats">
      <div class="card"><small class="muted">TOTAL BILLED</small><div class="invoice-total">₹${totalRev.toLocaleString('en-IN')}</div><small class="green">+22.4% vs last period</small></div>
      <div class="card"><small class="muted">PAID</small><div class="invoice-total green">₹${paidRev.toLocaleString('en-IN')}</div><small class="green">${Math.round((paidRev/totalRev)*100 || 0)}% Collected</small></div>
      <div class="card"><small class="muted">PENDING</small><div class="invoice-total gold">₹${pendingRev.toLocaleString('en-IN')}</div><small class="gold">${state.invoices.filter(i=>i.status==='Pending').length} invoices</small></div>
      <div class="card"><small class="muted">OVERDUE</small><div class="invoice-total red">₹${overdueRev.toLocaleString('en-IN')}</div><small class="red">${state.invoices.filter(i=>i.status==='Overdue').length} overdue</small></div>
    </div>
    <div class="card table-card">
      <div class="toolbar">
        <input class="input" id="invoiceSearch" placeholder="Search invoices by ID, client or project...">
        <select class="select" id="invoiceStatusFilter">
          <option value="">All Invoices</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>INVOICE</th>
            <th>CLIENT</th>
            <th>PROJECT</th>
            <th>ISSUE DATE</th>
            <th>DUE DATE</th>
            <th>AMOUNT</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody id="invoiceRows">
          ${renderInvoiceRows(state.invoices)}
        </tbody>
      </table>
    </div>
  `;
}

function renderInvoiceRows(list) {
  if (list.length === 0) {
    return `<tr><td colspan="8" style="text-align:center;padding:24px;color:var(--muted)">No invoices found. Click "+ New Invoice" to create one.</td></tr>`;
  }
  return list.map(inv => `
    <tr>
      <td><strong>${inv.id}</strong></td>
      <td>${inv.client}</td>
      <td>${inv.project}</td>
      <td>${inv.issueDate}</td>
      <td>${inv.dueDate}</td>
      <td><strong>${inv.amount}</strong></td>
      <td>
        <span class="badge ${inv.status === 'Paid' ? 'green' : inv.status === 'Overdue' ? 'red' : 'gold'}">${inv.status}</span>
      </td>
      <td>
        <div style="display:flex;gap:4px">
          <button class="btn sm" onclick="toggleInvoicePaid('${inv.id}')" title="Toggle Paid">${icon("check")}</button>
          <button class="btn sm danger" onclick="deleteInvoice('${inv.id}')" title="Delete Invoice">${icon("trash-2")}</button>
        </div>
      </td>
    </tr>
  `).join("");
}

// 11. ANALYTICS
function analytics() {
  return pageHead(
    "Analytics & Revenue",
    "Real-time studio financial intelligence and conversion metrics.",
    `<button class="btn">Last 30 Days</button>
     <button class="btn primary" onclick="toast('Report Exported', 'Full PDF analytics report downloaded.')">${icon("download")} Export Report</button>`
  ) + `
    <div class="metric-grid">
      <div class="card metric"><small>Revenue (MTD)</small><strong>₹8,42,500</strong><small class="green">+18.4%</small></div>
      <div class="card metric"><small>Studio Profit</small><strong>₹5,96,200</strong><small class="green">+21.2%</small></div>
      <div class="card metric"><small>Total Bookings</small><strong>${state.bookings.length + 38}</strong><small class="green">+12.6%</small></div>
      <div class="card metric"><small>Avg. Project Value</small><strong>₹1,42,500</strong><small class="green">+8.2%</small></div>
      <div class="card metric"><small>Client Retention</small><strong>84%</strong><small class="green">+4.1%</small></div>
      <div class="card metric"><small>Studio Utilization</small><strong>78%</strong><small class="green">+9.8%</small></div>
    </div>
    <div class="analytics-grid">
      <div class="card">
        <div class="card-head">
          <h3>Revenue Performance Trend</h3>
          <span>Monthly</span>
        </div>
        <div class="chart-wrap">
          <canvas id="analyticsChart"></canvas>
        </div>
      </div>
      <div class="card">
        <div class="card-head">
          <h3>AI Business Strategy Insight</h3>
          <span>Live Analysis</span>
        </div>
        <div class="ai-banner" style="margin:0;display:block">
          <div class="eyebrow">INTELLIGENCE</div>
          <h2>Wedding & Fashion generate 68% of total revenue.</h2>
          <p style="margin:8px 0">Studio utilization peaks on Thursdays and Saturdays. Consider creating an executive headshot evening slot to capture weekday corporate demand.</p>
          <button class="btn primary sm" style="margin-top:10px" data-action="new-booking">Create Open Slot</button>
        </div>
      </div>
    </div>
  `;
}

// 12. NOTIFICATIONS
function notifications() {
  const unreadCount = state.notifications.filter(n => !n.read).length;
  return pageHead(
    "Notifications",
    `Stay on top of updates, payments and client interactions (${unreadCount} unread).`,
    `<button class="btn" onclick="markAllNotificationsRead()">${icon("check-check")} Mark all as read</button>
     <button class="btn" onclick="clearAllNotifications()">${icon("trash-2")} Clear</button>`
  ) + `
    <div class="card notifications">
      ${state.notifications.length > 0 ? state.notifications.map(n => `
        <div class="notice ${n.read ? '' : 'unread'}">
          <span class="notice-icon">${icon(n.icon || "bell")}</span>
          <div style="flex:1">
            <strong>${n.title}</strong>
            <p>${n.msg}</p>
            <time>${n.time}</time>
          </div>
          ${!n.read ? `<span class="badge gold" style="cursor:pointer" onclick="markNotificationRead('${n.id}')">New</span>` : ''}
        </div>
      `).join("") : `<p class="muted" style="text-align:center;padding:30px">All caught up! No notifications right now.</p>`}
    </div>
  `;
}

// 13. SETTINGS
let currentSettingsTab = 'studio-profile';
let activeEquipmentFilter = 'All';

function settings() {
  const tabs = [
    { key: "studio-profile", label: "Studio Profile", icon: "camera" },
    { key: "account-team", label: "Account & Team", icon: "users" },
    { key: "rooms-equipment", label: "Rooms & Equipment", icon: "layers-3" },
    { key: "bookings-hours", label: "Bookings & Hours", icon: "calendar-clock" },
    { key: "invoices-tax", label: "Invoices & Tax", icon: "receipt-text" },
    { key: "ai-engine", label: "AI Engine", icon: "sparkles" },
    { key: "theme-display", label: "Theme & Display", icon: "palette" }
  ];

  return pageHead(
    "Studio Settings",
    "Configure studio profile, team roster, booking schedules, invoices, AI assistant and themes.",
    `<button class="btn" onclick="switchSettingsTab(currentSettingsTab)">Discard</button>
     <button class="btn primary" onclick="saveActiveSettingsSection()">${icon("save")} Save Changes</button>`
  ) + `
    <div class="setting-layout">
      <div class="card setting-nav">
        ${tabs.map(t => `
          <button class="setting-nav-btn ${currentSettingsTab === t.key ? 'active' : ''}" data-tab="${t.key}" onclick="switchSettingsTab('${t.key}')">
            ${icon(t.icon)}
            <span>${t.label}</span>
          </button>
        `).join("")}
      </div>
      <div class="setting-panel" id="settingsPanelContent">
        ${renderSettingsSubPanel(currentSettingsTab)}
      </div>
    </div>
  `;
}

function switchSettingsTab(tabKey) {
  currentSettingsTab = tabKey;
  
  // Update active state on sidebar buttons
  $$(".setting-nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabKey);
  });

  // Render sub-panel content
  const panel = $("#settingsPanelContent");
  if (panel) {
    panel.innerHTML = renderSettingsSubPanel(tabKey);
    initIcons();
  }

  // If AI Engine tab, refresh live status from backend
  if (tabKey === 'ai-engine') {
    fetchAiEngineStatus();
  }
}

function renderSettingsSubPanel(tabKey) {
  switch (tabKey) {
    case "studio-profile":
      return renderStudioProfileSection();
    case "account-team":
      return renderAccountTeamSection();
    case "rooms-equipment":
      return renderRoomsEquipmentSection();
    case "bookings-hours":
      return renderBookingsHoursSection();
    case "invoices-tax":
      return renderInvoicesTaxSection();
    case "ai-engine":
      return renderAiEngineSection();
    case "theme-display":
      return renderThemeDisplaySection();
    default:
      return renderStudioProfileSection();
  }
}

// --------------------------------------------------------------------------
// SUB-PANEL 1: STUDIO PROFILE
// --------------------------------------------------------------------------
function renderStudioProfileSection() {
  const p = state.settings.studioProfile || {};
  return `
    <div class="setting-section-card">
      <div class="setting-section-header">
        <h3>${icon("camera")} Studio Profile & Branding</h3>
        <span>Public studio information displayed on invoices and client portals</span>
      </div>
      <div class="form-grid">
        <div class="field">
          <label>Studio Name *</label>
          <input id="setStudioName" value="${p.studioName || 'Frame Creative Studio'}" placeholder="e.g. Frame Creative Studio" required>
        </div>
        <div class="field">
          <label>Owner / Creative Director *</label>
          <input id="setOwner" value="${p.owner || 'Alex Carter'}" placeholder="e.g. Alex Carter" required>
        </div>
        <div class="field">
          <label>Primary Studio Email *</label>
          <input type="email" id="setEmail" value="${p.email || 'hello@frameai.studio'}" placeholder="hello@frameai.studio" required>
        </div>
        <div class="field">
          <label>Studio Phone Number</label>
          <input id="setPhone" value="${p.phone || '+91 98200 88990'}" placeholder="+91 98200 88990">
        </div>
        <div class="field full">
          <label>Studio Address</label>
          <input id="setAddress" value="${p.address || '402, Signature One, Linking Road, Bandra West'}" placeholder="Street address or landmark">
        </div>
        <div class="field">
          <label>City</label>
          <input id="setCity" value="${p.city || 'Mumbai'}" placeholder="e.g. Mumbai">
        </div>
        <div class="field">
          <label>Country</label>
          <input id="setCountry" value="${p.country || 'India'}" placeholder="e.g. India">
        </div>
        <div class="field full">
          <label>Studio Website URL</label>
          <input type="url" id="setWebsite" value="${p.website || 'https://frameai.studio'}" placeholder="https://frameai.studio">
        </div>
        <div class="field full">
          <label>Studio Logo URL</label>
          <div style="display:flex;gap:12px;align-items:center">
            <div id="setLogoPreview" style="width:48px;height:48px;border-radius:8px;background-image:url('${p.logo || PRESET_IMGS[0]}');background-size:cover;background-position:center;border:1px solid var(--line);flex-shrink:0"></div>
            <input id="setLogo" value="${p.logo || ''}" placeholder="https://... logo image URL" oninput="$('#setLogoPreview').style.backgroundImage = 'url(' + this.value + ')'" style="flex:1">
          </div>
        </div>
        <div class="field full">
          <label>Studio Bio & Description</label>
          <textarea id="setBio" style="min-height:90px" placeholder="Describe your studio's photography style, specialties and equipment...">${p.bio || ''}</textarea>
        </div>
      </div>
      <div class="settings-action-bar">
        <span class="settings-msg" id="studioProfileMsg"></span>
        <div style="display:flex;gap:8px">
          <button class="btn" onclick="switchSettingsTab('studio-profile')">Cancel</button>
          <button class="btn primary" id="btnSaveStudioProfile" onclick="saveStudioProfile()">${icon("save")} Save Changes</button>
        </div>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// SUB-PANEL 2: ACCOUNT & TEAM
// --------------------------------------------------------------------------
function renderAccountTeamSection() {
  const acc = state.settings.account || {};
  const team = state.team || [];

  return `
    <div class="setting-section-card">
      <div class="setting-section-header">
        <h3>${icon("shield-check")} Studio Owner Account</h3>
        <span>Manage account credentials, owner profile and security</span>
      </div>
      <div class="form-grid">
        <div class="field">
          <label>Account Owner Name</label>
          <input id="accOwnerName" value="${acc.ownerName || state.settings.studioProfile?.owner || 'Alex Carter'}" required>
        </div>
        <div class="field">
          <label>Account Email (Login)</label>
          <input type="email" id="accEmail" value="${acc.email || 'admin@frameai.com'}" readonly style="opacity:0.8;cursor:not-allowed">
        </div>
        <div class="field">
          <label>Owner Role / Title</label>
          <input id="accRole" value="${acc.role || 'Studio Owner'}" placeholder="Studio Owner">
        </div>
        <div class="field">
          <label>Contact Phone</label>
          <input id="accPhone" value="${acc.phone || '+91 98200 88990'}">
        </div>
      </div>

      <!-- Password Management -->
      <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--line)">
        <h4 style="font-size:12px;font-weight:700;color:var(--text-bright);margin:0 0 10px 0;display:flex;align-items:center;gap:6px">
          ${icon("lock")} Change Password
        </h4>
        <div class="form-grid">
          <div class="field">
            <label>Current Password</label>
            <input type="password" id="accCurrentPassword" placeholder="Enter current password">
          </div>
          <div class="field">
            <label>New Password (min. 6 characters)</label>
            <input type="password" id="accNewPassword" placeholder="Enter new password">
          </div>
          <div class="field full">
            <label>Confirm New Password</label>
            <input type="password" id="accConfirmPassword" placeholder="Re-enter new password">
          </div>
        </div>
      </div>

      <div class="settings-action-bar">
        <span class="settings-msg" id="accountMsg"></span>
        <button class="btn primary" id="btnSaveAccount" onclick="saveAccountSettings()">${icon("save")} Save Profile & Password</button>
      </div>
    </div>

    <!-- Team Members Management -->
    <div class="setting-section-card">
      <div class="setting-section-header">
        <div>
          <h3>${icon("users")} Team Members & Staff (${team.length})</h3>
          <span>Manage photographers, studio managers, retouchers, and assistants</span>
        </div>
        <button class="btn primary sm" onclick="openAddTeamMemberModal()">${icon("user-plus")} Add Team Member</button>
      </div>
      
      <div style="overflow-x:auto">
        <table class="settings-team-table">
          <thead>
            <tr>
              <th>MEMBER</th>
              <th>ROLE</th>
              <th>EMAIL</th>
              <th>PHONE</th>
              <th>STATUS</th>
              <th style="text-align:right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            ${team.length > 0 ? team.map(m => `
              <tr>
                <td>
                  <div style="display:flex;align-items:center">
                    <span class="team-avatar-pill">${m.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}</span>
                    <strong>${m.name}</strong>
                  </div>
                </td>
                <td><span class="badge ${m.role.includes('Owner')?'gold':m.role.includes('Photographer')?'purple':m.role.includes('Manager')?'green':'dim'}">${m.role}</span></td>
                <td><small class="muted">${m.email}</small></td>
                <td><small class="muted">${m.phone || '—'}</small></td>
                <td><span class="badge ${m.status === 'Active' ? 'green' : 'dim'}">${m.status || 'Active'}</span></td>
                <td style="text-align:right">
                  <div style="display:flex;gap:4px;justify-content:flex-end">
                    <button class="btn sm" onclick="openEditTeamMemberModal('${m.id}')" title="Edit Member">${icon("edit-3")}</button>
                    <button class="btn sm danger" onclick="deleteTeamMember('${m.id}')" title="Remove Member">${icon("trash-2")}</button>
                  </div>
                </td>
              </tr>
            `).join("") : `
              <tr>
                <td colspan="6" style="text-align:center;padding:24px;color:var(--muted)">No team members added yet. Click "+ Add Team Member" to build your roster.</td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// SUB-PANEL 3: ROOMS & EQUIPMENT
// --------------------------------------------------------------------------
function renderRoomsEquipmentSection() {
  const rooms = state.resources?.rooms || [];
  const equipment = state.resources?.equipment || [];
  const filteredEq = activeEquipmentFilter === 'All' ? equipment : equipment.filter(e => e.category === activeEquipmentFilter);

  return `
    <!-- Studio Rooms -->
    <div class="setting-section-card">
      <div class="setting-section-header">
        <div>
          <h3>${icon("box")} Studio Rooms & Production Sets (${rooms.length})</h3>
          <span>Physical studio rooms, daylight bays, cycloramas and edit suites</span>
        </div>
        <button class="btn primary sm" onclick="openAddRoomModal()">${icon("plus")} Add Room</button>
      </div>

      <div class="resource-grid">
        ${rooms.map(r => `
          <div class="resource-card">
            <div class="resource-card-head">
              <div>
                <h4>${r.name}</h4>
                <div class="resource-card-meta">
                  <span class="badge ${r.type.includes('Cyclorama')?'gold':r.type.includes('Portrait')?'purple':'green'}">${r.type}</span>
                  <span>👥 ${r.capacity || 'N/A'}</span>
                </div>
              </div>
              <span class="badge ${r.status === 'Available' ? 'green' : 'gold'}">${r.status || 'Available'}</span>
            </div>
            <div style="font-size:14px;font-weight:700;color:var(--gold)">${r.hourlyRate || '₹3,000/hr'}</div>
            <p class="resource-card-desc">${r.description || 'Dedicated shooting space with studio lighting truss.'}</p>
            <div class="resource-card-actions">
              <button class="btn sm" onclick="openEditRoomModal('${r.id}')">${icon("edit-3")} Edit</button>
              <button class="btn sm danger" onclick="deleteRoom('${r.id}')">${icon("trash-2")}</button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Equipment & Gear Vault -->
    <div class="setting-section-card">
      <div class="setting-section-header">
        <div>
          <h3>${icon("camera")} Gear Vault & Equipment (${equipment.length})</h3>
          <span>Cameras, prime lenses, strobe lights, and cinema rigs</span>
        </div>
        <button class="btn primary sm" onclick="openAddEquipmentModal()">${icon("plus")} Add Equipment</button>
      </div>

      <div class="toolbar" style="margin-bottom:14px">
        ${["All", "Cameras", "Lenses", "Lighting", "Other Equipment"].map(cat => `
          <button class="btn ${activeEquipmentFilter === cat ? 'active' : ''}" onclick="filterEquipmentCategory('${cat}', this)">${cat}</button>
        `).join("")}
      </div>

      <div class="resource-grid" id="equipmentGrid">
        ${renderEquipmentCards(filteredEq)}
      </div>
    </div>
  `;
}

function renderEquipmentCards(list) {
  if (list.length === 0) {
    return `<div style="grid-column:1/-1;text-align:center;padding:30px;color:var(--muted)">No equipment found in this category. Click "+ Add Equipment" to register gear.</div>`;
  }
  return list.map(e => `
    <div class="resource-card">
      <div class="resource-card-head">
        <div>
          <h4>${e.name}</h4>
          <div class="resource-card-meta">
            <span class="badge ${e.category==='Cameras'?'gold':e.category==='Lenses'?'purple':e.category==='Lighting'?'green':'dim'}">${e.category}</span>
            <span>📍 ${e.location || 'Gear Vault'}</span>
          </div>
        </div>
        <span class="badge ${e.status === 'Ready' ? 'green' : e.status === 'In Use' ? 'gold' : 'red'}">${e.status || 'Ready'}</span>
      </div>
      <div style="font-size:11px;color:var(--muted)">Serial: <code style="color:var(--text-bright)">${e.serial || 'SN-UNKNOWN'}</code></div>
      <div class="resource-card-actions">
        <button class="btn sm" onclick="openEditEquipmentModal('${e.id}')">${icon("edit-3")} Edit</button>
        <button class="btn sm danger" onclick="deleteEquipment('${e.id}')">${icon("trash-2")}</button>
      </div>
    </div>
  `).join("");
}

// --------------------------------------------------------------------------
// SUB-PANEL 4: BOOKINGS & HOURS
// --------------------------------------------------------------------------
function renderBookingsHoursSection() {
  const b = state.settings.bookingHours || {};
  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const workingDays = b.workingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return `
    <div class="setting-section-card">
      <div class="setting-section-header">
        <div>
          <h3>${icon("calendar-clock")} Operating Hours & Booking Schedule</h3>
          <span>Controls calendar availability, valid shoot slots and StudioAI booking rules</span>
        </div>
        <span class="badge gold">Affects Availability Engine</span>
      </div>

      <div class="form-grid">
        <div class="field">
          <label>Studio Opening Time *</label>
          <input type="time" id="setOpenTime" value="${b.openingTime || '09:00'}" required>
        </div>
        <div class="field">
          <label>Studio Closing Time *</label>
          <input type="time" id="setCloseTime" value="${b.closingTime || '20:00'}" required>
        </div>
        <div class="field">
          <label>Break Hours (Unavailable Slots)</label>
          <input id="setBreakHours" value="${b.breakHours || '13:00 - 14:00'}" placeholder="e.g. 13:00 - 14:00">
        </div>
        <div class="field">
          <label>Default Session Duration</label>
          <select id="setDefaultDuration">
            <option value="1 Hour" ${b.defaultDuration==='1 Hour'?'selected':''}>1 Hour Express Session</option>
            <option value="2 Hours" ${b.defaultDuration==='2 Hours'?'selected':''}>2 Hours Standard</option>
            <option value="3 Hours" ${b.defaultDuration==='3 Hours'?'selected':''}>3 Hours Extended Session</option>
            <option value="6 Hours" ${b.defaultDuration==='6 Hours'?'selected':''}>6 Hours Half Day</option>
            <option value="8 Hours" ${b.defaultDuration==='8 Hours'?'selected':''}>8 Hours Full Day</option>
          </select>
        </div>
        <div class="field">
          <label>Buffer Time Between Bookings</label>
          <select id="setBufferMinutes">
            <option value="15" ${Number(b.bufferMinutes)===15?'selected':''}>15 Minutes Setup Buffer</option>
            <option value="30" ${Number(b.bufferMinutes)===30?'selected':''}>30 Minutes Clean & Reset (Recommended)</option>
            <option value="45" ${Number(b.bufferMinutes)===45?'selected':''}>45 Minutes Setup</option>
            <option value="60" ${Number(b.bufferMinutes)===60?'selected':''}>60 Minutes Turnaround</option>
          </select>
        </div>
        <div class="field">
          <label>Maximum Daily Bookings</label>
          <input type="number" id="setMaxDailyBookings" min="1" max="25" value="${b.maxDailyBookings || 8}">
        </div>

        <div class="field full">
          <label>Studio Working Days (Click to Toggle Open / Closed)</label>
          <div class="working-days-picker" id="workingDaysPicker">
            ${allDays.map(day => {
              const isOpen = workingDays.includes(day);
              return `
                <div class="day-toggle-chip ${isOpen ? 'active' : 'closed'}" data-day="${day}" onclick="toggleWorkingDay('${day}')">
                  <span>${day.slice(0, 3)}</span>
                  <small>${isOpen ? '✓ Open' : '✕ Closed'}</small>
                </div>
              `;
            }).join("")}
          </div>
          <small class="muted" style="margin-top:6px;display:block">
            Closed days are immediately blocked on the calendar and StudioAI will reject bookings requested for closed dates.
          </small>
        </div>
      </div>

      <div class="settings-action-bar">
        <span class="settings-msg" id="bookingHoursMsg"></span>
        <button class="btn primary" id="btnSaveBookingHours" onclick="saveBookingHoursSettings()">${icon("save")} Save Schedule</button>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// SUB-PANEL 5: INVOICES & TAX
// --------------------------------------------------------------------------
function renderInvoicesTaxSection() {
  const inv = state.settings.invoiceSettings || {};

  return `
    <div class="setting-section-card">
      <div class="setting-section-header">
        <div>
          <h3>${icon("receipt-text")} Invoice & Tax Configuration</h3>
          <span>Billing parameters, currency symbols, and statutory tax calculation</span>
        </div>
        <span class="badge gold">Affects Invoice Calculations</span>
      </div>

      <div class="form-grid">
        <div class="field">
          <label>Invoice Number Prefix *</label>
          <input id="setInvPrefix" value="${inv.prefix || 'FAI-'}" placeholder="e.g. FAI- or INV-" required>
        </div>
        <div class="field">
          <label>Currency Format *</label>
          <select id="setInvCurrency" onchange="updateCurrencySymbolPreview(this.value)">
            <option value="INR" ${inv.currency==='INR'?'selected':''}>INR — Indian Rupee (₹)</option>
            <option value="USD" ${inv.currency==='USD'?'selected':''}>USD — US Dollar ($)</option>
            <option value="EUR" ${inv.currency==='EUR'?'selected':''}>EUR — Euro (€)</option>
            <option value="GBP" ${inv.currency==='GBP'?'selected':''}>GBP — British Pound (£)</option>
            <option value="AED" ${inv.currency==='AED'?'selected':''}>AED — UAE Dirham (د.إ)</option>
          </select>
        </div>
        <div class="field">
          <label>Tax Name *</label>
          <input id="setTaxName" value="${inv.taxName || 'GST'}" placeholder="e.g. GST, VAT, Sales Tax" required>
        </div>
        <div class="field">
          <label>Tax Percentage (%) *</label>
          <input type="number" step="0.1" min="0" max="50" id="setTaxRate" value="${inv.taxRate !== undefined ? inv.taxRate : 18}" placeholder="18" required>
        </div>
        <div class="field">
          <label>Business Tax ID / GSTIN</label>
          <input id="setTaxId" value="${inv.businessTaxId || 'GSTIN27AABCU9603R1ZM'}" placeholder="e.g. GSTIN27AABCU9603R1ZM">
        </div>
        <div class="field">
          <label>Payment Terms</label>
          <input id="setPaymentTerms" value="${inv.paymentTerms || 'Due within 7 days'}" placeholder="e.g. Due within 7 days">
        </div>
        <div class="field full">
          <label>Invoice Payment Notes & Bank Details</label>
          <textarea id="setInvNotes" style="min-height:90px" placeholder="Bank account numbers, IFSC codes, UPI handles or late fee policies...">${inv.invoiceNotes || ''}</textarea>
        </div>
      </div>

      <div class="settings-action-bar">
        <span class="settings-msg" id="invoiceTaxMsg"></span>
        <button class="btn primary" id="btnSaveInvoiceTax" onclick="saveInvoiceTaxSettings()">${icon("save")} Save Invoice Settings</button>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// SUB-PANEL 6: AI ENGINE (GEMINI & STUDIOAI)
// --------------------------------------------------------------------------
function renderAiEngineSection() {
  const ai = state.settings.aiSettings || {};

  return `
    <div class="setting-section-card">
      <div class="setting-section-header">
        <div>
          <h3>${icon("sparkles")} StudioAI Intelligence Engine</h3>
          <span>Neural routing, Google Gemini API connection, and assistant behaviors</span>
        </div>
      </div>

      <!-- Live AI Status Banner -->
      <div class="ai-status-card" id="aiStatusBanner">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg, #7b2cbf, #9d4edd);display:grid;place-items:center;color:#fff">
            ${icon("sparkles")}
          </div>
          <div>
            <strong style="color:var(--text-bright);font-size:13px" id="aiStatusTitle">Checking AI Engine Status...</strong>
            <p class="muted" style="margin:2px 0 0;font-size:11px" id="aiStatusSubtitle">Verifying Google Gemini API connection</p>
          </div>
        </div>
        <div id="aiStatusBadgeContainer">
          <span class="ai-status-badge online"><span class="ai-status-dot"></span> Checking...</span>
        </div>
      </div>

      <div class="form-grid" style="margin-top:16px">
        <div class="field">
          <label>AI Provider</label>
          <input value="Google Gemini (Cloud AI)" readonly style="opacity:0.85;cursor:not-allowed">
        </div>
        <div class="field">
          <label>Gemini Model</label>
          <select id="setAiModel">
            <option value="gemini-2.5-flash" ${ai.model==='gemini-2.5-flash'?'selected':''}>gemini-2.5-flash (Fast & Intelligent — Recommended)</option>
            <option value="gemini-1.5-pro" ${ai.model==='gemini-1.5-pro'?'selected':''}>gemini-1.5-pro (High Reasoning & Vision)</option>
            <option value="gemini-1.5-flash" ${ai.model==='gemini-1.5-flash'?'selected':''}>gemini-1.5-flash (Low Latency)</option>
          </select>
        </div>
        <div class="field">
          <label>AI Assistant Name</label>
          <input id="setAiAssistantName" value="${ai.assistantName || 'StudioAI'}" placeholder="StudioAI" required>
        </div>
        <div class="field">
          <label>Response Style / Temperature</label>
          <select id="setAiResponseStyle">
            <option value="Creative" ${ai.responseStyle==='Creative'?'selected':''}>Creative & Expressive (Temp 0.9)</option>
            <option value="Balanced" ${ai.responseStyle==='Balanced'?'selected':''}>Balanced Studio Professional (Temp 0.7)</option>
            <option value="Precise" ${ai.responseStyle==='Precise'?'selected':''}>Strict & Concise (Temp 0.2)</option>
          </select>
        </div>
        <div class="field full">
          <label>System Instructions & Operating Persona</label>
          <textarea id="setAiInstructions" style="min-height:110px" placeholder="Instructions that govern StudioAI's tone, policies and booking intelligence...">${ai.systemInstructions || ''}</textarea>
        </div>
      </div>

      <div style="background:rgba(255,255,255,0.02);border:1px solid var(--line);border-radius:8px;padding:12px 14px;margin-top:14px">
        <div style="display:flex;align-items:center;gap:8px;font-size:11px;color:var(--dim)">
          <span style="color:var(--gold)">${icon("shield-check")}</span>
          <span><strong>API Key Security:</strong> Your <code>GEMINI_API_KEY</code> is stored securely server-side in your <code>.env</code> file and is never exposed to browser clients.</span>
        </div>
      </div>

      <div class="settings-action-bar">
        <span class="settings-msg" id="aiSettingsMsg"></span>
        <button class="btn primary" id="btnSaveAiSettings" onclick="saveAiEngineSettings()">${icon("save")} Save AI Settings</button>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// SUB-PANEL 7: THEME & DISPLAY
// --------------------------------------------------------------------------
function renderThemeDisplaySection() {
  const t = state.settings.themeSettings || {};
  const currentTheme = t.theme || state.settings.theme || 'dark';
  const currentAccent = t.accentColor || 'purple';

  const accents = [
    { key: "purple", name: "Purple / Violet AI", color: "#7b2cbf" },
    { key: "gold", name: "Luxury Gold", color: "#d4af37" },
    { key: "indigo", name: "Electric Indigo", color: "#6366f1" },
    { key: "emerald", name: "Emerald Green", color: "#10b981" },
    { key: "rose", name: "Crimson Rose", color: "#e11d48" }
  ];

  return `
    <div class="setting-section-card">
      <div class="setting-section-header">
        <div>
          <h3>${icon("palette")} Theme & Appearance Settings</h3>
          <span>Customize the visual workspace, accent tones and motion performance</span>
        </div>
      </div>

      <div class="form-grid">
        <div class="field">
          <label>Interface Theme</label>
          <select id="setThemeMode" onchange="previewTheme(this.value)">
            <option value="dark" ${currentTheme==='dark'?'selected':''}>Dark Studio (Luxury Charcoal)</option>
            <option value="light" ${currentTheme==='light'?'selected':''}>Light Clean (High Contrast)</option>
          </select>
        </div>
        <div class="field">
          <label>Sidebar Display Mode</label>
          <select id="setSidebarDisplay">
            <option value="expanded" ${(t.sidebarMode||'expanded')==='expanded'?'selected':''}>Expanded with Text Labels</option>
            <option value="compact" ${(t.sidebarMode||'expanded')==='compact'?'selected':''}>Compact Icon Mode</option>
          </select>
        </div>

        <div class="field full">
          <label>Studio Accent Color</label>
          <div class="accent-swatches">
            ${accents.map(a => `
              <div class="accent-swatch ${currentAccent === a.key ? 'active' : ''}" 
                   style="background:${a.color}" 
                   title="${a.name}" 
                   onclick="selectAccentColor('${a.key}')">
              </div>
            `).join("")}
          </div>
        </div>

        <div class="field">
          <label>Motion & Micro-Animations</label>
          <select id="setAnimations">
            <option value="true" ${t.animations !== false ? 'selected' : ''}>Enabled (Smooth transitions & Glow)</option>
            <option value="false" ${t.animations === false ? 'selected' : ''}>Disabled</option>
          </select>
        </div>
        <div class="field">
          <label>Reduce Motion Accessibility</label>
          <select id="setReduceMotion">
            <option value="false" ${!t.reduceMotion ? 'selected' : ''}>Off (Standard Animation Speed)</option>
            <option value="true" ${t.reduceMotion ? 'selected' : ''}>On (Minimize Motion)</option>
          </select>
        </div>
      </div>

      <div class="settings-action-bar">
        <span class="settings-msg" id="themeSettingsMsg"></span>
        <button class="btn primary" id="btnSaveThemeSettings" onclick="saveThemeDisplaySettings()">${icon("save")} Save Display Settings</button>
      </div>
    </div>
  `;
}


// --------------------------------------------------------------------------
// ROUTING & RENDERING
// --------------------------------------------------------------------------

const pages = {
  dashboard,
  clients,
  projects,
  bookings,
  calendar,
  gallery,
  photographers,
  packages,
  "ai-editing": editing,
  invoices,
  analytics,
  notifications,
  settings
};

function render(page = "dashboard") {
  if (!pages[page]) page = "dashboard";
  
  const contentEl = $("#content");
  if (contentEl) {
    contentEl.innerHTML = pages[page]();
  }

  // Update Page Title
  const titleEl = $("#pageTitle");
  if (titleEl) {
    let niceTitle = "";
    if (page === "photographers") niceTitle = "Photographers Team";
    else if (page === "packages") niceTitle = "Packages & Rates";
    else if (page === "ai-editing") niceTitle = "AI Editing Suite";
    else niceTitle = page.split("-").map(x => x[0].toUpperCase() + x.slice(1)).join(" ");
    titleEl.textContent = niceTitle;
  }

  // Update Navigation Active State
  $$(".nav-item").forEach(a => a.classList.toggle("active", a.dataset.page === page));
  $$(".bottom-nav a").forEach(a => a.classList.toggle("active", a.dataset.page === page));

  // Initialize Lucide Icons
  initIcons();

  // Draw Charts
  if (page === "dashboard") drawRevenueChart("revenueChart");
  if (page === "analytics") drawRevenueChart("analyticsChart");

  // Setup AI Editor Dragging if on editing page
  if (page === "ai-editing") setupEditorSlider();

  // Bind Dynamic Event Handlers on DOM
  bindPageActions();
}

function navigateTo(page) {
  if (location.hash.slice(1) === page) {
    render(page);
  } else {
    location.hash = page;
  }
}

function drawRevenueChart(id) {
  const canvas = document.getElementById(id);
  if (!canvas || typeof Chart === 'undefined') return;

  new Chart(canvas, {
    type: "line",
    data: {
      labels: ["18 Aug", "19 Aug", "20 Aug", "21 Aug", "22 Aug", "23 Aug", "24 Aug"],
      datasets: [
        {
          label: "Current Period",
          data: [42, 61, 48, 83, 68, 92, 111],
          borderColor: "#8b7cff",
          backgroundColor: "rgba(139,124,255,0.08)",
          fill: true,
          tension: 0.42,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: "#d6b477"
        },
        {
          label: "Previous Period",
          data: [36, 48, 42, 57, 61, 70, 79],
          borderColor: "#4c515a",
          borderDash: [4, 5],
          fill: false,
          tension: 0.42,
          borderWidth: 1.5,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#181b21",
          borderColor: "#333",
          borderWidth: 1,
          titleColor: "#fff",
          bodyColor: "#aaa",
          padding: 10
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#656c76", font: { size: 9 } }
        },
        y: {
          grid: { color: "rgba(255,255,255,0.05)" },
          ticks: {
            color: "#656c76",
            font: { size: 9 },
            callback: v => "₹" + v + "k"
          }
        }
      }
    }
  });
}

function bindPageActions() {
  $$("[data-action]").forEach(btn => {
    btn.onclick = () => openAction(btn.dataset.action);
  });

  // Client search and filter
  const cs = $("#clientSearch");
  const ctf = $("#clientTypeFilter");
  if (cs) {
    const handleClientFilter = () => {
      const q = cs.value.toLowerCase();
      const type = ctf ? ctf.value : "";
      const filtered = state.clients.filter(c => {
        const matchesQ = c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.company && c.company.toLowerCase().includes(q));
        const matchesType = !type || c.type === type;
        return matchesQ && matchesType;
      });
      const rows = $("#clientRows");
      if (rows) rows.innerHTML = renderClientRows(filtered);
      initIcons();
    };
    cs.oninput = handleClientFilter;
    if (ctf) ctf.onchange = handleClientFilter;
  }

  // Project search and filter
  const ps = $("#projectSearch");
  const psf = $("#projectStatusFilter");
  const ptf = $("#projectTypeFilter");
  if (ps) {
    const handleProjectFilter = () => {
      const q = ps.value.toLowerCase();
      const status = psf ? psf.value : "";
      const type = ptf ? ptf.value : "";
      const filtered = state.projects.filter(p => {
        const matchesQ = p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q);
        const matchesStatus = !status || p.status === status;
        const matchesType = !type || p.type === type;
        return matchesQ && matchesStatus && matchesType;
      });
      const grid = $("#projectsGrid");
      if (grid) grid.innerHTML = renderProjectCards(filtered);
      initIcons();
    };
    ps.oninput = handleProjectFilter;
    if (psf) psf.onchange = handleProjectFilter;
    if (ptf) ptf.onchange = handleProjectFilter;
  }

  // Booking search and filter
  const bs = $("#bookingSearch");
  const blf = $("#bookingLocationFilter");
  const bsf = $("#bookingStatusFilter");
  if (bs) {
    const handleBookingFilter = () => {
      const q = bs.value.toLowerCase();
      const loc = blf ? blf.value : "";
      const st = bsf ? bsf.value : "";
      const filtered = state.bookings.filter(b => {
        const matchesQ = b.title.toLowerCase().includes(q) || b.client.toLowerCase().includes(q) || b.location.toLowerCase().includes(q);
        const matchesLoc = !loc || b.location === loc;
        const matchesSt = !st || b.status === st;
        return matchesQ && matchesLoc && matchesSt;
      });
      const rows = $("#bookingRows");
      if (rows) rows.innerHTML = renderBookingRows(filtered);
      initIcons();
    };
    bs.oninput = handleBookingFilter;
    if (blf) blf.onchange = handleBookingFilter;
    if (bsf) bsf.onchange = handleBookingFilter;
  }

  // Photographer search and filter
  const phSearch = $("#photographerSearch");
  const phStatus = $("#photographerStatusFilter");
  const phSpec = $("#photographerSpecFilter");
  if (phSearch) {
    const handlePhFilter = () => {
      const q = phSearch.value.toLowerCase().trim();
      const st = phStatus ? phStatus.value : "";
      const spec = phSpec ? phSpec.value : "";
      const filtered = state.photographers.filter(ph => {
        const matchesQ = !q ||
          ph.name.toLowerCase().includes(q) ||
          (ph.role && ph.role.toLowerCase().includes(q)) ||
          (ph.specialization && ph.specialization.toLowerCase().includes(q)) ||
          (ph.email && ph.email.toLowerCase().includes(q)) ||
          (ph.location && ph.location.toLowerCase().includes(q));
        const matchesSt = !st || ph.status === st;
        const matchesSpec = !spec || ph.specialization === spec;
        return matchesQ && matchesSt && matchesSpec;
      });
      const grid = $("#photographersGrid");
      if (grid) grid.innerHTML = renderPhotographerCards(filtered);
      initIcons();
    };
    phSearch.oninput = handlePhFilter;
    if (phStatus) phStatus.onchange = handlePhFilter;
    if (phSpec) phSpec.onchange = handlePhFilter;
  }

  // Package search and filter
  const pkgSearch = $("#packageSearch");
  const pkgStatus = $("#packageStatusFilter");
  if (pkgSearch) {
    const handlePkgFilter = () => {
      const q = pkgSearch.value.toLowerCase().trim();
      const st = pkgStatus ? pkgStatus.value : "";
      const filtered = state.packages.filter(pkg => {
        const matchesCat = activePackageCategory === "All" || pkg.category === activePackageCategory;
        const matchesQ = !q ||
          pkg.name.toLowerCase().includes(q) ||
          pkg.category.toLowerCase().includes(q) ||
          (pkg.description && pkg.description.toLowerCase().includes(q)) ||
          (Array.isArray(pkg.deliverables) ? pkg.deliverables.some(d => d.toLowerCase().includes(q)) : false);
        const matchesSt = !st || pkg.status === st;
        return matchesCat && matchesQ && matchesSt;
      });
      const grid = $("#packagesGrid");
      if (grid) grid.innerHTML = renderPackageCards(filtered);
      initIcons();
    };
    pkgSearch.oninput = handlePkgFilter;
    if (pkgStatus) pkgStatus.onchange = handlePkgFilter;
  }

  // Invoice search and filter
  const invs = $("#invoiceSearch");
  const invsf = $("#invoiceStatusFilter");
  if (invs) {
    const handleInvFilter = () => {
      const q = invs.value.toLowerCase();
      const st = invsf ? invsf.value : "";
      const filtered = state.invoices.filter(i => {
        const matchesQ = i.id.toLowerCase().includes(q) || i.client.toLowerCase().includes(q) || i.project.toLowerCase().includes(q);
        const matchesSt = !st || i.status === st;
        return matchesQ && matchesSt;
      });
      const rows = $("#invoiceRows");
      if (rows) rows.innerHTML = renderInvoiceRows(filtered);
      initIcons();
    };
    invs.oninput = handleInvFilter;
    if (invsf) invsf.onchange = handleInvFilter;
  }

  // Gallery search
  const gs = $("#gallerySearch");
  if (gs) {
    gs.oninput = () => {
      const q = gs.value.toLowerCase();
      const filtered = state.gallery.filter(g => g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q) || g.client.toLowerCase().includes(q));
      const grid = $("#galleryGrid");
      if (grid) grid.innerHTML = renderGalleryPhotos(filtered);
    };
  }
}

// --------------------------------------------------------------------------
// MODALS & ACTUAL ADD / CREATE WORKFLOWS
// --------------------------------------------------------------------------

let selectedModalImg = PRESET_IMGS[0];

function openAction(action, context = {}) {
  selectedModalImg = PRESET_IMGS[0];

  if (action === "new-client") {
    modal(
      "Add New Client",
      `
        <div class="form-grid">
          <div class="field">
            <label>First Name *</label>
            <input id="clientFirstName" placeholder="e.g. Jessica" required>
          </div>
          <div class="field">
            <label>Last Name *</label>
            <input id="clientLastName" placeholder="e.g. Vance" required>
          </div>
          <div class="field">
            <label>Email Address *</label>
            <input type="email" id="clientEmail" placeholder="jessica@example.com" required>
          </div>
          <div class="field">
            <label>Phone Number</label>
            <input id="clientPhone" placeholder="+91 98765 00123">
          </div>
          <div class="field">
            <label>Company / Account</label>
            <input id="clientCompany" placeholder="e.g. Vogue Studios / Private">
          </div>
          <div class="field">
            <label>Client Status</label>
            <select id="clientType">
              <option value="VIP">VIP Client</option>
              <option value="Business">Business / Corporate</option>
              <option value="Regular" selected>Regular</option>
              <option value="Lead">New Lead</option>
            </select>
          </div>
          <div class="field full">
            <label>Client Notes & Style Preferences</label>
            <textarea id="clientNotes" placeholder="Lighting preferences, aesthetics, or booking requirements..."></textarea>
          </div>
        </div>
      `,
      "Create Client",
      () => {
        const fn = ($("#clientFirstName")?.value || "").trim();
        const ln = ($("#clientLastName")?.value || "").trim();
        const email = ($("#clientEmail")?.value || "").trim();
        if (!fn || !email) {
          toast("Missing Fields", "Please provide a client name and email.");
          return;
        }
        const name = `${fn} ${ln}`.trim();
        const phone = $("#clientPhone")?.value || "";
        const company = $("#clientCompany")?.value || "Private Client";
        const type = $("#clientType")?.value || "Regular";
        const notes = $("#clientNotes")?.value || "";

        const newClient = {
          id: "c-" + Date.now(),
          name,
          email,
          phone,
          company,
          type,
          projectsCount: 1,
          totalRevenue: "₹0",
          lastSession: "Just added",
          notes
        };

        state.clients.unshift(newClient);
        addNotification("user-plus", "New client added", `${name} was added to the studio database.`);
        saveState();
        closeModal();
        toast("Client Created", `${name} has been added successfully.`);
        navigateTo("clients");
      }
    );
  } 
  else if (action === "new-project") {
    const clientOptions = state.clients.map(c => `<option value="${c.name}">${c.name} (${c.company || 'Client'})</option>`).join("");
    modal(
      "Create New Project",
      `
        <div class="form-grid">
          <div class="field full">
            <label>Project Title *</label>
            <input id="projName" placeholder="e.g. Autumn Romance Wedding or Luxury Lookbook" required>
          </div>
          <div class="field">
            <label>Client</label>
            <select id="projClient">
              ${clientOptions}
            </select>
          </div>
          <div class="field">
            <label>Project Category</label>
            <select id="projType">
              <option value="Wedding">Wedding</option>
              <option value="Portrait">Portrait</option>
              <option value="Commercial">Commercial</option>
              <option value="Fashion">Fashion</option>
              <option value="Editorial">Editorial</option>
              <option value="Product">Product</option>
            </select>
          </div>
          <div class="field">
            <label>Budget / Value</label>
            <input id="projBudget" placeholder="₹1,85,000" value="₹1,50,000">
          </div>
          <div class="field">
            <label>Initial Status</label>
            <select id="projStatus">
              <option value="Planning">Planning</option>
              <option value="Booked" selected>Booked</option>
              <option value="Shooting">Shooting</option>
              <option value="Editing">Editing</option>
              <option value="Review">Review</option>
            </select>
          </div>
          <div class="field full">
            <label>Select Cover Photography Asset</label>
            <div class="preset-img-picker">
              ${PRESET_IMGS.slice(0, 8).map((imgUrl, i) => `
                <div class="preset-thumb ${i === 0 ? 'active' : ''}" style="background-image:url('${imgUrl}')" onclick="selectPresetImg(this, '${imgUrl}')"></div>
              `).join("")}
            </div>
          </div>
          <div class="field full">
            <label>Production Notes</label>
            <textarea id="projNotes" placeholder="Location details, shoot plan, equipment needed..."></textarea>
          </div>
        </div>
      `,
      "Create Project",
      () => {
        const name = ($("#projName")?.value || "").trim();
        if (!name) {
          toast("Title Required", "Please enter a project title.");
          return;
        }
        const client = $("#projClient")?.value || "Sarah Johnson";
        const type = $("#projType")?.value || "Wedding";
        const budget = $("#projBudget")?.value || "₹1,50,000";
        const status = $("#projStatus")?.value || "Booked";
        const notes = $("#projNotes")?.value || "";

        const newProject = {
          id: "p-" + Date.now(),
          name,
          type,
          client,
          budget,
          progress: "15%",
          img: selectedModalImg || PRESET_IMGS[0],
          status,
          date: new Date().toISOString().split('T')[0],
          notes
        };

        state.projects.unshift(newProject);
        addNotification("layers-3", "New Project Created", `${name} for ${client} has been initiated.`);
        saveState();
        closeModal();
        toast("Project Created", `${name} is now live in your projects.`);
        navigateTo("projects");
      }
    );
  }
  else if (action === "new-booking") {
    const defaultDate = context.date || state.calendar.selectedDate || "2026-08-24";
    const defaultStartTime = context.startTime || "10:30";
    const defaultTitle = context.title || (context.package ? `${context.package} - Session` : (context.client ? `${context.client} Portrait Session` : ''));
    const defaultType = context.type || "Wedding Portraits";
    const clientOptions = state.clients.map(c => `<option value="${c.name}" ${context.client === c.name ? 'selected' : ''}>${c.name}</option>`).join("");
    const photographerOptions = state.photographers.map(p => 
      `<option value="${p.name}" ${(context.photographer === p.name || p.name === 'Armaan Khan') ? 'selected' : ''}>${p.name} (${p.role || p.specialization})</option>`
    ).join("");

    const roomOptions = (state.resources?.rooms && state.resources.rooms.length > 0)
      ? state.resources.rooms.map(r => `<option value="${r.name}">${r.name} (${r.type})</option>`).join("")
      : `
        <option value="Studio A">Studio A (Main Hall & Cyclorama)</option>
        <option value="Studio B">Studio B (Product & Portrait)</option>
        <option value="Edit Suite">Edit Suite</option>
        <option value="Outdoor">Outdoor / On Location</option>
      `;

    modal(
      "Schedule New Session / Booking",
      `
        <div class="form-grid">
          <div class="field full">
            <label>Session Title *</label>
            <input id="bookTitle" placeholder="e.g. Sarah & Daniel Wedding Portraits" value="${defaultTitle}" required>
          </div>
          <div class="field">
            <label>Client</label>
            <select id="bookClient">
              ${clientOptions}
            </select>
          </div>
          <div class="field">
            <label>Session Type</label>
            <select id="bookType">
              <option value="Wedding Portraits" ${defaultType.includes('Wedding') ? 'selected' : ''}>Wedding Portraits</option>
              <option value="Fashion Editorial" ${defaultType.includes('Fashion') ? 'selected' : ''}>Fashion Editorial</option>
              <option value="Portrait Session" ${defaultType.includes('Portrait') ? 'selected' : ''}>Portrait Session</option>
              <option value="Product Campaign" ${defaultType.includes('Product') ? 'selected' : ''}>Product Campaign</option>
              <option value="Event Coverage" ${defaultType.includes('Event') ? 'selected' : ''}>Event Coverage</option>
              <option value="Pre-Wedding Story" ${defaultType.includes('Pre-Wedding') ? 'selected' : ''}>Pre-Wedding Story</option>
              <option value="Corporate Headshots">Corporate Headshots</option>
              <option value="Studio Setup">Studio Setup & Calibration</option>
            </select>
          </div>
          <div class="field">
            <label>Date *</label>
            <input type="date" id="bookDate" value="${defaultDate}" required>
          </div>
          <div class="field">
            <label>Studio Room / Location</label>
            <select id="bookLocation">
              ${roomOptions}
            </select>
          </div>
          <div class="field">
            <label>Start Time</label>
            <input type="time" id="bookStart" value="${defaultStartTime}">
          </div>
          <div class="field">
            <label>End Time</label>
            <input type="time" id="bookEnd" value="13:00">
          </div>
          <div class="field">
            <label>Lead Photographer</label>
            <select id="bookPhotographer">
              ${photographerOptions}
            </select>
          </div>
          <div class="field">
            <label>Booking Status</label>
            <select id="bookStatus">
              <option value="Confirmed" selected>Confirmed</option>
              <option value="Pending">Pending Confirmation</option>
            </select>
          </div>
          <div class="field full">
            <label>Session Notes & Lighting Setup</label>
            <textarea id="bookNotes" placeholder="Special requirements, props, hair/makeup schedule...">${context.package ? 'Booked under package: ' + context.package : ''}</textarea>
          </div>
        </div>
      `,
      "Confirm Booking",
      () => {
        const title = ($("#bookTitle")?.value || "").trim();
        const client = $("#bookClient")?.value || "Sarah Johnson";
        const date = $("#bookDate")?.value || defaultDate;
        const startTime = $("#bookStart")?.value || "10:00";
        const endTime = $("#bookEnd")?.value || "12:00";
        const location = $("#bookLocation")?.value || "Studio A";
        const photographer = $("#bookPhotographer")?.value || "Armaan Khan";
        const type = $("#bookType")?.value || "Wedding Portraits";
        const status = $("#bookStatus")?.value || "Confirmed";
        const notes = $("#bookNotes")?.value || "";

        if (!title) {
          toast("Title Required", "Please enter a session title.");
          return;
        }

        // Validate working days
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const bookingDay = dayNames[new Date(date).getDay()];
        const workingDays = state.settings?.bookingHours?.workingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        if (!workingDays.includes(bookingDay)) {
          toast("Studio Closed Notice", `Note: ${bookingDay} is set as a non-working day in Studio Settings.`);
        }

        const newBooking = {
          id: "b-" + Date.now(),
          title,
          client,
          type,
          date,
          startTime,
          endTime,
          photographer,
          location,
          status,
          notes
        };

        state.bookings.push(newBooking);
        addNotification("calendar-check", "New Booking Confirmed", `${title} scheduled on ${date} (${startTime}) in ${location}.`);
        saveState();
        closeModal();
        toast("Booking Confirmed", `${title} has been added to the calendar.`);
        navigateTo("calendar");
      }
    );
  }
  else if (action === "new-photographer") {
    modal(
      "Add New Photographer",
      `
        <div class="form-grid">
          <div class="field">
            <label>Full Name *</label>
            <input id="phName" placeholder="e.g. Armaan Khan" required>
          </div>
          <div class="field">
            <label>Email Address *</label>
            <input type="email" id="phEmail" placeholder="armaan@frameai.studio" required>
          </div>
          <div class="field">
            <label>Phone Number *</label>
            <input id="phPhone" placeholder="+91 98201 11223" required>
          </div>
          <div class="field">
            <label>Role / Job Title *</label>
            <input id="phRole" placeholder="e.g. Lead Wedding Photographer" value="Lead Wedding Photographer" required>
          </div>
          <div class="field">
            <label>Specialization *</label>
            <select id="phSpecialization">
              <option value="Wedding Photographer" selected>Wedding Photographer</option>
              <option value="Portrait Photographer">Portrait Photographer</option>
              <option value="Event Photographer">Event Photographer</option>
              <option value="Product Photographer">Product Photographer</option>
              <option value="Cinematic Photographer">Cinematic Photographer</option>
              <option value="Fashion Photographer">Fashion Photographer</option>
              <option value="Studio Lead & Commercial">Studio Lead & Commercial</option>
              <option value="Pre-Wedding & Drone">Pre-Wedding & Drone</option>
            </select>
          </div>
          <div class="field">
            <label>Experience (Years) *</label>
            <input id="phExp" placeholder="e.g. 6 Years" value="5 Years" required>
          </div>
          <div class="field">
            <label>Location / City *</label>
            <input id="phLocation" placeholder="e.g. Mumbai" value="Mumbai" required>
          </div>
          <div class="field">
            <label>Availability / Status *</label>
            <select id="phStatus">
              <option value="Available" selected>Available</option>
              <option value="Busy">Busy</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
          <div class="field">
            <label>Rating (1.0 - 5.0)</label>
            <input type="number" id="phRating" min="1" max="5" step="0.1" value="4.9">
          </div>
          <div class="field">
            <label>Daily / Session Rate (₹)</label>
            <input id="phDailyRate" placeholder="₹18,000" value="₹18,000">
          </div>
          <div class="field full">
            <label>Select Profile Photo Preset or Enter Custom Image URL</label>
            <div class="preset-img-picker" style="margin-bottom:8px">
              ${[
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80"
              ].map((imgUrl, i) => `
                <div class="preset-thumb ${i === 0 ? 'active' : ''}" style="background-image:url('${imgUrl}')" onclick="selectPresetImg(this, '${imgUrl}')"></div>
              `).join("")}
            </div>
            <input id="phAvatarUrl" placeholder="Optional custom avatar URL (https://...)" oninput="selectedModalImg=this.value">
          </div>
          <div class="field full">
            <label>Skills & Specialties (comma separated)</label>
            <input id="phSkills" placeholder="e.g. Candid Wedding, Off-Camera Flash, Sony Alpha Master, Drone Certified" value="Candid Wedding, Off-Camera Flash, Sony Alpha Master">
          </div>
          <div class="field full">
            <label>Professional Bio</label>
            <textarea id="phBio" placeholder="Expertise, signature lighting style, master certifications..."></textarea>
          </div>
        </div>
      `,
      "Save Photographer",
      () => {
        const name = ($("#phName")?.value || "").trim();
        const email = ($("#phEmail")?.value || "").trim();
        const phone = ($("#phPhone")?.value || "").trim();
        const role = ($("#phRole")?.value || "").trim() || "Photographer";
        const specialization = $("#phSpecialization")?.value || "Wedding Photographer";
        const experience = ($("#phExp")?.value || "").trim() || "5+ Years";
        const location = ($("#phLocation")?.value || "").trim() || "Mumbai";
        const status = $("#phStatus")?.value || "Available";
        const rating = parseFloat($("#phRating")?.value) || 4.9;
        const dailyRate = ($("#phDailyRate")?.value || "").trim() || "₹15,000";
        const customAvatar = ($("#phAvatarUrl")?.value || "").trim();
        const avatar = customAvatar || selectedModalImg || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80";
        const skillsRaw = ($("#phSkills")?.value || "").trim();
        const skills = skillsRaw ? skillsRaw.split(",").map(s => s.trim()).filter(Boolean) : [specialization, "Lighting", "Editing"];
        const bio = ($("#phBio")?.value || "").trim() || `Professional ${specialization} with ${experience} of studio and on-location experience.`;

        if (!name) {
          toast("Name Required", "Please enter the photographer's full name.");
          return;
        }
        if (!email || !email.includes("@")) {
          toast("Valid Email Required", "Please enter a valid email address.");
          return;
        }
        if (!phone) {
          toast("Phone Required", "Please enter a valid contact phone number.");
          return;
        }

        const newPhotographer = {
          id: "ph-" + Date.now(),
          name,
          role,
          specialization,
          email,
          phone,
          experience,
          employmentType: "Full-time",
          status,
          currentAssignment: status === "Available" ? "Available for booking" : (status === "Busy" ? "Active Studio Shoot" : "On Leave"),
          rating,
          reviewsCount: 1,
          dailyRate: dailyRate.startsWith("₹") ? dailyRate : "₹" + dailyRate,
          location,
          assignedProjectsCount: 1,
          avatar,
          bio,
          skills,
          totalShoots: 10,
          completedProjects: [],
          earnings: "₹0"
        };

        state.photographers.unshift(newPhotographer);
        addNotification("camera", "New Photographer Added", `${name} (${role}) was added to the studio roster.`);
        saveState();
        closeModal();
        toast("Photographer Added", `${name} is now available in your studio team.`);
        navigateTo("photographers");
      }
    );
  }
  else if (action === "new-package") {
    modal(
      "Add New Package & Pricing",
      `
        <div class="form-grid">
          <div class="field full">
            <label>Package Name *</label>
            <input id="pkgName" placeholder="e.g. Wedding Signature Luxury" required>
          </div>
          <div class="field">
            <label>Category *</label>
            <select id="pkgCategory">
              <option value="Wedding" selected>Wedding</option>
              <option value="Portrait">Portrait</option>
              <option value="Event">Event</option>
              <option value="Product">Product</option>
              <option value="Fashion">Fashion</option>
              <option value="Pre-Wedding">Pre-Wedding</option>
            </select>
          </div>
          <div class="field">
            <label>Price (₹ INR) *</label>
            <input id="pkgPrice" placeholder="e.g. 55000 or ₹55,000" value="₹45,000" required>
          </div>
          <div class="field">
            <label>Duration *</label>
            <input id="pkgDuration" placeholder="e.g. 8 Hours or 2 Hours" value="8 Hours" required>
          </div>
          <div class="field">
            <label>Number of Photographers *</label>
            <input type="number" id="pkgPhotographers" min="1" max="10" value="2" required>
          </div>
          <div class="field">
            <label>Number of Edited Photos *</label>
            <input type="number" id="pkgEditedPhotos" min="5" max="5000" value="300" required>
          </div>
          <div class="field">
            <label>Package Status *</label>
            <select id="pkgStatus">
              <option value="Active" selected>Active (Published)</option>
              <option value="Inactive">Inactive (Draft)</option>
            </select>
          </div>
          <div class="field full">
            <label>Package Description *</label>
            <textarea id="pkgDesc" placeholder="Brief overview of the photography coverage and aesthetic style..." required>Complete photography coverage tailored for luxury and emotional storytelling.</textarea>
          </div>
          <div class="field full">
            <label>Inclusions & Feature Toggles</label>
            <div style="display:flex;gap:18px;flex-wrap:wrap;padding:6px 0">
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px">
                <input type="checkbox" id="pkgVideo" checked> 4K Video Included
              </label>
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px">
                <input type="checkbox" id="pkgDrone"> Aerial Drone Coverage
              </label>
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px">
                <input type="checkbox" id="pkgAlbum"> Flushmount Album
              </label>
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px">
                <input type="checkbox" id="pkgPopular"> Highlight as "Popular Choice"
              </label>
            </div>
          </div>
          <div class="field full">
            <label>Deliverables (1 line per deliverable item) *</label>
            <textarea id="pkgDeliverables" style="height:110px" placeholder="8 Hours Full Event Coverage&#10;2 Professional Photographers&#10;300 Hand-Edited High Res Photos&#10;Private Online Client Gallery&#10;Print-Ready Full Resolution Files">8 Hours Full Event Coverage
2 Professional Photographers (Lead + Candid)
300 High-Resolution Master Edited Photos
Private Online Client Gallery (1 Year)
Print-Ready Full Resolution Files
48-Hour Sneak Peek Preview</textarea>
          </div>
        </div>
      `,
      "Save Package",
      () => {
        const name = ($("#pkgName")?.value || "").trim();
        const category = $("#pkgCategory")?.value || "Wedding";
        const rawPrice = ($("#pkgPrice")?.value || "").trim();
        const duration = ($("#pkgDuration")?.value || "").trim() || "Full Session";
        const photographersCount = parseInt($("#pkgPhotographers")?.value) || 1;
        const editedPhotosCount = parseInt($("#pkgEditedPhotos")?.value) || 50;
        const status = $("#pkgStatus")?.value || "Active";
        const description = ($("#pkgDesc")?.value || "").trim();
        const videoIncluded = !!$("#pkgVideo")?.checked;
        const droneCoverage = !!$("#pkgDrone")?.checked;
        const albumIncluded = !!$("#pkgAlbum")?.checked;
        const popular = !!$("#pkgPopular")?.checked;
        const deliverablesRaw = ($("#pkgDeliverables")?.value || "").trim();

        if (!name) {
          toast("Name Required", "Please enter a package name.");
          return;
        }
        if (!rawPrice) {
          toast("Price Required", "Please enter the package pricing.");
          return;
        }
        if (!description) {
          toast("Description Required", "Please enter a package description.");
          return;
        }

        const numPrice = parseInt(rawPrice.replace(/[^0-9]/g, '')) || 0;
        if (numPrice <= 0) {
          toast("Invalid Price", "Please enter a valid price in INR.");
          return;
        }

        const priceFormatted = "₹" + numPrice.toLocaleString('en-IN');
        const deliverables = deliverablesRaw ? deliverablesRaw.split("\n").map(d => d.trim()).filter(Boolean) : [
          `${duration} Coverage`,
          `${photographersCount} Professional Photographer(s)`,
          `${editedPhotosCount} Edited High-Resolution Photos`,
          "Online Client Gallery Download"
        ];

        const newPackage = {
          id: "pkg-" + Date.now(),
          name,
          category,
          price: numPrice,
          priceFormatted,
          duration,
          photographersCount,
          editedPhotosCount,
          videoIncluded,
          albumIncluded,
          droneCoverage,
          onlineGallery: true,
          retouching: "Signature Color Grading & Retouch",
          description,
          deliverables,
          popular,
          status
        };

        state.packages.unshift(newPackage);
        addNotification("package-plus", "New Package Published", `${name} (${priceFormatted}) is now live.`);
        saveState();
        closeModal();
        toast("Package Created", `${name} added to packages and rates.`);
        navigateTo("packages");
      }
    );
  }
  else if (action === "new-invoice") {
    const invSettings = state.settings?.invoiceSettings || { prefix: "INV-", currencySymbol: "₹", taxPercent: 18, paymentTerms: "Net 15 Days" };
    const cur = invSettings.currencySymbol || "₹";
    const prefix = invSettings.prefix || "INV-";
    const clientOptions = state.clients.map(c => `<option value="${c.name}">${c.name}</option>`).join("");
    const nextInvId = `${prefix}${1025 + state.invoices.length}`;

    modal(
      "Create New Invoice",
      `
        <div class="form-grid">
          <div class="field">
            <label>Invoice Number</label>
            <input id="invId" value="${nextInvId}" readonly>
          </div>
          <div class="field">
            <label>Client</label>
            <select id="invClient">
              ${clientOptions}
            </select>
          </div>
          <div class="field full">
            <label>Project / Description *</label>
            <input id="invProject" placeholder="e.g. Wedding Photography Full Package" required>
          </div>
          <div class="field">
            <label>Amount (${cur}) *</label>
            <input id="invAmount" placeholder="${cur}1,85,000" value="${cur}1,25,000" required>
          </div>
          <div class="field">
            <label>Due Date</label>
            <input type="date" id="invDueDate" value="2026-08-30">
          </div>
          <div class="field">
            <label>Payment Status</label>
            <select id="invStatus">
              <option value="Pending" selected>Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <div class="field full">
            <label>Invoice Notes & Payment Terms</label>
            <textarea id="invNotes" placeholder="Payment terms: Bank transfer / UPI / Net 15 days...">${invSettings.paymentTerms ? 'Terms: ' + invSettings.paymentTerms + '\n' : ''}${invSettings.notes || ''}</textarea>
          </div>
        </div>
      `,
      "Create Invoice",
      () => {
        const id = $("#invId")?.value || nextInvId;
        const client = $("#invClient")?.value || "Sarah Johnson";
        const project = ($("#invProject")?.value || "").trim();
        const amount = $("#invAmount")?.value || `${cur}1,25,000`;
        const dueDate = $("#invDueDate")?.value || "2026-08-30";
        const status = $("#invStatus")?.value || "Pending";
        const notes = $("#invNotes")?.value || "";

        if (!project) {
          toast("Project Required", "Please enter the invoice project description.");
          return;
        }

        const numericAmount = parseInt(amount.replace(/[^0-9]/g, '') || 0);

        const newInvoice = {
          id,
          client,
          project,
          amount: amount.startsWith(cur) ? amount : cur + amount,
          numericAmount,
          issueDate: new Date().toISOString().split('T')[0],
          dueDate,
          status,
          notes
        };

        state.invoices.unshift(newInvoice);
        addNotification("receipt", "New Invoice Created", `${id} (${amount}) created for ${client}.`);
        saveState();
        closeModal();
        toast("Invoice Created", `${id} generated successfully.`);
        navigateTo("invoices");
      }
    );
  }
  else if (action === "new-gallery") {
    modal(
      "Upload / Add to Gallery",
      `
        <div class="form-grid">
          <div class="field full">
            <label>Photo / Album Title *</label>
            <input id="galTitle" placeholder="e.g. Golden Hour Editorial Portraits" required>
          </div>
          <div class="field">
            <label>Category</label>
            <select id="galCategory">
              <option value="Wedding">Wedding</option>
              <option value="Editorial">Editorial</option>
              <option value="Commercial">Commercial</option>
              <option value="Portraits">Portraits</option>
              <option value="Product">Product</option>
            </select>
          </div>
          <div class="field">
            <label>Visibility Status</label>
            <select id="galStatus">
              <option value="Published" selected>Published (Public)</option>
              <option value="Client Review">Client Review (Protected)</option>
              <option value="Private">Private Archive</option>
            </select>
          </div>
          <div class="field full">
            <label>Select Cover Asset</label>
            <div class="preset-img-picker">
              ${PRESET_IMGS.map((imgUrl, i) => `
                <div class="preset-thumb ${i === 0 ? 'active' : ''}" style="background-image:url('${imgUrl}')" onclick="selectPresetImg(this, '${imgUrl}')"></div>
              `).join("")}
            </div>
          </div>
        </div>
      `,
      "Add to Gallery",
      () => {
        const title = ($("#galTitle")?.value || "").trim();
        if (!title) {
          toast("Title Required", "Please enter a photo or album title.");
          return;
        }
        const category = $("#galCategory")?.value || "Wedding";
        const status = $("#galStatus")?.value || "Published";

        const newGalleryItem = {
          id: "g-" + Date.now(),
          title,
          category,
          client: "Studio Client",
          img: selectedModalImg || PRESET_IMGS[0],
          rating: 5,
          status,
          date: new Date().toISOString().split('T')[0]
        };

        state.gallery.unshift(newGalleryItem);
        addNotification("images", "New Photo Added", `${title} added to ${category} gallery.`);
        saveState();
        closeModal();
        toast("Gallery Updated", `${title} has been added.`);
        navigateTo("gallery");
      }
    );
  }
  else if (action === "insights") {
    modal(
      "AI Studio Intelligence Report",
      `
        <div class="ai-banner" style="margin:0;display:block">
          <div class="eyebrow">LIVE NEURAL AUDIT</div>
          <h2>Studio Performance is +18.4% above benchmark.</h2>
          <p style="margin-top:6px">
            • <strong>Wedding conversions</strong> are at 84%, leading studio margins.<br>
            • <strong>Studio A utilization</strong> is at 92% capacity for weekend sessions.<br>
            • <strong>Team Status:</strong> ${state.photographers.filter(p => p.status === 'Available').length} of ${state.photographers.length} photographers available for immediate booking.<br>
            • <strong>Offerings:</strong> ${state.packages.filter(p => p.status === 'Active').length} active photography service packages published.
          </p>
        </div>
      `,
      "Apply Recommendations",
      () => {
        closeModal();
        toast("Optimization Applied", "Promotional headshot slots opened on Thursday calendar.");
      }
    );
  }
  else if (action === "ai-process") {
    modal(
      "AI Neural Processing",
      `
        <div style="text-align:center;padding:15px 0">
          <div class="ai-orb" style="margin:0 auto 15px"></div>
          <h2>AI is processing high-res captures...</h2>
          <p id="progressText" style="color:var(--muted);margin-top:6px">Analyzing skin texture, facial keypoints, composition and micro-contrast.</p>
          <div class="bar" style="height:6px;margin-top:20px">
            <span id="progressBar" style="width:20%;transition:width 1.8s ease"></span>
          </div>
        </div>
      `,
      "Done",
      () => closeModal()
    );
    setTimeout(() => {
      const p = $("#progressBar");
      if (p) p.style.width = "100%";
      const t = $("#progressText");
      if (t) t.textContent = "Processing complete. 184 images culled and optimized!";
    }, 400);
  }
}

function selectPresetImg(el, url) {
  $$(".preset-thumb").forEach(t => t.classList.remove("active"));
  el.classList.add("active");
  selectedModalImg = url;
}

// --------------------------------------------------------------------------
// DETAILS & ACTION MODALS
// --------------------------------------------------------------------------

function openBookingDetails(id) {
  const b = state.bookings.find(x => x.id === id);
  if (!b) return;

  modal(
    b.title,
    `
      <div style="display:flex;flex-direction:column;gap:12px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span class="badge ${b.location==='Studio A'?'gold':b.location==='Studio B'?'purple':'green'}">${b.location}</span>
          <span class="badge ${b.status==='Confirmed'?'green':'gold'}">${b.status}</span>
        </div>
        <div class="form-grid">
          <div><small class="muted">Client</small><div><strong>${b.client}</strong></div></div>
          <div><small class="muted">Photographer</small><div><strong>${b.photographer}</strong></div></div>
          <div><small class="muted">Date</small><div><strong>${b.date}</strong></div></div>
          <div><small class="muted">Time Slot</small><div><strong>${b.startTime} - ${b.endTime}</strong></div></div>
        </div>
        ${b.notes ? `<div><small class="muted">Notes</small><p style="margin:4px 0">${b.notes}</p></div>` : ''}
        <div style="margin-top:10px;display:flex;gap:8px">
          <button class="btn sm" onclick="toggleBookingStatus('${b.id}')">${icon("refresh-cw")} Toggle Status (${b.status === 'Confirmed' ? 'Mark Completed' : 'Confirm'})</button>
          <button class="btn sm danger" onclick="deleteBooking('${b.id}')">${icon("trash-2")} Delete Session</button>
        </div>
      </div>
    `,
    "Close",
    () => closeModal()
  );
}

function openProjectDetails(id) {
  const p = state.projects.find(x => x.id === id);
  if (!p) return;

  modal(
    p.name,
    `
      <div style="display:flex;flex-direction:column;gap:14px">
        <div style="height:160px;border-radius:8px;background-image:url('${p.img}');background-size:cover;background-position:center"></div>
        <div class="form-grid">
          <div><small class="muted">Client</small><div><strong>${p.client}</strong></div></div>
          <div><small class="muted">Type</small><div><strong>${p.type}</strong></div></div>
          <div><small class="muted">Budget</small><div><strong>${p.budget}</strong></div></div>
          <div><small class="muted">Status</small><div><span class="badge gold">${p.status}</span></div></div>
        </div>
        <div>
          <small class="muted">Production Progress (${p.progress})</small>
          <div class="bar" style="margin-top:4px"><span style="width:${p.progress}"></span></div>
        </div>
        ${p.notes ? `<div><small class="muted">Notes</small><p style="margin:4px 0">${p.notes}</p></div>` : ''}
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="btn sm" onclick="openAction('new-booking', { client: '${p.client}' })">${icon("calendar-plus")} Schedule Session</button>
          <button class="btn sm danger" onclick="deleteProject('${p.id}')">${icon("trash-2")} Delete Project</button>
        </div>
      </div>
    `,
    "Done",
    () => closeModal()
  );
}

function openPhotoDetails(id) {
  const item = state.gallery.find(x => x.id === id);
  if (!item) return;

  modal(
    item.title,
    `
      <div style="display:flex;flex-direction:column;gap:12px">
        <div style="height:240px;border-radius:10px;background-image:url('${item.img}');background-size:cover;background-position:center"></div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <strong>${item.category}</strong> · <span class="muted">${item.status}</span>
          </div>
          <button class="btn sm danger" onclick="deleteGalleryItem('${item.id}')">${icon("trash-2")} Remove</button>
        </div>
      </div>
    `,
    "Close",
    () => closeModal()
  );
}

// Photographer Details, Edit & Delete Modals
function openPhotographerProfile(id) {
  const ph = state.photographers.find(p => p.id === id);
  if (!ph) return;

  const statusClass = ph.status === 'Available' ? 'available' : ph.status === 'Busy' ? 'busy' : 'leave';
  const assignedBookings = state.bookings.filter(b => b.photographer === ph.name);
  const ratingFormatted = Number(ph.rating || 5.0).toFixed(1);

  modal(
    ph.name,
    `
      <div style="display:flex;flex-direction:column;gap:16px">
        <div style="display:flex;gap:16px;align-items:center;background:var(--panel-alt);padding:14px;border-radius:var(--radius);border:1px solid var(--line)">
          <div style="position:relative;width:72px;height:72px;flex-shrink:0">
            <img src="${ph.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid var(--line-gold)" alt="${ph.name}">
            <span class="status-indicator-dot ${statusClass}" style="position:absolute;bottom:2px;right:2px;border:2px solid #14171d"></span>
          </div>
          <div style="flex:1">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div>
                <h3 style="font-size:17px;margin:0 0 2px;color:var(--text-bright)">${ph.name}</h3>
                <div style="font-size:12px;color:var(--gold);font-weight:600">${ph.role || ph.specialization}</div>
              </div>
              <span class="badge ${statusClass}">${ph.status}</span>
            </div>
            <div style="display:flex;gap:12px;margin-top:6px;font-size:11px;color:var(--muted)">
              <span>★ <strong style="color:var(--gold)">${ratingFormatted}</strong> (${ph.reviewsCount || 80}+ reviews)</span>
              <span>·</span>
              <span>${ph.location || 'Mumbai'}</span>
              <span>·</span>
              <span>${ph.experience || '5+ Years'} Exp</span>
            </div>
          </div>
        </div>

        <div class="form-grid">
          <div>
            <small class="muted">Specialization</small>
            <div><strong>${ph.specialization}</strong></div>
          </div>
          <div>
            <small class="muted">Daily / Session Rate</small>
            <div style="color:var(--gold);font-weight:700">${ph.dailyRate || '₹18,000'}</div>
          </div>
          <div>
            <small class="muted">Email Contact</small>
            <div><a href="mailto:${ph.email}" style="color:var(--accent);text-decoration:none">${ph.email}</a></div>
          </div>
          <div>
            <small class="muted">Phone Number</small>
            <div><a href="tel:${ph.phone}" style="color:var(--text-bright);text-decoration:none">${ph.phone}</a></div>
          </div>
        </div>

        <div>
          <small class="muted" style="display:block;margin-bottom:4px">About & Photography Style</small>
          <p style="font-size:12px;color:var(--dim);line-height:1.5;margin:0;background:var(--bg);padding:10px;border-radius:6px;border:1px solid var(--line)">
            ${ph.bio || 'Professional studio photographer with specialization in luxury storytelling.'}
          </p>
        </div>

        <div>
          <small class="muted" style="display:block;margin-bottom:6px">Skills & Equipment Mastery</small>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            ${(ph.skills || [ph.specialization, "Lighting", "Editing", "Camera Rig"]).map(sk => `
              <span class="skill-tag" style="background:var(--panel-alt);border:1px solid var(--line)">${sk}</span>
            `).join("")}
          </div>
        </div>

        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <small class="muted">Scheduled Studio Sessions (${assignedBookings.length})</small>
            <span style="font-size:11px;color:var(--muted)">${ph.currentAssignment || 'Active'}</span>
          </div>
          ${assignedBookings.length > 0 ? `
            <div style="display:flex;flex-direction:column;gap:6px;max-height:120px;overflow-y:auto">
              ${assignedBookings.map(b => `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:var(--panel-alt);border-radius:6px;font-size:11px">
                  <div>
                    <strong>${b.title}</strong>
                    <span class="muted"> · ${b.date} (${b.startTime})</span>
                  </div>
                  <span class="badge sm ${b.status === 'Confirmed' ? 'green' : 'gold'}">${b.status}</span>
                </div>
              `).join("")}
            </div>
          ` : `
            <div style="font-size:11px;color:var(--muted);padding:6px 0">No active bookings scheduled for this photographer right now.</div>
          `}
        </div>

        <div style="display:flex;gap:8px;margin-top:6px;padding-top:10px;border-top:1px solid var(--line);justify-content:space-between;align-items:center">
          <div style="display:flex;gap:8px">
            <button class="btn sm" onclick="openEditPhotographer('${ph.id}')">
              ${icon("edit-3")} Edit Profile
            </button>
            <button class="btn sm danger" onclick="deletePhotographer('${ph.id}')">
              ${icon("trash-2")} Delete
            </button>
          </div>
          <button class="btn primary sm" onclick="closeModal(); openAction('new-booking', { photographer: '${ph.name}' })">
            ${icon("calendar-plus")} Schedule Session
          </button>
        </div>
      </div>
    `,
    "Close",
    () => closeModal()
  );
}

function openEditPhotographer(id) {
  const ph = state.photographers.find(p => p.id === id);
  if (!ph) return;

  selectedModalImg = ph.avatar || PRESET_IMGS[0];

  modal(
    `Edit Photographer — ${ph.name}`,
    `
      <div class="form-grid">
        <div class="field">
          <label>Full Name *</label>
          <input id="editPhName" value="${ph.name}" required>
        </div>
        <div class="field">
          <label>Email Address *</label>
          <input type="email" id="editPhEmail" value="${ph.email}" required>
        </div>
        <div class="field">
          <label>Phone Number *</label>
          <input id="editPhPhone" value="${ph.phone}" required>
        </div>
        <div class="field">
          <label>Role / Job Title *</label>
          <input id="editPhRole" value="${ph.role || ph.specialization}" required>
        </div>
        <div class="field">
          <label>Specialization *</label>
          <select id="editPhSpec">
            <option value="Wedding Photographer" ${ph.specialization === 'Wedding Photographer' ? 'selected' : ''}>Wedding Photographer</option>
            <option value="Portrait Photographer" ${ph.specialization === 'Portrait Photographer' ? 'selected' : ''}>Portrait Photographer</option>
            <option value="Event Photographer" ${ph.specialization === 'Event Photographer' ? 'selected' : ''}>Event Photographer</option>
            <option value="Product Photographer" ${ph.specialization === 'Product Photographer' ? 'selected' : ''}>Product Photographer</option>
            <option value="Cinematic Photographer" ${ph.specialization === 'Cinematic Photographer' ? 'selected' : ''}>Cinematic Photographer</option>
            <option value="Fashion Photographer" ${ph.specialization === 'Fashion Photographer' ? 'selected' : ''}>Fashion Photographer</option>
            <option value="Studio Lead & Commercial" ${ph.specialization === 'Studio Lead & Commercial' ? 'selected' : ''}>Studio Lead & Commercial</option>
            <option value="Pre-Wedding & Drone" ${ph.specialization === 'Pre-Wedding & Drone' ? 'selected' : ''}>Pre-Wedding & Drone</option>
          </select>
        </div>
        <div class="field">
          <label>Experience (Years) *</label>
          <input id="editPhExp" value="${ph.experience || '5 Years'}" required>
        </div>
        <div class="field">
          <label>Location / City *</label>
          <input id="editPhLocation" value="${ph.location || 'Mumbai'}" required>
        </div>
        <div class="field">
          <label>Availability / Status *</label>
          <select id="editPhStatus">
            <option value="Available" ${ph.status === 'Available' ? 'selected' : ''}>Available</option>
            <option value="Busy" ${ph.status === 'Busy' ? 'selected' : ''}>Busy</option>
            <option value="On Leave" ${ph.status === 'On Leave' ? 'selected' : ''}>On Leave</option>
          </select>
        </div>
        <div class="field">
          <label>Rating (1.0 - 5.0)</label>
          <input type="number" id="editPhRating" min="1" max="5" step="0.1" value="${ph.rating || 4.9}">
        </div>
        <div class="field">
          <label>Daily / Session Rate (₹)</label>
          <input id="editPhDailyRate" value="${ph.dailyRate || '₹18,000'}">
        </div>
        <div class="field full">
          <label>Profile Photo URL</label>
          <input id="editPhAvatar" value="${ph.avatar || ''}" placeholder="https://images.unsplash.com/...">
        </div>
        <div class="field full">
          <label>Skills & Specialties (comma separated)</label>
          <input id="editPhSkills" value="${(ph.skills || []).join(', ')}" placeholder="Candid, Flash, Drone...">
        </div>
        <div class="field full">
          <label>Professional Bio</label>
          <textarea id="editPhBio">${ph.bio || ''}</textarea>
        </div>
      </div>
    `,
    "Save Changes",
    () => {
      const name = ($("#editPhName")?.value || "").trim();
      const email = ($("#editPhEmail")?.value || "").trim();
      const phone = ($("#editPhPhone")?.value || "").trim();
      const role = ($("#editPhRole")?.value || "").trim();
      const specialization = $("#editPhSpec")?.value || "Wedding Photographer";
      const experience = ($("#editPhExp")?.value || "").trim();
      const location = ($("#editPhLocation")?.value || "").trim();
      const status = $("#editPhStatus")?.value || "Available";
      const rating = parseFloat($("#editPhRating")?.value) || 4.9;
      const dailyRate = ($("#editPhDailyRate")?.value || "").trim();
      const avatar = ($("#editPhAvatar")?.value || "").trim() || ph.avatar;
      const skillsRaw = ($("#editPhSkills")?.value || "").trim();
      const bio = ($("#editPhBio")?.value || "").trim();

      if (!name) {
        toast("Name Required", "Please provide a valid full name.");
        return;
      }
      if (!email || !email.includes("@")) {
        toast("Valid Email Required", "Please provide a valid email address.");
        return;
      }
      if (!phone) {
        toast("Phone Required", "Please provide a phone number.");
        return;
      }

      ph.name = name;
      ph.email = email;
      ph.phone = phone;
      ph.role = role || specialization;
      ph.specialization = specialization;
      ph.experience = experience || "5+ Years";
      ph.location = location || "Mumbai";
      ph.status = status;
      ph.rating = rating;
      ph.dailyRate = dailyRate.startsWith("₹") ? dailyRate : "₹" + dailyRate;
      ph.avatar = avatar;
      ph.skills = skillsRaw ? skillsRaw.split(",").map(s => s.trim()).filter(Boolean) : ph.skills;
      ph.bio = bio || ph.bio;
      if (status === "Available") ph.currentAssignment = "Available for booking";

      saveState();
      closeModal();
      toast("Photographer Updated", `${name}'s profile was updated successfully.`);
      if (location.hash === '#photographers' || location.hash === '') {
        render('photographers');
      }
    }
  );
}

function deletePhotographer(id) {
  const ph = state.photographers.find(p => p.id === id);
  if (!ph) return;

  modal(
    "Remove Photographer",
    `
      <div style="display:flex;flex-direction:column;gap:12px;padding:4px 0">
        <p style="margin:0;color:var(--text-bright)">
          Are you sure you want to remove <strong>${ph.name}</strong> (${ph.role || ph.specialization}) from your studio team roster?
        </p>
        <p style="margin:0;font-size:12px;color:var(--muted)">
          Existing calendar bookings and past completed projects will be preserved.
        </p>
      </div>
    `,
    "Delete Photographer",
    () => {
      state.photographers = state.photographers.filter(p => p.id !== id);
      addNotification("user-x", "Photographer Removed", `${ph.name} was removed from the team.`);
      saveState();
      closeModal();
      toast("Photographer Removed", `${ph.name} has been removed from the roster.`);
      render('photographers');
    }
  );
  const pBtn = $("#modalPrimaryBtn");
  if (pBtn) pBtn.className = "btn danger";
}

// Package Details, Edit & Delete Modals
function openPackageDetails(id) {
  const pkg = state.packages.find(p => p.id === id);
  if (!pkg) return;

  const deliverables = Array.isArray(pkg.deliverables) ? pkg.deliverables : (pkg.deliverables || "").split("\n").filter(Boolean);
  const formattedPrice = pkg.priceFormatted || ("₹" + Number(pkg.price || 0).toLocaleString('en-IN'));

  modal(
    pkg.name,
    `
      <div style="display:flex;flex-direction:column;gap:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;background:var(--panel-alt);padding:12px 14px;border-radius:var(--radius);border:1px solid var(--line)">
          <div>
            <span class="badge purple" style="margin-bottom:4px">${pkg.category}</span>
            <div style="font-size:22px;font-weight:800;color:var(--gold)">${formattedPrice}</div>
          </div>
          <div style="text-align:right">
            <span class="badge ${pkg.status === 'Active' ? 'green' : 'gold'}">${pkg.status || 'Active'}</span>
            <div style="font-size:11px;color:var(--muted);margin-top:4px">${pkg.duration || 'Session'} Duration</div>
          </div>
        </div>

        <div>
          <small class="muted" style="display:block;margin-bottom:4px">Package Description</small>
          <p style="font-size:12px;color:var(--dim);line-height:1.5;margin:0;background:var(--bg);padding:10px;border-radius:6px;border:1px solid var(--line)">
            ${pkg.description || 'Professional photography coverage tailored for signature excellence.'}
          </p>
        </div>

        <div class="form-grid">
          <div>
            <small class="muted">Photographer Crew</small>
            <div><strong>${pkg.photographersCount || 1} ${pkg.photographersCount === 1 ? 'Photographer' : 'Photographers'}</strong></div>
          </div>
          <div>
            <small class="muted">Edited Captures</small>
            <div><strong>${pkg.editedPhotosCount || 50} High-Res Images</strong></div>
          </div>
          <div>
            <small class="muted">Video Coverage</small>
            <div><strong>${pkg.videoIncluded ? '✓ 4K Included' : 'Not Included'}</strong></div>
          </div>
          <div>
            <small class="muted">Aerial Drone</small>
            <div><strong>${pkg.droneCoverage ? '✓ 4K Drone Included' : 'Not Included'}</strong></div>
          </div>
        </div>

        <div>
          <small class="muted" style="display:block;margin-bottom:8px">Full Deliverables & Inclusions (${deliverables.length})</small>
          <div style="display:flex;flex-direction:column;gap:6px;max-height:160px;overflow-y:auto;background:var(--bg);padding:10px;border-radius:6px;border:1px solid var(--line)">
            ${deliverables.map(d => `
              <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text-bright)">
                <span style="color:#55c58a;display:flex;align-items:center">${icon("check")}</span>
                <span>${d}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div style="display:flex;gap:8px;margin-top:4px;padding-top:10px;border-top:1px solid var(--line);justify-content:space-between;align-items:center">
          <div style="display:flex;gap:8px">
            <button class="btn sm" onclick="openEditPackage('${pkg.id}')">
              ${icon("edit-3")} Edit Package
            </button>
            <button class="btn sm danger" onclick="deletePackage('${pkg.id}')">
              ${icon("trash-2")}
            </button>
          </div>
          <button class="btn primary sm" onclick="closeModal(); openAction('new-booking', { title: '${pkg.name} Session', package: '${pkg.name}', type: '${pkg.category} Portraits' })">
            ${icon("calendar-plus")} Book This Package
          </button>
        </div>
      </div>
    `,
    "Close",
    () => closeModal()
  );
}

function openEditPackage(id) {
  const pkg = state.packages.find(p => p.id === id);
  if (!pkg) return;

  const deliverablesStr = Array.isArray(pkg.deliverables) ? pkg.deliverables.join("\n") : (pkg.deliverables || "");

  modal(
    `Edit Package — ${pkg.name}`,
    `
      <div class="form-grid">
        <div class="field full">
          <label>Package Name *</label>
          <input id="editPkgName" value="${pkg.name}" required>
        </div>
        <div class="field">
          <label>Category *</label>
          <select id="editPkgCat">
            <option value="Wedding" ${pkg.category === 'Wedding' ? 'selected' : ''}>Wedding</option>
            <option value="Portrait" ${pkg.category === 'Portrait' ? 'selected' : ''}>Portrait</option>
            <option value="Event" ${pkg.category === 'Event' ? 'selected' : ''}>Event</option>
            <option value="Product" ${pkg.category === 'Product' ? 'selected' : ''}>Product</option>
            <option value="Fashion" ${pkg.category === 'Fashion' ? 'selected' : ''}>Fashion</option>
            <option value="Pre-Wedding" ${pkg.category === 'Pre-Wedding' ? 'selected' : ''}>Pre-Wedding</option>
          </select>
        </div>
        <div class="field">
          <label>Price (₹ INR) *</label>
          <input id="editPkgPrice" value="${pkg.priceFormatted || ('₹' + pkg.price)}" required>
        </div>
        <div class="field">
          <label>Duration *</label>
          <input id="editPkgDuration" value="${pkg.duration || '8 Hours'}" required>
        </div>
        <div class="field">
          <label>Number of Photographers *</label>
          <input type="number" id="editPkgPhotographers" min="1" max="10" value="${pkg.photographersCount || 1}" required>
        </div>
        <div class="field">
          <label>Number of Edited Photos *</label>
          <input type="number" id="editPkgPhotos" min="5" max="5000" value="${pkg.editedPhotosCount || 50}" required>
        </div>
        <div class="field">
          <label>Status *</label>
          <select id="editPkgStatus">
            <option value="Active" ${pkg.status === 'Active' ? 'selected' : ''}>Active (Published)</option>
            <option value="Inactive" ${pkg.status === 'Inactive' ? 'selected' : ''}>Inactive (Draft)</option>
          </select>
        </div>
        <div class="field full">
          <label>Package Description *</label>
          <textarea id="editPkgDesc" required>${pkg.description || ''}</textarea>
        </div>
        <div class="field full">
          <label>Inclusions & Features</label>
          <div style="display:flex;gap:18px;flex-wrap:wrap;padding:6px 0">
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px">
              <input type="checkbox" id="editPkgVideo" ${pkg.videoIncluded ? 'checked' : ''}> 4K Video Included
            </label>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px">
              <input type="checkbox" id="editPkgDrone" ${pkg.droneCoverage ? 'checked' : ''}> Aerial Drone Coverage
            </label>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px">
              <input type="checkbox" id="editPkgAlbum" ${pkg.albumIncluded ? 'checked' : ''}> Flushmount Album
            </label>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px">
              <input type="checkbox" id="editPkgPopular" ${pkg.popular ? 'checked' : ''}> "Popular Choice" Badge
            </label>
          </div>
        </div>
        <div class="field full">
          <label>Deliverables (1 line per deliverable item) *</label>
          <textarea id="editPkgDeliverables" style="height:110px">${deliverablesStr}</textarea>
        </div>
      </div>
    `,
    "Save Changes",
    () => {
      const name = ($("#editPkgName")?.value || "").trim();
      const category = $("#editPkgCat")?.value || "Wedding";
      const rawPrice = ($("#editPkgPrice")?.value || "").trim();
      const duration = ($("#editPkgDuration")?.value || "").trim();
      const photographersCount = parseInt($("#editPkgPhotographers")?.value) || 1;
      const editedPhotosCount = parseInt($("#editPkgPhotos")?.value) || 50;
      const status = $("#editPkgStatus")?.value || "Active";
      const description = ($("#editPkgDesc")?.value || "").trim();
      const videoIncluded = !!$("#editPkgVideo")?.checked;
      const droneCoverage = !!$("#editPkgDrone")?.checked;
      const albumIncluded = !!$("#editPkgAlbum")?.checked;
      const popular = !!$("#editPkgPopular")?.checked;
      const deliverablesRaw = ($("#editPkgDeliverables")?.value || "").trim();

      if (!name) {
        toast("Name Required", "Please enter package name.");
        return;
      }
      if (!rawPrice) {
        toast("Price Required", "Please enter price.");
        return;
      }
      if (!description) {
        toast("Description Required", "Please enter description.");
        return;
      }

      const numPrice = parseInt(rawPrice.replace(/[^0-9]/g, '')) || pkg.price;
      const priceFormatted = "₹" + numPrice.toLocaleString('en-IN');
      const deliverables = deliverablesRaw ? deliverablesRaw.split("\n").map(d => d.trim()).filter(Boolean) : pkg.deliverables;

      pkg.name = name;
      pkg.category = category;
      pkg.price = numPrice;
      pkg.priceFormatted = priceFormatted;
      pkg.duration = duration || "Full Session";
      pkg.photographersCount = photographersCount;
      pkg.editedPhotosCount = editedPhotosCount;
      pkg.status = status;
      pkg.description = description;
      pkg.videoIncluded = videoIncluded;
      pkg.droneCoverage = droneCoverage;
      pkg.albumIncluded = albumIncluded;
      pkg.popular = popular;
      pkg.deliverables = deliverables;

      saveState();
      closeModal();
      toast("Package Updated", `${name} pricing and details were saved.`);
      if (location.hash === '#packages' || location.hash === '') {
        render('packages');
      }
    }
  );
}

function deletePackage(id) {
  const pkg = state.packages.find(p => p.id === id);
  if (!pkg) return;

  modal(
    "Delete Package",
    `
      <div style="display:flex;flex-direction:column;gap:12px;padding:4px 0">
        <p style="margin:0;color:var(--text-bright)">
          Are you sure you want to delete <strong>${pkg.name}</strong> (${pkg.priceFormatted || ('₹' + pkg.price)}) from your studio packages and rates catalog?
        </p>
        <p style="margin:0;font-size:12px;color:var(--muted)">
          Any existing bookings created under this package will remain safe.
        </p>
      </div>
    `,
    "Delete Package",
    () => {
      state.packages = state.packages.filter(p => p.id !== id);
      addNotification("package-x", "Package Deleted", `${pkg.name} was removed from the service catalog.`);
      saveState();
      closeModal();
      toast("Package Deleted", `${pkg.name} was removed from the catalog.`);
      render('packages');
    }
  );
  const pBtn = $("#modalPrimaryBtn");
  if (pBtn) pBtn.className = "btn danger";
}

// --------------------------------------------------------------------------
// STATE MUTATION HELPERS
// --------------------------------------------------------------------------

function deleteClient(id) {
  state.clients = state.clients.filter(c => c.id !== id);
  saveState();
  closeModal();
  toast("Client Removed", "The client record was deleted.");
  render(location.hash.slice(1) || 'clients');
}

function deleteProject(id) {
  state.projects = state.projects.filter(p => p.id !== id);
  saveState();
  closeModal();
  toast("Project Deleted", "The project was removed from your portfolio.");
  render(location.hash.slice(1) || 'projects');
}

function deleteBooking(id) {
  state.bookings = state.bookings.filter(b => b.id !== id);
  saveState();
  closeModal();
  toast("Booking Cancelled", "The booking was removed from the calendar.");
  render(location.hash.slice(1) || 'calendar');
}

function deleteInvoice(id) {
  state.invoices = state.invoices.filter(i => i.id !== id);
  saveState();
  closeModal();
  toast("Invoice Deleted", "The invoice was removed.");
  render(location.hash.slice(1) || 'invoices');
}

function deleteGalleryItem(id) {
  state.gallery = state.gallery.filter(g => g.id !== id);
  saveState();
  closeModal();
  toast("Photo Removed", "Photo was removed from the gallery.");
  render(location.hash.slice(1) || 'gallery');
}

function toggleBookingStatus(id) {
  const b = state.bookings.find(x => x.id === id);
  if (b) {
    b.status = b.status === 'Confirmed' ? 'Completed' : 'Confirmed';
    saveState();
    closeModal();
    toast("Status Updated", `Session status changed to ${b.status}.`);
    render(location.hash.slice(1) || 'calendar');
  }
}

function toggleInvoicePaid(id) {
  const inv = state.invoices.find(x => x.id === id);
  if (inv) {
    inv.status = inv.status === 'Paid' ? 'Pending' : 'Paid';
    saveState();
    toast("Invoice Updated", `${inv.id} marked as ${inv.status}.`);
    render(location.hash.slice(1) || 'invoices');
  }
}

function addNotification(iconName, title, msg) {
  state.notifications.unshift({
    id: "n-" + Date.now(),
    icon: iconName,
    title,
    msg,
    time: "Just now",
    read: false
  });
  updateNotifBadge();
}

function markAllNotificationsRead() {
  state.notifications.forEach(n => n.read = true);
  saveState();
  updateNotifBadge();
  toast("Notifications Read", "All notifications marked as read.");
  render('notifications');
}

function markNotificationRead(id) {
  const n = state.notifications.find(x => x.id === id);
  if (n) {
    n.read = true;
    saveState();
    updateNotifBadge();
    render('notifications');
  }
}

function clearAllNotifications() {
  state.notifications = [];
  saveState();
  updateNotifBadge();
  toast("Cleared", "All notifications removed.");
  render('notifications');
}

function updateNotifBadge() {
  const unread = state.notifications.filter(n => !n.read).length;
  const notifBtn = $("#notifBtn");
  if (notifBtn) {
    notifBtn.classList.toggle("has-dot", unread > 0);
  }
  const navBadge = $("a[data-page='notifications'] em");
  if (navBadge) {
    navBadge.textContent = unread;
    navBadge.style.display = unread > 0 ? 'inline-block' : 'none';
  }
}

// ==========================================================================
// SETTINGS SAVE & INTERACTIVE HANDLERS
// ==========================================================================

function saveActiveSettingsSection() {
  switch (currentSettingsTab) {
    case "studio-profile":
      saveStudioProfile();
      break;
    case "account-team":
      saveAccountSettings();
      break;
    case "rooms-equipment":
      toast("Resources Active", "Use '+ Add Room' or '+ Add Equipment' to manage studio resources.");
      break;
    case "bookings-hours":
      saveBookingHoursSettings();
      break;
    case "invoices-tax":
      saveInvoiceTaxSettings();
      break;
    case "ai-engine":
      saveAiEngineSettings();
      break;
    case "theme-display":
      saveThemeDisplaySettings();
      break;
    default:
      saveStudioProfile();
  }
}

// 1. Studio Profile Save
function saveStudioProfile() {
  const btn = $("#btnSaveStudioProfile");
  const msg = $("#studioProfileMsg");
  
  const studioName = ($("#setStudioName")?.value || "").trim();
  const owner = ($("#setOwner")?.value || "").trim();
  const email = ($("#setEmail")?.value || "").trim();
  const phone = ($("#setPhone")?.value || "").trim();
  const address = ($("#setAddress")?.value || "").trim();
  const city = ($("#setCity")?.value || "").trim();
  const country = ($("#setCountry")?.value || "").trim();
  const website = ($("#setWebsite")?.value || "").trim();
  const logo = ($("#setLogo")?.value || "").trim();
  const bio = ($("#setBio")?.value || "").trim();

  if (!studioName) {
    toast("Studio Name Required", "Please enter a valid studio name.");
    if (msg) { msg.className = "settings-msg error"; msg.textContent = "⚠ Studio name is required."; }
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    toast("Invalid Email", "Please enter a valid contact email address.");
    if (msg) { msg.className = "settings-msg error"; msg.textContent = "⚠ Valid email is required."; }
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner" style="display:inline-block;width:12px;height:12px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin 0.6s linear infinite;margin-right:6px"></span> Saving...`;
  }
  if (msg) { msg.className = "settings-msg loading"; msg.textContent = "Saving changes to database..."; }

  const profileData = { studioName, owner, email, phone, address, city, country, website, logo, bio };
  
  state.settings.studioProfile = profileData;
  state.settings.studioName = studioName;
  state.settings.owner = owner;
  state.settings.email = email;
  state.settings.bio = bio;

  // Update topbar & sidebar live
  const profileName = $("#profileBtn strong");
  if (profileName) profileName.textContent = owner;
  const studioBadge = $(".studio-card strong");
  if (studioBadge) studioBadge.textContent = studioName;

  saveState();

  // Call Backend API
  fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section: 'studioProfile', data: profileData })
  })
  .then(res => res.json())
  .then(data => {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `${icon("save")} Save Changes`;
      initIcons();
    }
    if (msg) {
      msg.className = "settings-msg success";
      msg.textContent = "✓ Studio profile updated successfully.";
      setTimeout(() => { if (msg.textContent.includes("✓")) msg.textContent = ""; }, 4000);
    }
    toast("Settings Saved", "Studio profile updated successfully.");
  })
  .catch(err => {
    console.error("Save profile error:", err);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `${icon("save")} Save Changes`;
      initIcons();
    }
    if (msg) {
      msg.className = "settings-msg error";
      msg.textContent = "⚠ Unable to sync to server, saved locally.";
    }
    toast("Saved Locally", "Saved to local memory.");
  });
}

// 2. Account & Password Save
function saveAccountSettings() {
  const btn = $("#btnSaveAccount");
  const msg = $("#accountMsg");

  const ownerName = ($("#accOwnerName")?.value || "").trim();
  const role = ($("#accRole")?.value || "Studio Owner").trim();
  const phone = ($("#accPhone")?.value || "").trim();
  const currentPassword = $("#accCurrentPassword")?.value || "";
  const newPassword = $("#accNewPassword")?.value || "";
  const confirmPassword = $("#accConfirmPassword")?.value || "";

  if (newPassword) {
    if (newPassword.length < 6) {
      toast("Password Too Short", "New password must be at least 6 characters.");
      if (msg) { msg.className = "settings-msg error"; msg.textContent = "⚠ Password must be at least 6 characters."; }
      return;
    }
    if (newPassword !== confirmPassword) {
      toast("Password Mismatch", "New passwords do not match.");
      if (msg) { msg.className = "settings-msg error"; msg.textContent = "⚠ New passwords do not match."; }
      return;
    }
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `Saving...`;
  }
  if (msg) { msg.className = "settings-msg loading"; msg.textContent = "Updating account credentials..."; }

  state.settings.account = {
    ...(state.settings.account || {}),
    ownerName,
    role,
    phone
  };
  saveState();

  // If password change is requested, call password API
  const promises = [
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'account', data: state.settings.account })
    })
  ];

  if (newPassword) {
    promises.push(
      fetch('/api/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: state.settings.account.email || 'admin@frameai.com',
          currentPassword,
          newPassword,
          confirmPassword
        })
      }).then(r => r.json())
    );
  }

  Promise.all(promises)
    .then(([setRes, passRes]) => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `${icon("save")} Save Profile & Password`;
        initIcons();
      }
      if (passRes && passRes.error) {
        if (msg) { msg.className = "settings-msg error"; msg.textContent = `⚠ ${passRes.error}`; }
        toast("Password Error", passRes.error);
        return;
      }
      // Reset password inputs
      if ($("#accCurrentPassword")) $("#accCurrentPassword").value = "";
      if ($("#accNewPassword")) $("#accNewPassword").value = "";
      if ($("#accConfirmPassword")) $("#accConfirmPassword").value = "";

      if (msg) {
        msg.className = "settings-msg success";
        msg.textContent = "✓ Account profile & credentials saved successfully.";
        setTimeout(() => { if (msg.textContent.includes("✓")) msg.textContent = ""; }, 4000);
      }
      toast("Account Saved", "Account profile and security updated.");
    })
    .catch(err => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `${icon("save")} Save Profile & Password`;
        initIcons();
      }
      if (msg) { msg.className = "settings-msg error"; msg.textContent = "⚠ Error saving account settings."; }
      toast("Error", "Could not save account settings.");
    });
}

// Team Member CRUD
function openAddTeamMemberModal() {
  modal(
    "Add Team Member",
    `
      <div class="form-grid">
        <div class="field full">
          <label>Full Name *</label>
          <input id="teamName" placeholder="e.g. Priya Sharma" required>
        </div>
        <div class="field">
          <label>Email Address *</label>
          <input type="email" id="teamEmail" placeholder="priya@frameai.studio" required>
        </div>
        <div class="field">
          <label>Role / Position *</label>
          <select id="teamRole">
            <option value="Studio Owner">Studio Owner</option>
            <option value="Manager">Studio Manager</option>
            <option value="Photographer" selected>Senior Photographer</option>
            <option value="Editor">Retoucher / Colorist</option>
            <option value="Assistant">Lighting Assistant</option>
          </select>
        </div>
        <div class="field">
          <label>Phone Number</label>
          <input id="teamPhone" placeholder="+91 98200 11223">
        </div>
        <div class="field">
          <label>Account Status</label>
          <select id="teamStatus">
            <option value="Active" selected>Active</option>
            <option value="Inactive">Inactive / On Leave</option>
          </select>
        </div>
      </div>
    `,
    "Add Member",
    () => {
      const name = ($("#teamName")?.value || "").trim();
      const email = ($("#teamEmail")?.value || "").trim();
      const role = $("#teamRole")?.value || "Photographer";
      const phone = ($("#teamPhone")?.value || "").trim();
      const status = $("#teamStatus")?.value || "Active";

      if (!name || !email) {
        toast("Missing Fields", "Please enter member name and email.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast("Invalid Email", "Please enter a valid email format.");
        return;
      }

      const newMember = {
        id: "tm-" + Date.now(),
        name,
        email,
        role,
        phone,
        status
      };

      if (!state.team) state.team = [];
      state.team.push(newMember);
      saveState();

      // Backend sync
      fetch('/api/settings/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', member: newMember })
      }).catch(() => {});

      closeModal();
      toast("Team Member Added", `${name} added as ${role}.`);
      switchSettingsTab("account-team");
    }
  );
}

function openEditTeamMemberModal(id) {
  const m = (state.team || []).find(t => t.id === id);
  if (!m) return;

  modal(
    `Edit Team Member — ${m.name}`,
    `
      <div class="form-grid">
        <div class="field full">
          <label>Full Name *</label>
          <input id="editTeamName" value="${m.name}" required>
        </div>
        <div class="field">
          <label>Email Address *</label>
          <input type="email" id="editTeamEmail" value="${m.email}" required>
        </div>
        <div class="field">
          <label>Role / Position</label>
          <select id="editTeamRole">
            <option value="Studio Owner" ${m.role==='Studio Owner'?'selected':''}>Studio Owner</option>
            <option value="Manager" ${m.role==='Manager'?'selected':''}>Studio Manager</option>
            <option value="Photographer" ${m.role.includes('Photographer')?'selected':''}>Photographer</option>
            <option value="Editor" ${m.role.includes('Editor')||m.role.includes('Retoucher')?'selected':''}>Retoucher / Editor</option>
            <option value="Assistant" ${m.role.includes('Assistant')?'selected':''}>Lighting Assistant</option>
          </select>
        </div>
        <div class="field">
          <label>Phone Number</label>
          <input id="editTeamPhone" value="${m.phone || ''}">
        </div>
        <div class="field">
          <label>Status</label>
          <select id="editTeamStatus">
            <option value="Active" ${m.status==='Active'?'selected':''}>Active</option>
            <option value="Inactive" ${m.status==='Inactive'?'selected':''}>Inactive / On Leave</option>
          </select>
        </div>
      </div>
    `,
    "Save Member",
    () => {
      const name = ($("#editTeamName")?.value || "").trim();
      const email = ($("#editTeamEmail")?.value || "").trim();
      const role = $("#editTeamRole")?.value || m.role;
      const phone = ($("#editTeamPhone")?.value || "").trim();
      const status = $("#editTeamStatus")?.value || "Active";

      if (!name || !email) {
        toast("Missing Fields", "Please provide name and email.");
        return;
      }

      m.name = name;
      m.email = email;
      m.role = role;
      m.phone = phone;
      m.status = status;

      saveState();

      // Backend sync
      fetch('/api/settings/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'edit', member: m, id: m.id })
      }).catch(() => {});

      closeModal();
      toast("Team Member Updated", `${name}'s profile was updated.`);
      switchSettingsTab("account-team");
    }
  );
}

function deleteTeamMember(id) {
  const m = (state.team || []).find(t => t.id === id);
  if (!m) return;

  modal(
    "Remove Team Member",
    `
      <div style="padding:4px 0">
        <p style="color:var(--text-bright);margin:0">Are you sure you want to remove <strong>${m.name}</strong> (${m.role}) from your studio team roster?</p>
        <p style="color:var(--muted);font-size:12px;margin-top:6px">Past shoot records and attribution will remain intact.</p>
      </div>
    `,
    "Remove Member",
    () => {
      state.team = state.team.filter(t => t.id !== id);
      saveState();

      // Backend sync
      fetch('/api/settings/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      }).catch(() => {});

      closeModal();
      toast("Member Removed", `${m.name} was removed from the team.`);
      switchSettingsTab("account-team");
    }
  );
  const pBtn = $("#modalPrimaryBtn");
  if (pBtn) pBtn.className = "btn danger";
}

// 3. Rooms & Equipment CRUD
function openAddRoomModal() {
  modal(
    "Add Studio Room / Production Set",
    `
      <div class="form-grid">
        <div class="field full">
          <label>Room Name *</label>
          <input id="roomName" placeholder="e.g. Studio C — Daylight Loft" required>
        </div>
        <div class="field">
          <label>Room Type *</label>
          <select id="roomType">
            <option value="Main Cyclorama">Main Cyclorama</option>
            <option value="Portrait & Product">Portrait & Product</option>
            <option value="Post-Production Suite">Post-Production Suite</option>
            <option value="Outdoor Daylight">Outdoor Daylight</option>
          </select>
        </div>
        <div class="field">
          <label>Capacity</label>
          <input id="roomCapacity" placeholder="e.g. 20 People" value="15 People">
        </div>
        <div class="field">
          <label>Hourly Booking Rate *</label>
          <input id="roomRate" placeholder="₹3,500/hr" value="₹3,500/hr" required>
        </div>
        <div class="field">
          <label>Availability Status</label>
          <select id="roomStatus">
            <option value="Available" selected>Available</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        <div class="field full">
          <label>Room Description & Facilities</label>
          <textarea id="roomDesc" placeholder="Dimensions, lighting grid, acoustic treatment, backdrops..."></textarea>
        </div>
      </div>
    `,
    "Create Room",
    () => {
      const name = ($("#roomName")?.value || "").trim();
      const type = $("#roomType")?.value || "Portrait & Product";
      const capacity = ($("#roomCapacity")?.value || "15 People").trim();
      const hourlyRate = ($("#roomRate")?.value || "₹3,500/hr").trim();
      const status = $("#roomStatus")?.value || "Available";
      const description = ($("#roomDesc")?.value || "").trim();

      if (!name) {
        toast("Name Required", "Please enter a room name.");
        return;
      }

      const newRoom = {
        id: "rm-" + Date.now(),
        name,
        type,
        capacity,
        hourlyRate: hourlyRate.startsWith("₹") ? hourlyRate : "₹" + hourlyRate,
        status,
        description: description || "Professional shooting set with dedicated lighting and backdrops."
      };

      if (!state.resources) state.resources = { rooms: [], equipment: [] };
      if (!state.resources.rooms) state.resources.rooms = [];
      state.resources.rooms.push(newRoom);
      saveState();

      // Backend sync
      fetch('/api/settings/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', type: 'room', item: newRoom })
      }).catch(() => {});

      closeModal();
      toast("Room Added", `${name} is now available for bookings.`);
      switchSettingsTab("rooms-equipment");
    }
  );
}

function openEditRoomModal(id) {
  const r = (state.resources?.rooms || []).find(x => x.id === id);
  if (!r) return;

  modal(
    `Edit Room — ${r.name}`,
    `
      <div class="form-grid">
        <div class="field full">
          <label>Room Name *</label>
          <input id="editRoomName" value="${r.name}" required>
        </div>
        <div class="field">
          <label>Room Type</label>
          <select id="editRoomType">
            <option value="Main Cyclorama" ${r.type.includes('Cyclorama')?'selected':''}>Main Cyclorama</option>
            <option value="Portrait & Product" ${r.type.includes('Portrait')?'selected':''}>Portrait & Product</option>
            <option value="Post-Production Suite" ${r.type.includes('Suite')?'selected':''}>Post-Production Suite</option>
            <option value="Outdoor Daylight" ${r.type.includes('Outdoor')?'selected':''}>Outdoor Daylight</option>
          </select>
        </div>
        <div class="field">
          <label>Capacity</label>
          <input id="editRoomCapacity" value="${r.capacity || '15 People'}">
        </div>
        <div class="field">
          <label>Hourly Rate</label>
          <input id="editRoomRate" value="${r.hourlyRate || '₹3,000/hr'}">
        </div>
        <div class="field">
          <label>Status</label>
          <select id="editRoomStatus">
            <option value="Available" ${r.status==='Available'?'selected':''}>Available</option>
            <option value="Maintenance" ${r.status==='Maintenance'?'selected':''}>Maintenance</option>
          </select>
        </div>
        <div class="field full">
          <label>Description</label>
          <textarea id="editRoomDesc">${r.description || ''}</textarea>
        </div>
      </div>
    `,
    "Save Room",
    () => {
      const name = ($("#editRoomName")?.value || "").trim();
      if (!name) return;

      r.name = name;
      r.type = $("#editRoomType")?.value || r.type;
      r.capacity = $("#editRoomCapacity")?.value || r.capacity;
      r.hourlyRate = $("#editRoomRate")?.value || r.hourlyRate;
      r.status = $("#editRoomStatus")?.value || r.status;
      r.description = $("#editRoomDesc")?.value || r.description;

      saveState();

      // Backend sync
      fetch('/api/settings/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'edit', type: 'room', item: r, id: r.id })
      }).catch(() => {});

      closeModal();
      toast("Room Updated", `${name} details saved.`);
      switchSettingsTab("rooms-equipment");
    }
  );
}

function deleteRoom(id) {
  const r = (state.resources?.rooms || []).find(x => x.id === id);
  if (!r) return;

  modal(
    "Delete Room",
    `<p style="color:var(--text-bright)">Are you sure you want to delete <strong>${r.name}</strong> from your studio facilities?</p>`,
    "Delete Room",
    () => {
      state.resources.rooms = state.resources.rooms.filter(x => x.id !== id);
      saveState();

      fetch('/api/settings/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', type: 'room', id })
      }).catch(() => {});

      closeModal();
      toast("Room Removed", `${r.name} deleted.`);
      switchSettingsTab("rooms-equipment");
    }
  );
  const pBtn = $("#modalPrimaryBtn");
  if (pBtn) pBtn.className = "btn danger";
}

function openAddEquipmentModal() {
  modal(
    "Add Equipment / Gear Item",
    `
      <div class="form-grid">
        <div class="field full">
          <label>Equipment / Item Name *</label>
          <input id="eqName" placeholder="e.g. Sony Alpha 1 or Profoto B10X" required>
        </div>
        <div class="field">
          <label>Category *</label>
          <select id="eqCategory">
            <option value="Cameras">Cameras</option>
            <option value="Lenses">Lenses</option>
            <option value="Lighting">Lighting</option>
            <option value="Other Equipment">Other Equipment</option>
          </select>
        </div>
        <div class="field">
          <label>Serial Number</label>
          <input id="eqSerial" placeholder="e.g. SN-SNY-9901">
        </div>
        <div class="field">
          <label>Storage Location</label>
          <input id="eqLocation" placeholder="e.g. Studio A or Gear Vault" value="Gear Vault">
        </div>
        <div class="field">
          <label>Current Status</label>
          <select id="eqStatus">
            <option value="Ready" selected>Ready (Available)</option>
            <option value="In Use">In Use</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>
    `,
    "Register Equipment",
    () => {
      const name = ($("#eqName")?.value || "").trim();
      const category = $("#eqCategory")?.value || "Cameras";
      const serial = ($("#eqSerial")?.value || `SN-GEAR-${Math.floor(1000 + Math.random()*9000)}`).trim();
      const location = ($("#eqLocation")?.value || "Gear Vault").trim();
      const status = $("#eqStatus")?.value || "Ready";

      if (!name) {
        toast("Name Required", "Please enter the equipment name.");
        return;
      }

      const newItem = {
        id: "eq-" + Date.now(),
        name,
        category,
        serial,
        location,
        status
      };

      if (!state.resources) state.resources = { rooms: [], equipment: [] };
      if (!state.resources.equipment) state.resources.equipment = [];
      state.resources.equipment.push(newItem);
      saveState();

      // Backend sync
      fetch('/api/settings/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', type: 'equipment', item: newItem })
      }).catch(() => {});

      closeModal();
      toast("Equipment Registered", `${name} added to gear inventory.`);
      switchSettingsTab("rooms-equipment");
    }
  );
}

function openEditEquipmentModal(id) {
  const e = (state.resources?.equipment || []).find(x => x.id === id);
  if (!e) return;

  modal(
    `Edit Gear — ${e.name}`,
    `
      <div class="form-grid">
        <div class="field full">
          <label>Equipment Name *</label>
          <input id="editEqName" value="${e.name}" required>
        </div>
        <div class="field">
          <label>Category</label>
          <select id="editEqCat">
            <option value="Cameras" ${e.category==='Cameras'?'selected':''}>Cameras</option>
            <option value="Lenses" ${e.category==='Lenses'?'selected':''}>Lenses</option>
            <option value="Lighting" ${e.category==='Lighting'?'selected':''}>Lighting</option>
            <option value="Other Equipment" ${e.category==='Other Equipment'?'selected':''}>Other Equipment</option>
          </select>
        </div>
        <div class="field">
          <label>Serial Number</label>
          <input id="editEqSerial" value="${e.serial || ''}">
        </div>
        <div class="field">
          <label>Location</label>
          <input id="editEqLoc" value="${e.location || 'Gear Vault'}">
        </div>
        <div class="field">
          <label>Status</label>
          <select id="editEqStatus">
            <option value="Ready" ${e.status==='Ready'?'selected':''}>Ready</option>
            <option value="In Use" ${e.status==='In Use'?'selected':''}>In Use</option>
            <option value="Maintenance" ${e.status==='Maintenance'?'selected':''}>Maintenance</option>
          </select>
        </div>
      </div>
    `,
    "Save Gear",
    () => {
      const name = ($("#editEqName")?.value || "").trim();
      if (!name) return;

      e.name = name;
      e.category = $("#editEqCat")?.value || e.category;
      e.serial = $("#editEqSerial")?.value || e.serial;
      e.location = $("#editEqLoc")?.value || e.location;
      e.status = $("#editEqStatus")?.value || e.status;

      saveState();

      fetch('/api/settings/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'edit', type: 'equipment', item: e, id: e.id })
      }).catch(() => {});

      closeModal();
      toast("Gear Updated", `${name} inventory record saved.`);
      switchSettingsTab("rooms-equipment");
    }
  );
}

function deleteEquipment(id) {
  const e = (state.resources?.equipment || []).find(x => x.id === id);
  if (!e) return;

  modal(
    "Remove Equipment",
    `<p style="color:var(--text-bright)">Are you sure you want to remove <strong>${e.name}</strong> from your gear vault?</p>`,
    "Remove Item",
    () => {
      state.resources.equipment = state.resources.equipment.filter(x => x.id !== id);
      saveState();

      fetch('/api/settings/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', type: 'equipment', id })
      }).catch(() => {});

      closeModal();
      toast("Equipment Removed", `${e.name} removed from gear vault.`);
      switchSettingsTab("rooms-equipment");
    }
  );
  const pBtn = $("#modalPrimaryBtn");
  if (pBtn) pBtn.className = "btn danger";
}

function filterEquipmentCategory(cat, btn) {
  activeEquipmentFilter = cat;
  $$(".setting-section-card .toolbar button").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  const equipment = state.resources?.equipment || [];
  const filtered = cat === 'All' ? equipment : equipment.filter(e => e.category === cat);
  const grid = $("#equipmentGrid");
  if (grid) grid.innerHTML = renderEquipmentCards(filtered);
}

// 4. Bookings & Hours Functions
function toggleWorkingDay(day) {
  if (!state.settings.bookingHours) state.settings.bookingHours = {};
  if (!state.settings.bookingHours.workingDays) {
    state.settings.bookingHours.workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  }

  const days = state.settings.bookingHours.workingDays;
  const idx = days.indexOf(day);
  if (idx !== -1) {
    days.splice(idx, 1);
  } else {
    days.push(day);
  }

  // Update UI chip immediately
  const chip = $(`#workingDaysPicker .day-toggle-chip[data-day="${day}"]`);
  if (chip) {
    const isOpen = days.includes(day);
    chip.className = `day-toggle-chip ${isOpen ? 'active' : 'closed'}`;
    chip.innerHTML = `<span>${day.slice(0, 3)}</span><small>${isOpen ? '✓ Open' : '✕ Closed'}</small>`;
  }
}

function saveBookingHoursSettings() {
  const btn = $("#btnSaveBookingHours");
  const msg = $("#bookingHoursMsg");

  const openingTime = $("#setOpenTime")?.value || "09:00";
  const closingTime = $("#setCloseTime")?.value || "20:00";
  const breakHours = ($("#setBreakHours")?.value || "13:00 - 14:00").trim();
  const defaultDuration = $("#setDefaultDuration")?.value || "3 Hours";
  const bufferMinutes = parseInt($("#setBufferMinutes")?.value) || 30;
  const maxDailyBookings = parseInt($("#setMaxDailyBookings")?.value) || 8;
  const workingDays = state.settings.bookingHours?.workingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const bookingData = {
    openingTime,
    closingTime,
    breakHours,
    defaultDuration,
    bufferMinutes,
    maxDailyBookings,
    workingDays,
    autoConfirm: true
  };

  state.settings.bookingHours = bookingData;
  saveState();

  if (btn) { btn.disabled = true; btn.innerHTML = `Saving Schedule...`; }
  if (msg) { msg.className = "settings-msg loading"; msg.textContent = "Updating booking engine schedule..."; }

  fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section: 'bookingHours', data: bookingData })
  })
  .then(() => {
    if (btn) { btn.disabled = false; btn.innerHTML = `${icon("save")} Save Schedule`; initIcons(); }
    if (msg) {
      msg.className = "settings-msg success";
      msg.textContent = "✓ Studio operating hours & schedule updated successfully.";
      setTimeout(() => { if (msg.textContent.includes("✓")) msg.textContent = ""; }, 4000);
    }
    toast("Schedule Saved", "Operating hours and booking availability updated.");
  })
  .catch(() => {
    if (btn) { btn.disabled = false; btn.innerHTML = `${icon("save")} Save Schedule`; initIcons(); }
    if (msg) { msg.className = "settings-msg success"; msg.textContent = "✓ Saved locally."; }
    toast("Saved", "Schedule saved.");
  });
}

// 5. Invoices & Tax Functions
function updateCurrencySymbolPreview(currency) {
  const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'د.إ' };
  if (state.settings.invoiceSettings) {
    state.settings.invoiceSettings.currency = currency;
    state.settings.invoiceSettings.currencySymbol = symbols[currency] || '₹';
  }
}

function saveInvoiceTaxSettings() {
  const btn = $("#btnSaveInvoiceTax");
  const msg = $("#invoiceTaxMsg");

  const prefix = ($("#setInvPrefix")?.value || "FAI-").trim();
  const currency = $("#setInvCurrency")?.value || "INR";
  const taxName = ($("#setTaxName")?.value || "GST").trim();
  const taxRate = parseFloat($("#setTaxRate")?.value) || 0;
  const businessTaxId = ($("#setTaxId")?.value || "").trim();
  const paymentTerms = ($("#setPaymentTerms")?.value || "Due within 7 days").trim();
  const invoiceNotes = ($("#setInvNotes")?.value || "").trim();

  const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'د.إ' };
  const currencySymbol = symbols[currency] || '₹';

  const invoiceData = {
    prefix,
    currency,
    currencySymbol,
    taxName,
    taxRate,
    businessTaxId,
    paymentTerms,
    invoiceNotes
  };

  state.settings.invoiceSettings = invoiceData;
  state.settings.currency = currency;
  saveState();

  if (btn) { btn.disabled = true; btn.innerHTML = `Saving...`; }
  if (msg) { msg.className = "settings-msg loading"; msg.textContent = "Updating invoice parameters..."; }

  fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section: 'invoiceSettings', data: invoiceData })
  })
  .then(() => {
    if (btn) { btn.disabled = false; btn.innerHTML = `${icon("save")} Save Invoice Settings`; initIcons(); }
    if (msg) {
      msg.className = "settings-msg success";
      msg.textContent = "✓ Invoice calculation and tax rates saved.";
      setTimeout(() => { if (msg.textContent.includes("✓")) msg.textContent = ""; }, 4000);
    }
    toast("Invoice Settings Saved", `Invoices configured with ${taxRate}% ${taxName} and ${currencySymbol} currency.`);
  })
  .catch(() => {
    if (btn) { btn.disabled = false; btn.innerHTML = `${icon("save")} Save Invoice Settings`; initIcons(); }
    toast("Saved", "Invoice preferences updated.");
  });
}

// 6. AI Engine Functions
function fetchAiEngineStatus() {
  const title = $("#aiStatusTitle");
  const sub = $("#aiStatusSubtitle");
  const badgeContainer = $("#aiStatusBadgeContainer");

  fetch('/api/settings')
    .then(r => r.json())
    .then(data => {
      if (data.isAiOnline) {
        if (title) title.textContent = "Google Gemini AI Active & Online";
        if (sub) sub.textContent = `Connected via Gemini Neural Engine (${data.aiModel || 'gemini-2.5-flash'})`;
        if (badgeContainer) {
          badgeContainer.innerHTML = `<span class="ai-status-badge online"><span class="ai-status-dot"></span> ● AI Online</span>`;
        }
      } else {
        if (title) title.textContent = "Smart Local Fallback Mode Active";
        if (sub) sub.textContent = "StudioAI deterministic reasoning & offline tool execution online";
        if (badgeContainer) {
          badgeContainer.innerHTML = `<span class="ai-status-badge offline"><span class="ai-status-dot"></span> ○ AI Offline (Local Fallback)</span>`;
        }
      }
    })
    .catch(() => {
      if (title) title.textContent = "Smart Local StudioAI Engine";
      if (sub) sub.textContent = "Operating in fast standalone deterministic mode";
      if (badgeContainer) {
        badgeContainer.innerHTML = `<span class="ai-status-badge offline"><span class="ai-status-dot"></span> ○ AI Offline (Local Mode)</span>`;
      }
    });
}

function saveAiEngineSettings() {
  const btn = $("#btnSaveAiSettings");
  const msg = $("#aiSettingsMsg");

  const model = $("#setAiModel")?.value || "gemini-2.5-flash";
  const assistantName = ($("#setAiAssistantName")?.value || "StudioAI").trim();
  const responseStyle = $("#setAiResponseStyle")?.value || "Balanced";
  const systemInstructions = ($("#setAiInstructions")?.value || "").trim();

  const aiData = {
    provider: "Google Gemini",
    model,
    assistantName,
    responseStyle,
    systemInstructions
  };

  state.settings.aiSettings = aiData;
  saveState();

  if (btn) { btn.disabled = true; btn.innerHTML = `Saving AI Config...`; }
  if (msg) { msg.className = "settings-msg loading"; msg.textContent = "Syncing AI instructions to neural router..."; }

  fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section: 'aiSettings', data: aiData })
  })
  .then(() => {
    if (btn) { btn.disabled = false; btn.innerHTML = `${icon("save")} Save AI Settings`; initIcons(); }
    if (msg) {
      msg.className = "settings-msg success";
      msg.textContent = "✓ StudioAI assistant instructions updated.";
      setTimeout(() => { if (msg.textContent.includes("✓")) msg.textContent = ""; }, 4000);
    }
    toast("AI Settings Saved", `${assistantName} operating instructions updated.`);
  })
  .catch(() => {
    if (btn) { btn.disabled = false; btn.innerHTML = `${icon("save")} Save AI Settings`; initIcons(); }
    toast("Saved", "AI settings saved.");
  });
}

// 7. Theme & Display Functions
function previewTheme(theme) {
  applyTheme(theme);
}

function selectAccentColor(colorKey) {
  $$(".accent-swatch").forEach(s => s.classList.remove("active"));
  const clicked = $$(".accent-swatch").find(s => s.getAttribute("title")?.toLowerCase().includes(colorKey) || s.getAttribute("onclick")?.includes(colorKey));
  if (clicked) clicked.classList.add("active");

  if (!state.settings.themeSettings) state.settings.themeSettings = {};
  state.settings.themeSettings.accentColor = colorKey;
  applyAccentColor(colorKey);
}

function applyAccentColor(colorKey) {
  const root = document.documentElement;
  const colors = {
    purple: { gold: "#d4af37", goldGlow: "rgba(212, 175, 55, 0.25)", accent: "#7b2cbf", primary: "#7b2cbf" },
    gold: { gold: "#e5c05b", goldGlow: "rgba(229, 192, 91, 0.35)", accent: "#d4af37", primary: "#d4af37" },
    indigo: { gold: "#818cf8", goldGlow: "rgba(129, 140, 248, 0.3)", accent: "#6366f1", primary: "#6366f1" },
    emerald: { gold: "#34d399", goldGlow: "rgba(52, 211, 153, 0.3)", accent: "#10b981", primary: "#10b981" },
    rose: { gold: "#fb7185", goldGlow: "rgba(251, 113, 133, 0.3)", accent: "#e11d48", primary: "#e11d48" }
  };

  const choice = colors[colorKey] || colors.purple;
  if (colorKey !== 'purple' && colorKey !== 'gold') {
    root.style.setProperty('--gold', choice.gold);
    root.style.setProperty('--gold-glow', choice.goldGlow);
    root.style.setProperty('--accent', choice.accent);
  } else {
    root.style.removeProperty('--gold');
    root.style.removeProperty('--gold-glow');
    root.style.removeProperty('--accent');
  }
}

function saveThemeDisplaySettings() {
  const btn = $("#btnSaveThemeSettings");
  const msg = $("#themeSettingsMsg");

  const theme = $("#setThemeMode")?.value || "dark";
  const sidebarMode = $("#setSidebarDisplay")?.value || "expanded";
  const animations = $("#setAnimations")?.value !== "false";
  const reduceMotion = $("#setReduceMotion")?.value === "true";
  const accentColor = state.settings.themeSettings?.accentColor || "purple";

  const themeData = {
    theme,
    sidebarMode,
    accentColor,
    animations,
    reduceMotion
  };

  state.settings.themeSettings = themeData;
  state.settings.theme = theme;
  saveState();

  // Apply immediately
  applyTheme(theme);
  applyAccentColor(accentColor);

  if (reduceMotion) {
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-normal', '0s');
  } else {
    document.documentElement.style.removeProperty('--transition-fast');
    document.documentElement.style.removeProperty('--transition-normal');
  }

  if (btn) { btn.disabled = true; btn.innerHTML = `Saving...`; }
  if (msg) { msg.className = "settings-msg loading"; msg.textContent = "Saving theme preferences..."; }

  fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section: 'themeSettings', data: themeData })
  })
  .then(() => {
    if (btn) { btn.disabled = false; btn.innerHTML = `${icon("save")} Save Display Settings`; initIcons(); }
    if (msg) {
      msg.className = "settings-msg success";
      msg.textContent = "✓ Display preferences applied and saved.";
      setTimeout(() => { if (msg.textContent.includes("✓")) msg.textContent = ""; }, 4000);
    }
    toast("Theme Saved", `Applied ${theme.toUpperCase()} theme mode.`);
  })
  .catch(() => {
    if (btn) { btn.disabled = false; btn.innerHTML = `${icon("save")} Save Display Settings`; initIcons(); }
    toast("Saved", "Theme saved.");
  });
}

function applyTheme(theme) {
  document.body.classList.toggle("light-theme", theme === "light");
}

// --------------------------------------------------------------------------
// AI EDITOR & INTERACTIVE TOOLS
// --------------------------------------------------------------------------

function setupEditorSlider() {
  const preview = $("#portraitPreview");
  const before = $("#portraitBefore");
  const divider = $("#portraitDivider");
  const handle = $("#portraitHandle");

  if (!preview || !before || !divider || !handle) return;

  let isDragging = false;

  const updateSplit = (clientX) => {
    const rect = preview.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percent = (x / rect.width) * 100;

    before.style.width = percent + "%";
    divider.style.left = percent + "%";
    handle.style.left = `calc(${percent}% - 14px)`;
  };

  preview.onmousedown = (e) => {
    isDragging = true;
    updateSplit(e.clientX);
  };

  window.onmousemove = (e) => {
    if (isDragging) updateSplit(e.clientX);
  };

  window.onmouseup = () => {
    isDragging = false;
  };

  // Touch Support
  preview.ontouchstart = (e) => {
    if (e.touches.length > 0) updateSplit(e.touches[0].clientX);
  };
  preview.ontouchmove = (e) => {
    if (e.touches.length > 0) updateSplit(e.touches[0].clientX);
  };
}

let editorValues = { intensity: 75, skin: 80, exposure: 30, contrast: 12, saturation: 5 };

function updateEditorSlider(type, val) {
  editorValues[type] = Number(val);
  const label = $(`#${type}Val`);
  if (label) {
    if (type === 'exposure') label.textContent = (val >= 0 ? '+' : '') + (val / 100).toFixed(1) + ' EV';
    else if (type === 'contrast' || type === 'saturation') label.textContent = (val >= 0 ? '+' : '') + val;
    else label.textContent = val + '%';
  }
  updateImageFilters();
}

function updateImageFilters() {
  const preview = $("#portraitPreview");
  if (!preview) return;

  const brightness = 1 + (editorValues.exposure / 200);
  const contrast = 1 + (editorValues.contrast / 100);
  const saturate = 1 + (editorValues.saturation / 100);
  preview.style.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${saturate})`;
}

function switchEditorTool(btn, toolName) {
  $$(".tool-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  toast("Tool Activated", `${toolName} controls loaded.`);
}

function resetEditor() {
  editorValues = { intensity: 75, skin: 80, exposure: 0, contrast: 0, saturation: 0 };
  const preview = $("#portraitPreview");
  if (preview) preview.style.filter = "none";
  toast("Editor Reset", "All values restored to default.");
  render('ai-editing');
}

// Culling Interactivity
function filterCulling(type, btn) {
  activeCullingFilter = type;
  $$("#content .toolbar button").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  updateCullingResults();
  initIcons();
}

function toggleCullSelect(el) {
  const id = el.dataset.cullingId;
  if (!id) return;
  if (selectedCullingIds.has(id)) {
    selectedCullingIds.delete(id);
  } else {
    selectedCullingIds.add(id);
  }
  updateCullingResults();
}

function exportCullingSelection() {
  const selected = cullingItems.filter(item => selectedCullingIds.has(item.id));
  if (selected.length === 0) {
    toast("Nothing to Export", "Select at least one image before exporting.");
    return;
  }
  const csv = "Capture ID,Match Score,Image URL\n" + selected
    .map(item => `"${item.id}","${item.score}%","${item.img}"`)
    .join("\n");
  downloadFile("frame_ai_culling_selection.csv", csv);
  toast("Selection Exported", `${selected.length} selected image records downloaded.`);
}

// Gallery Filters
function filterGallery(category, btn) {
  $$(".toolbar button").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  const filtered = category === 'All' ? state.gallery : state.gallery.filter(g => g.status === category || g.category === category);
  const grid = $("#galleryGrid");
  if (grid) grid.innerHTML = renderGalleryPhotos(filtered);
}

// --------------------------------------------------------------------------
// BASE MODAL & TOAST SYSTEM
// --------------------------------------------------------------------------

function modal(title, body, primaryActionLabel = "Confirm", onPrimaryAction = null) {
  const modalEl = $("#modal");
  const overlayEl = $("#overlay");

  modalEl.innerHTML = `
    <button class="icon-btn" style="position:absolute;right:14px;top:14px" onclick="closeModal()">
      ${icon("x")}
    </button>
    <h2>${title}</h2>
    <p>FRAME AI Studio System</p>
    ${body}
    <div class="modal-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn primary" id="modalPrimaryBtn">${primaryActionLabel}</button>
    </div>
  `;

  overlayEl.classList.add("show");
  modalEl.classList.add("show");
  initIcons();

  const primaryBtn = $("#modalPrimaryBtn");
  if (primaryBtn) {
    primaryBtn.onclick = () => {
      if (typeof onPrimaryAction === 'function') {
        onPrimaryAction();
      } else {
        closeModal();
      }
    };
  }
}

function closeModal() {
  const overlayEl = $("#overlay");
  const modalEl = $("#modal");
  if (overlayEl) overlayEl.classList.remove("show");
  if (modalEl) modalEl.classList.remove("show");
}

function toast(title, msg = "") {
  const container = $("#toasts");
  if (!container) return;

  const t = document.createElement("div");
  t.className = "toast success";
  t.innerHTML = `
    <div style="display:flex;align-items:center;gap:6px">
      <strong style="color:var(--text-bright)">${title}</strong>
    </div>
    <small>${msg}</small>
  `;
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateY(-10px)";
    setTimeout(() => t.remove(), 300);
  }, 3500);
}

// --------------------------------------------------------------------------
// COMMAND PALETTE (⌘K) & QUICK ADD
// --------------------------------------------------------------------------

function openCommand() {
  const cmd = $("#command");
  const overlay = $("#overlay");
  if (cmd && overlay) {
    cmd.classList.add("show");
    overlay.classList.add("show");
    const input = $("#commandInput");
    if (input) {
      input.value = "";
      input.focus();
      renderCommandResults("");
    }
  }
}

function closeCommand() {
  const cmd = $("#command");
  if (cmd) cmd.classList.remove("show");
  if (!$("#modal").classList.contains("show")) {
    $("#overlay").classList.remove("show");
  }
}

function renderCommandResults(q) {
  const query = q.toLowerCase().trim();
  const allCommands = [
    { label: "Add New Photographer", action: () => openAction("new-photographer"), iconName: "user-plus" },
    { label: "Add New Package & Rate", action: () => openAction("new-package"), iconName: "package-plus" },
    { label: "Add New Client", action: () => openAction("new-client"), iconName: "user-plus" },
    { label: "New Photography Project", action: () => openAction("new-project"), iconName: "plus" },
    { label: "Schedule New Booking", action: () => openAction("new-booking"), iconName: "calendar-plus" },
    { label: "Create Client Invoice", action: () => openAction("new-invoice"), iconName: "receipt" },
    { label: "Upload Gallery Media", action: () => openAction("new-gallery"), iconName: "upload" },
    { label: "Go to Photographers Team", action: () => location.hash = "photographers", iconName: "camera" },
    { label: "Go to Packages & Rates", action: () => location.hash = "packages", iconName: "package" },
    { label: "Go to Dashboard", action: () => location.hash = "dashboard", iconName: "layout-dashboard" },
    { label: "Go to Studio Calendar", action: () => location.hash = "calendar", iconName: "calendar" },
    { label: "Go to Clients List", action: () => location.hash = "clients", iconName: "users" },
    { label: "Go to Projects", action: () => location.hash = "projects", iconName: "layers-3" },
    { label: "Go to AI Editing Suite", action: () => location.hash = "ai-editing", iconName: "wand-sparkles" },
    { label: "Go to AI Culling", action: () => location.hash = "ai-culling", iconName: "scan-face" },
    { label: "Go to Invoices & Billing", action: () => location.hash = "invoices", iconName: "receipt-text" },
    { label: "Studio Settings & Theme", action: () => location.hash = "settings", iconName: "settings-2" },
    { label: "Sign Out / Logout", action: () => { if (window.FRAME_AUTH) window.FRAME_AUTH.logout(); }, iconName: "log-out" }
  ];

  const filtered = allCommands.filter(c => c.label.toLowerCase().includes(query));
  const resultsEl = $("#commandResults");
  if (resultsEl) {
    resultsEl.innerHTML = filtered.map((c, index) => `
      <div class="command-item" data-command-index="${index}" role="button" tabindex="0">
        ${icon(c.iconName)}
        <span>${c.label}</span>
      </div>
    `).join("");
    $$("#commandResults .command-item").forEach((item, index) => {
      const runCommand = () => {
        closeCommand();
        filtered[index].action();
      };
      item.onclick = runCommand;
      item.onkeydown = event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          runCommand();
        }
      };
    });
    initIcons();
  }
}

// --------------------------------------------------------------------------
// EXPORT HELPERS
// --------------------------------------------------------------------------

function exportClientsCSV() {
  let csv = "Name,Email,Phone,Company,Type,Projects,Revenue\n";
  state.clients.forEach(c => {
    csv += `"${c.name}","${c.email}","${c.phone}","${c.company}","${c.type}","${c.projectsCount}","${c.totalRevenue}"\n`;
  });
  downloadFile("frame_ai_clients.csv", csv);
  toast("Exported", "Clients downloaded as CSV.");
}

function exportInvoicesCSV() {
  let csv = "Invoice ID,Client,Project,Amount,Issue Date,Due Date,Status\n";
  state.invoices.forEach(i => {
    csv += `"${i.id}","${i.client}","${i.project}","${i.amount}","${i.issueDate}","${i.dueDate}","${i.status}"\n`;
  });
  downloadFile("frame_ai_invoices.csv", csv);
  toast("Exported", "Invoices downloaded as CSV.");
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// --------------------------------------------------------------------------
// INITIALIZATION & GLOBAL EVENT LISTENERS
// --------------------------------------------------------------------------

function route() {
  const raw = location.hash.slice(1) || "dashboard";
  const hash = raw.split("?")[0];
  if (["login", "signup", "forgot-password", "reset-password"].includes(hash)) {
    if (window.FRAME_AUTH && typeof window.FRAME_AUTH.checkRoute === "function") {
      window.FRAME_AUTH.checkRoute();
    }
    return;
  }
  if (window.FRAME_AUTH && typeof window.FRAME_AUTH.isAuthenticated === "function" && !window.FRAME_AUTH.isAuthenticated()) {
    location.hash = "login";
    return;
  }
  render(hash);
}

window.addEventListener("DOMContentLoaded", () => {
  // Apply saved theme
  applyTheme(state.settings.theme);

  // Setup Global Header Controls
  const searchBtn = $("#searchBtn");
  if (searchBtn) searchBtn.onclick = openCommand;

  const quickBtn = $("#quickBtn");
  if (quickBtn) quickBtn.onclick = () => openAction("new-project");

  const notifBtn = $("#notifBtn");
  if (notifBtn) notifBtn.onclick = () => location.hash = "notifications";

  const menuBtn = $("#menuBtn");
  if (menuBtn) menuBtn.onclick = () => $("#sidebar")?.classList.toggle("open");

  const profileBtn = $("#profileBtn");
  if (profileBtn) {
    profileBtn.onclick = (e) => {
      e.stopPropagation();
      if (window.FRAME_AUTH && typeof window.FRAME_AUTH.toggleProfileMenu === "function") {
        window.FRAME_AUTH.toggleProfileMenu(profileBtn);
      } else {
        location.hash = "settings";
      }
    };
  }

  const overlay = $("#overlay");
  if (overlay) overlay.onclick = () => { closeCommand(); closeModal(); };

  const commandInput = $("#commandInput");
  if (commandInput) {
    commandInput.oninput = (e) => renderCommandResults(e.target.value);
  }

  // Keyboard Shortcuts
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openCommand();
    }
    if (e.key === "Escape") {
      closeCommand();
      closeModal();
    }
  });

  // Export Global Window Functions for inline calls
  window.openAction = openAction;
  window.closeModal = closeModal;
  window.openBookingDetails = openBookingDetails;
  window.openProjectDetails = openProjectDetails;
  window.openPhotoDetails = openPhotoDetails;
  window.openPhotographerProfile = openPhotographerProfile;
  window.openEditPhotographer = openEditPhotographer;
  window.deletePhotographer = deletePhotographer;
  window.resetPhotographerFilter = resetPhotographerFilter;
  window.exportPhotographersCSV = exportPhotographersCSV;
  window.openPackageDetails = openPackageDetails;
  window.openEditPackage = openEditPackage;
  window.deletePackage = deletePackage;
  window.filterPackageCategory = filterPackageCategory;
  window.exportPackagesCSV = exportPackagesCSV;
  window.deleteClient = deleteClient;
  window.deleteProject = deleteProject;
  window.deleteBooking = deleteBooking;
  window.deleteInvoice = deleteInvoice;
  window.deleteGalleryItem = deleteGalleryItem;
  window.toggleBookingStatus = toggleBookingStatus;
  window.toggleInvoicePaid = toggleInvoicePaid;
  window.calPrev = calPrev;
  window.calNext = calNext;
  window.calToday = calToday;
  window.setCalView = setCalView;
  window.setCalLocationFilter = setCalLocationFilter;
  window.selectCalendarDate = selectCalendarDate;
  window.handleDayCellClick = handleDayCellClick;
  window.selectPresetImg = selectPresetImg;
  window.markAllNotificationsRead = markAllNotificationsRead;
  window.markNotificationRead = markNotificationRead;
  window.clearAllNotifications = clearAllNotifications;
  window.saveStudioSettings = saveStudioSettings;
  window.filterGallery = filterGallery;
  window.filterCulling = filterCulling;
  window.toggleCullSelect = toggleCullSelect;
  window.switchEditorTool = switchEditorTool;
  window.updateEditorSlider = updateEditorSlider;
  window.resetEditor = resetEditor;
  window.exportClientsCSV = exportClientsCSV;
  window.exportInvoicesCSV = exportInvoicesCSV;
  window.toast = toast;

  // Settings System Global Window Exports
  window.switchSettingsTab = switchSettingsTab;
  window.saveActiveSettingsSection = saveActiveSettingsSection;
  window.saveStudioProfile = saveStudioProfile;
  window.saveAccountSettings = saveAccountSettings;
  window.openAddTeamMemberModal = openAddTeamMemberModal;
  window.openEditTeamMemberModal = openEditTeamMemberModal;
  window.deleteTeamMember = deleteTeamMember;
  window.openAddRoomModal = openAddRoomModal;
  window.openEditRoomModal = openEditRoomModal;
  window.deleteRoom = deleteRoom;
  window.openAddEquipmentModal = openAddEquipmentModal;
  window.openEditEquipmentModal = openEditEquipmentModal;
  window.deleteEquipment = deleteEquipment;
  window.filterEquipmentCategory = filterEquipmentCategory;
  window.toggleWorkingDay = toggleWorkingDay;
  window.saveBookingHoursSettings = saveBookingHoursSettings;
  window.updateCurrencySymbolPreview = updateCurrencySymbolPreview;
  window.saveInvoiceTaxSettings = saveInvoiceTaxSettings;
  window.fetchAiEngineStatus = fetchAiEngineStatus;
  window.saveAiEngineSettings = saveAiEngineSettings;
  window.previewTheme = previewTheme;
  window.selectAccentColor = selectAccentColor;
  window.applyAccentColor = applyAccentColor;
  window.saveThemeDisplaySettings = saveThemeDisplaySettings;
  window.applyTheme = applyTheme;

  // Initial Route & Badge Update
  updateNotifBadge();
  route();
});

window.addEventListener("hashchange", route);


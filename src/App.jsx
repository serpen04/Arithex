import { useState, useEffect, useRef } from "react";
import { signUp, logIn, googleLogin, logOut, onAuthChange } from "./authService";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "bands", label: "Bands", icon: "🎸" },
  { id: "djs", label: "DJs", icon: "🎧" },
  { id: "singers", label: "Singers", icon: "🎤" },
  { id: "dancers", label: "Dancers", icon: "💃" },
  { id: "comedians", label: "Comedians", icon: "🎭" },
  { id: "photographers", label: "Photographers", icon: "📸" },
  { id: "anchors", label: "Anchors", icon: "🎙️" },
  { id: "influencers", label: "Influencers", icon: "✨" },
];

const EVENT_TYPES = ["Wedding", "Birthday Party", "Corporate Event", "College Fest", "Private Concert", "Club Event", "Cultural Program", "Community Festival"];

const ARTISTS = [
  { id: 1, name: "Arjun Mehta", category: "djs", city: "Mumbai", rating: 4.9, reviews: 128, price: 15000, priceLabel: "₹15K/event", bio: "Award-winning DJ with 8+ years of experience spinning at premium clubs and weddings across India.", tags: ["Bollywood", "EDM", "House"], verified: true, trending: true, featured: true, image: "https://images.unsplash.com/photo-1571266028243-d220c6a3fefe?w=400&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop","https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop"], availability: ["2024-02-15","2024-02-20","2024-02-25","2024-03-05","2024-03-10"], bookings: 247, experience: 8 },
  { id: 2, name: "Priya Sharma", category: "singers", city: "Delhi", rating: 4.8, reviews: 95, price: 25000, priceLabel: "₹25K/event", bio: "Classical and Bollywood vocalist trained under Pandit Rajan Sajan Mishra. Performed at over 200 weddings.", tags: ["Classical", "Bollywood", "Ghazal"], verified: true, trending: true, featured: false, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop","https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&h=400&fit=crop"], availability: ["2024-02-18","2024-02-22","2024-03-01","2024-03-08"], bookings: 312, experience: 12 },
  { id: 3, name: "The Fusion Collective", category: "bands", city: "Bangalore", rating: 4.7, reviews: 74, price: 45000, priceLabel: "₹45K/event", bio: "6-piece fusion band blending Indian classical with jazz and rock. Perfect for corporate events and college fests.", tags: ["Fusion", "Jazz", "Rock"], verified: true, trending: false, featured: true, image: "https://images.unsplash.com/photo-1598387993441-a364f854cfaf?w=400&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&h=400&fit=crop","https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=600&h=400&fit=crop"], availability: ["2024-02-16","2024-02-24","2024-03-02","2024-03-15"], bookings: 89, experience: 5 },
  { id: 4, name: "Riya Nair", category: "dancers", city: "Chennai", rating: 4.9, reviews: 156, price: 20000, priceLabel: "₹20K/event", bio: "Bharatanatyam and contemporary fusion dancer. National award winner. Available for solo and group performances.", tags: ["Bharatanatyam", "Contemporary", "Fusion"], verified: true, trending: true, featured: true, image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600&h=400&fit=crop","https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&h=400&fit=crop"], availability: ["2024-02-17","2024-02-21","2024-03-03","2024-03-12"], bookings: 198, experience: 10 },
  { id: 5, name: "Vikram Patel", category: "comedians", city: "Pune", rating: 4.6, reviews: 62, price: 30000, priceLabel: "₹30K/event", bio: "Stand-up comedian with 5+ years on the circuit. Clean corporate humor specialist. Featured on Amazon Prime.", tags: ["Stand-up", "Corporate", "Hindi"], verified: true, trending: false, featured: false, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop"], availability: ["2024-02-19","2024-02-23","2024-03-06","2024-03-14"], bookings: 67, experience: 5 },
  { id: 6, name: "Lens & Light Studio", category: "photographers", city: "Mumbai", rating: 4.8, reviews: 203, price: 18000, priceLabel: "₹18K/day", bio: "Professional event photography team. 3 photographers, drone shots included. 500+ events covered.", tags: ["Events", "Drone", "Wedding"], verified: true, trending: false, featured: true, image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop","https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop"], availability: ["2024-02-15","2024-02-20","2024-02-28","2024-03-10"], bookings: 421, experience: 7 },
  { id: 7, name: "Rohan Kapoor", category: "anchors", city: "Delhi", rating: 4.7, reviews: 88, price: 12000, priceLabel: "₹12K/event", bio: "Bilingual anchor (Hindi/English). TV host with experience in corporate events, weddings, and award ceremonies.", tags: ["Bilingual", "Corporate", "TV Host"], verified: true, trending: true, featured: false, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop"], availability: ["2024-02-16","2024-02-22","2024-03-04","2024-03-11"], bookings: 134, experience: 6 },
  { id: 8, name: "Zara Ali", category: "influencers", city: "Hyderabad", rating: 4.5, reviews: 41, price: 35000, priceLabel: "₹35K/appearance", bio: "1.2M Instagram followers. Lifestyle & fashion influencer. Available for brand events, launches, and promotions.", tags: ["Lifestyle", "Fashion", "Instagram"], verified: false, trending: true, featured: false, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop"], availability: ["2024-02-20","2024-02-26","2024-03-07","2024-03-16"], bookings: 52, experience: 3 },
];

const REVIEWS_MAP = {
  1: [{ user: "Rahul M.", rating: 5, text: "Arjun made our wedding unforgettable. The energy was incredible!", date: "Jan 2024" }, { user: "Sneha P.", rating: 5, text: "Best DJ in Mumbai. Everyone was on the dance floor all night.", date: "Dec 2023" }],
  2: [{ user: "Amit K.", rating: 5, text: "Priya's voice is divine. Our guests were moved to tears.", date: "Jan 2024" }, { user: "Neha R.", rating: 4, text: "Beautiful performance. Very professional and punctual.", date: "Nov 2023" }],
  3: [{ user: "Corporate HR", rating: 5, text: "Perfect for our annual day. Fusion of classical and modern - crowd loved it!", date: "Dec 2023" }],
  4: [{ user: "Divya S.", rating: 5, text: "Riya's performance was the highlight of our event. Truly mesmerizing.", date: "Jan 2024" }],
};

const BOOKINGS_DATA = [
  { id: "BK001", artist: ARTISTS[0], eventType: "Wedding", eventDate: "2024-02-20", venue: "The Grand, Mumbai", amount: 15000, status: "confirmed", paid: true },
  { id: "BK002", artist: ARTISTS[3], eventType: "Birthday Party", eventDate: "2024-03-05", venue: "Home, Andheri", amount: 20000, status: "pending", paid: false },
  { id: "BK003", artist: ARTISTS[5], eventType: "Corporate Event", eventDate: "2024-01-15", venue: "Taj Hotels, BKC", amount: 18000, status: "completed", paid: true },
];

const CHAT_DATA = {
  1: { name: "Arjun Mehta", image: ARTISTS[0].image, messages: [{ from: "them", text: "Hi! Thanks for reaching out. I'd love to perform at your event!", time: "2:30 PM" }, { from: "me", text: "Great! We're planning a wedding reception for ~200 guests.", time: "2:32 PM" }, { from: "them", text: "Perfect. My package includes 4 hours of performance with full sound setup. When is the event?", time: "2:35 PM" }] },
  2: { name: "Priya Sharma", image: ARTISTS[1].image, messages: [{ from: "them", text: "Hello! I saw your booking request. Happy to discuss the details.", time: "Yesterday" }, { from: "me", text: "We need a singer for a 3-hour reception.", time: "Yesterday" }] },
};

const ADMIN_STATS = { totalUsers: 1247, totalArtists: 389, revenue: 2847500, activeBookings: 67, pendingVerifications: 12, disputes: 3 };

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #0a0a0f;
    --bg2: #111118;
    --bg3: #18181f;
    --card: #1c1c25;
    --border: #2a2a38;
    --accent: #ff6b2b;
    --accent2: #ff9f1c;
    --gold: #f5c842;
    --text: #f0f0f5;
    --muted: #888899;
    --success: #22c55e;
    --warning: #f59e0b;
    --danger: #ef4444;
    --radius: 16px;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body { font-family: var(--font-body); background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }

  .app { display: flex; flex-direction: column; min-height: 100vh; max-width: 430px; margin: 0 auto; background: var(--bg); position: relative; box-shadow: 0 0 80px rgba(255,107,43,0.15); }

  .splash { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--bg); position: relative; overflow: hidden; }
  .splash-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,107,43,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 80%, rgba(245,200,66,0.08) 0%, transparent 60%); }
  .splash-rings { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
  .splash-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(255,107,43,0.15); animation: pulseRing 3s ease-in-out infinite; }
  .splash-ring:nth-child(1) { width: 200px; height: 200px; animation-delay: 0s; }
  .splash-ring:nth-child(2) { width: 320px; height: 320px; animation-delay: 0.5s; }
  .splash-ring:nth-child(3) { width: 440px; height: 440px; animation-delay: 1s; }
  @keyframes pulseRing { 0%,100% { opacity: 0.15; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.03); } }
  .splash-logo { font-family: var(--font-display); font-size: 52px; font-weight: 800; letter-spacing: -2px; z-index: 1; }
  .splash-logo span { color: var(--accent); }
  .splash-tagline { font-size: 14px; color: var(--muted); margin-top: 8px; letter-spacing: 3px; text-transform: uppercase; z-index: 1; }
  .splash-loader { margin-top: 48px; width: 120px; height: 3px; background: var(--bg3); border-radius: 2px; overflow: hidden; z-index: 1; }
  .splash-loader-bar { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 2px; animation: loadBar 2.2s ease-in-out forwards; }
  @keyframes loadBar { 0% { width: 0%; } 100% { width: 100%; } }

  .onboarding { height: 100vh; display: flex; flex-direction: column; background: var(--bg); overflow: hidden; }
  .onboard-slide { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 32px; text-align: center; animation: fadeUp 0.5s ease; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .onboard-icon { font-size: 80px; margin-bottom: 24px; display: block; }
  .onboard-title { font-family: var(--font-display); font-size: 28px; font-weight: 800; margin-bottom: 12px; }
  .onboard-title span { color: var(--accent); }
  .onboard-desc { font-size: 15px; color: var(--muted); line-height: 1.6; }
  .onboard-dots { display: flex; gap: 6px; justify-content: center; padding: 16px; }
  .dot { width: 6px; height: 6px; border-radius: 3px; background: var(--border); transition: all 0.3s; }
  .dot.active { background: var(--accent); width: 20px; }
  .onboard-actions { padding: 24px 32px 40px; display: flex; flex-direction: column; gap: 12px; }

  .btn { display: flex; align-items: center; justify-content: center; gap: 8px; border: none; cursor: pointer; font-family: var(--font-body); font-size: 15px; font-weight: 600; border-radius: 14px; transition: all 0.2s; padding: 16px 24px; width: 100%; }
  .btn-primary { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #fff; }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,107,43,0.35); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .btn-secondary { background: var(--card); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover { border-color: var(--accent); }
  .btn-ghost { background: transparent; color: var(--muted); width: auto; padding: 8px 0; font-size: 14px; }
  .btn-sm { padding: 10px 20px; font-size: 13px; border-radius: 10px; width: auto; }
  .btn-danger { background: rgba(239,68,68,0.15); color: var(--danger); border: 1px solid rgba(239,68,68,0.3); }

  .auth-screen { min-height: 100vh; display: flex; flex-direction: column; padding: 60px 24px 32px; background: var(--bg); }
  .auth-header { margin-bottom: 40px; }
  .auth-back { background: var(--card); border: 1px solid var(--border); border-radius: 12px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px; margin-bottom: 32px; color: var(--text); }
  .auth-title { font-family: var(--font-display); font-size: 32px; font-weight: 800; margin-bottom: 8px; }
  .auth-subtitle { color: var(--muted); font-size: 15px; }
  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 13px; font-weight: 600; color: var(--muted); margin-bottom: 8px; display: block; letter-spacing: 0.5px; text-transform: uppercase; }
  .form-input { width: 100%; background: var(--card); border: 1.5px solid var(--border); border-radius: 14px; padding: 14px 16px; color: var(--text); font-family: var(--font-body); font-size: 15px; outline: none; transition: border-color 0.2s; }
  .form-input:focus { border-color: var(--accent); }
  .form-input::placeholder { color: var(--muted); }
  .auth-divider { display: flex; align-items: center; gap: 12px; margin: 24px 0; }
  .auth-divider span { font-size: 13px; color: var(--muted); }
  .auth-divider-line { flex: 1; height: 1px; background: var(--border); }
  .social-btn { display: flex; align-items: center; justify-content: center; gap: 10px; background: var(--card); border: 1.5px solid var(--border); border-radius: 14px; padding: 14px; cursor: pointer; font-size: 15px; font-weight: 500; font-family: var(--font-body); color: var(--text); width: 100%; margin-bottom: 12px; transition: border-color 0.2s; }
  .social-btn:hover { border-color: var(--accent); }
  .auth-footer { margin-top: auto; text-align: center; font-size: 14px; color: var(--muted); }
  .auth-footer span { color: var(--accent); cursor: pointer; font-weight: 600; }
  .role-toggle { display: flex; background: var(--card); border-radius: 14px; padding: 4px; margin-bottom: 28px; border: 1px solid var(--border); }
  .role-btn { flex: 1; padding: 12px; border-radius: 10px; border: none; cursor: pointer; font-family: var(--font-body); font-size: 14px; font-weight: 600; background: transparent; color: var(--muted); transition: all 0.2s; }
  .role-btn.active { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #fff; }

  .bottom-nav { position: sticky; bottom: 0; background: rgba(17,17,24,0.95); backdrop-filter: blur(20px); border-top: 1px solid var(--border); display: flex; padding: 8px 0 20px; z-index: 50; }
  .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; padding: 8px; transition: all 0.2s; }
  .nav-icon { font-size: 20px; }
  .nav-label { font-size: 10px; font-weight: 600; color: var(--muted); letter-spacing: 0.5px; text-transform: uppercase; transition: color 0.2s; }
  .nav-item.active .nav-label { color: var(--accent); }
  .nav-item.active .nav-icon { transform: translateY(-2px); }

  .screen-header { padding: 56px 20px 16px; display: flex; align-items: center; justify-content: space-between; }
  .header-title { font-family: var(--font-display); font-size: 22px; font-weight: 800; }
  .header-sub { font-size: 13px; color: var(--muted); margin-top: 2px; }
  .avatar { width: 40px; height: 40px; border-radius: 12px; object-fit: cover; border: 2px solid var(--accent); cursor: pointer; }

  .home-banner { margin: 0 20px 20px; background: linear-gradient(135deg, #1a0e00, #2d1500); border: 1px solid rgba(255,107,43,0.3); border-radius: var(--radius); padding: 20px; position: relative; overflow: hidden; }
  .home-banner::after { content: '🎵'; position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-size: 48px; opacity: 0.3; }
  .home-banner-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--accent2); font-weight: 600; margin-bottom: 6px; }
  .home-banner-title { font-family: var(--font-display); font-size: 20px; font-weight: 800; margin-bottom: 4px; }
  .home-banner-sub { font-size: 13px; color: var(--muted); }

  .section-header { display: flex; justify-content: space-between; align-items: center; padding: 0 20px; margin-bottom: 14px; }
  .section-title { font-family: var(--font-display); font-size: 16px; font-weight: 700; }
  .see-all { font-size: 13px; color: var(--accent); cursor: pointer; font-weight: 600; }

  .cats-scroll { display: flex; gap: 10px; padding: 0 20px; overflow-x: auto; margin-bottom: 24px; scrollbar-width: none; }
  .cats-scroll::-webkit-scrollbar { display: none; }
  .cat-chip { display: flex; flex-direction: column; align-items: center; gap: 6px; background: var(--card); border: 1.5px solid var(--border); border-radius: 16px; padding: 14px 16px; min-width: 72px; cursor: pointer; transition: all 0.2s; }
  .cat-chip:hover, .cat-chip.active { border-color: var(--accent); background: rgba(255,107,43,0.1); }
  .cat-icon { font-size: 22px; }
  .cat-label { font-size: 11px; font-weight: 600; color: var(--muted); white-space: nowrap; }
  .cat-chip.active .cat-label { color: var(--accent); }

  .artists-scroll { display: flex; gap: 14px; padding: 0 20px; overflow-x: auto; margin-bottom: 24px; scrollbar-width: none; }
  .artists-scroll::-webkit-scrollbar { display: none; }
  .artist-card-sm { min-width: 160px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; cursor: pointer; transition: all 0.2s; position: relative; }
  .artist-card-sm:hover { border-color: var(--accent); transform: translateY(-2px); }
  .artist-card-sm img { width: 100%; height: 130px; object-fit: cover; display: block; }
  .artist-card-sm-info { padding: 12px; }
  .artist-card-sm-name { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
  .artist-card-sm-cat { font-size: 12px; color: var(--muted); margin-bottom: 6px; }
  .artist-card-sm-price { font-size: 13px; font-weight: 700; color: var(--accent2); }
  .verified-badge { position: absolute; top: 8px; right: 8px; background: rgba(34,197,94,0.9); border-radius: 6px; padding: 3px 6px; font-size: 10px; font-weight: 700; color: #fff; }
  .trending-badge { position: absolute; top: 8px; left: 8px; background: rgba(255,107,43,0.9); border-radius: 6px; padding: 3px 6px; font-size: 10px; font-weight: 700; color: #fff; }

  .search-bar { margin: 0 20px 20px; position: relative; }
  .search-input { width: 100%; background: var(--card); border: 1.5px solid var(--border); border-radius: 14px; padding: 14px 16px 14px 48px; color: var(--text); font-family: var(--font-body); font-size: 15px; outline: none; transition: border-color 0.2s; }
  .search-input:focus { border-color: var(--accent); }
  .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 18px; }

  .filter-row { display: flex; gap: 8px; padding: 0 20px; margin-bottom: 20px; overflow-x: auto; scrollbar-width: none; }
  .filter-chip { background: var(--card); border: 1.5px solid var(--border); border-radius: 10px; padding: 8px 14px; font-size: 13px; font-weight: 600; color: var(--muted); cursor: pointer; white-space: nowrap; transition: all 0.2s; }
  .filter-chip.active { border-color: var(--accent); color: var(--accent); background: rgba(255,107,43,0.1); }

  .artist-list { display: flex; flex-direction: column; gap: 14px; padding: 0 20px; }
  .artist-card-lg { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; cursor: pointer; transition: all 0.2s; display: flex; }
  .artist-card-lg:hover { border-color: var(--accent); }
  .artist-card-lg img { width: 90px; height: 90px; object-fit: cover; flex-shrink: 0; }
  .artist-card-lg-info { padding: 12px; flex: 1; }
  .artist-card-lg-name { font-size: 15px; font-weight: 700; margin-bottom: 2px; }
  .artist-card-lg-meta { font-size: 12px; color: var(--muted); margin-bottom: 6px; }
  .rating-row { display: flex; align-items: center; gap: 4px; margin-bottom: 6px; }
  .rating-star { color: var(--gold); font-size: 12px; }
  .rating-val { font-size: 13px; font-weight: 700; }
  .tag-row { display: flex; gap: 4px; flex-wrap: wrap; }
  .tag { background: rgba(255,107,43,0.12); border: 1px solid rgba(255,107,43,0.25); border-radius: 6px; padding: 2px 8px; font-size: 11px; color: var(--accent2); font-weight: 600; }

  .profile-hero { position: relative; }
  .profile-hero img { width: 100%; height: 280px; object-fit: cover; display: block; }
  .profile-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,10,15,0.95) 0%, transparent 50%); }
  .profile-back-btn { position: absolute; top: 56px; left: 20px; background: rgba(0,0,0,0.5); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px; color: #fff; }
  .profile-hero-info { position: absolute; bottom: 20px; left: 20px; right: 20px; }
  .profile-name { font-family: var(--font-display); font-size: 26px; font-weight: 800; margin-bottom: 4px; }
  .profile-meta-row { display: flex; align-items: center; gap: 12px; }
  .profile-cat { font-size: 13px; color: var(--accent2); font-weight: 600; }
  .profile-city { font-size: 13px; color: var(--muted); }
  .profile-body { padding: 20px; }
  .profile-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
  .stat-box { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 14px; text-align: center; }
  .stat-val { font-family: var(--font-display); font-size: 20px; font-weight: 800; color: var(--accent); }
  .stat-label { font-size: 11px; color: var(--muted); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
  .profile-section { margin-bottom: 20px; }
  .profile-section-title { font-family: var(--font-display); font-size: 15px; font-weight: 700; margin-bottom: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
  .profile-bio { font-size: 14px; line-height: 1.7; color: var(--text); }
  .gallery-scroll { display: flex; gap: 10px; overflow-x: auto; scrollbar-width: none; }
  .gallery-scroll::-webkit-scrollbar { display: none; }
  .gallery-img { width: 180px; height: 120px; object-fit: cover; border-radius: 12px; flex-shrink: 0; cursor: pointer; }
  .review-card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 14px; margin-bottom: 10px; }
  .review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .review-user { font-size: 14px; font-weight: 700; }
  .review-date { font-size: 12px; color: var(--muted); }
  .review-text { font-size: 14px; color: var(--muted); line-height: 1.5; }
  .pricing-card { background: linear-gradient(135deg, rgba(255,107,43,0.1), rgba(245,200,66,0.05)); border: 1px solid rgba(255,107,43,0.3); border-radius: 14px; padding: 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .pricing-label { font-size: 13px; color: var(--muted); margin-bottom: 4px; }
  .pricing-val { font-family: var(--font-display); font-size: 24px; font-weight: 800; color: var(--accent); }

  .booking-screen { min-height: 100vh; padding: 56px 24px 100px; background: var(--bg); }
  .booking-step { animation: fadeUp 0.4s ease; }
  .booking-title { font-family: var(--font-display); font-size: 24px; font-weight: 800; margin-bottom: 6px; }
  .booking-sub { font-size: 14px; color: var(--muted); margin-bottom: 28px; }
  .progress-bar { height: 4px; background: var(--card); border-radius: 2px; margin-bottom: 32px; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 2px; transition: width 0.4s ease; }
  .event-type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px; }
  .event-type-btn { background: var(--card); border: 1.5px solid var(--border); border-radius: 14px; padding: 16px 12px; cursor: pointer; text-align: center; font-size: 13px; font-weight: 600; color: var(--muted); transition: all 0.2s; }
  .event-type-btn.selected { border-color: var(--accent); background: rgba(255,107,43,0.1); color: var(--accent); }
  .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 24px; }
  .cal-header { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 6px; }
  .cal-day-label { text-align: center; font-size: 11px; color: var(--muted); font-weight: 700; padding: 4px 0; }
  .cal-day { aspect-ratio: 1; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; cursor: pointer; background: var(--card); color: var(--muted); border: 1px solid transparent; transition: all 0.2s; }
  .cal-day.available { color: var(--text); border-color: var(--border); }
  .cal-day.available:hover { border-color: var(--accent); }
  .cal-day.selected { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #fff; border-color: transparent; }
  .cal-day.empty { background: transparent; border: none; cursor: default; }
  .booking-summary { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; margin-bottom: 24px; }
  .summary-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 14px; }
  .summary-row:last-child { border-bottom: none; }
  .summary-label { color: var(--muted); }
  .summary-val { font-weight: 700; }
  .summary-total { color: var(--accent); font-size: 18px; font-weight: 800; }
  .payment-option { background: var(--card); border: 1.5px solid var(--border); border-radius: 14px; padding: 16px; cursor: pointer; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s; }
  .payment-option.selected { border-color: var(--accent); background: rgba(255,107,43,0.08); }
  .payment-option-label { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
  .payment-option-sub { font-size: 12px; color: var(--muted); }
  .confirm-card { background: var(--card); border: 1px solid var(--success); border-radius: var(--radius); padding: 24px; text-align: center; margin-bottom: 24px; }
  .confirm-icon { font-size: 48px; margin-bottom: 12px; }
  .confirm-title { font-family: var(--font-display); font-size: 22px; font-weight: 800; margin-bottom: 6px; color: var(--success); }
  .confirm-id { font-size: 13px; color: var(--muted); }

  .bookings-list { padding: 0 20px; display: flex; flex-direction: column; gap: 12px; }
  .booking-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; display: flex; gap: 12px; cursor: pointer; }
  .booking-card img { width: 60px; height: 60px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
  .booking-info { flex: 1; }
  .booking-artist { font-size: 15px; font-weight: 700; margin-bottom: 2px; }
  .booking-event { font-size: 13px; color: var(--muted); margin-bottom: 6px; }
  .booking-meta-row { display: flex; align-items: center; gap: 8px; }
  .status-badge { border-radius: 8px; padding: 4px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  .status-confirmed { background: rgba(34,197,94,0.15); color: var(--success); }
  .status-pending { background: rgba(245,158,11,0.15); color: var(--warning); }
  .status-completed { background: rgba(136,136,153,0.15); color: var(--muted); }
  .booking-amount { font-size: 14px; font-weight: 700; color: var(--accent); margin-left: auto; }
  .tabs { display: flex; background: var(--card); border-radius: 14px; padding: 4px; margin: 0 20px 20px; border: 1px solid var(--border); }
  .tab { flex: 1; padding: 10px; border-radius: 10px; border: none; cursor: pointer; font-family: var(--font-body); font-size: 13px; font-weight: 600; background: transparent; color: var(--muted); transition: all 0.2s; }
  .tab.active { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #fff; }

  .chat-list { display: flex; flex-direction: column; padding: 0 20px; gap: 4px; }
  .chat-item { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--border); cursor: pointer; }
  .chat-avatar { width: 52px; height: 52px; border-radius: 14px; object-fit: cover; border: 2px solid var(--border); flex-shrink: 0; }
  .chat-info { flex: 1; }
  .chat-name { font-size: 15px; font-weight: 700; margin-bottom: 3px; }
  .chat-preview { font-size: 13px; color: var(--muted); }
  .chat-time { font-size: 12px; color: var(--muted); }
  .chat-screen { display: flex; flex-direction: column; height: 100vh; background: var(--bg); }
  .chat-header { padding: 56px 20px 16px; display: flex; align-items: center; gap: 14px; border-bottom: 1px solid var(--border); background: var(--bg); }
  .chat-header-back { font-size: 20px; cursor: pointer; }
  .chat-header-avatar { width: 40px; height: 40px; border-radius: 12px; object-fit: cover; }
  .chat-header-name { font-size: 16px; font-weight: 700; }
  .chat-header-status { font-size: 12px; color: var(--success); }
  .chat-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
  .message { max-width: 80%; }
  .message.me { align-self: flex-end; }
  .message.them { align-self: flex-start; }
  .message-bubble { padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.5; }
  .message.me .message-bubble { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #fff; border-bottom-right-radius: 4px; }
  .message.them .message-bubble { background: var(--card); border: 1px solid var(--border); border-bottom-left-radius: 4px; }
  .message-time { font-size: 11px; color: var(--muted); margin-top: 4px; text-align: right; }
  .message.them .message-time { text-align: left; }
  .chat-input-row { padding: 12px 20px 32px; display: flex; gap: 10px; border-top: 1px solid var(--border); background: var(--bg); }
  .chat-input { flex: 1; background: var(--card); border: 1.5px solid var(--border); border-radius: 14px; padding: 12px 16px; color: var(--text); font-family: var(--font-body); font-size: 15px; outline: none; }
  .chat-send { background: linear-gradient(135deg, var(--accent), var(--accent2)); border: none; border-radius: 14px; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 20px; flex-shrink: 0; }

  .user-card { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding: 20px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); }
  .user-avatar-lg { width: 64px; height: 64px; border-radius: 16px; object-fit: cover; border: 2px solid var(--accent); }
  .user-name { font-family: var(--font-display); font-size: 20px; font-weight: 800; margin-bottom: 2px; }
  .user-email { font-size: 13px; color: var(--muted); }
  .menu-section { margin-bottom: 20px; }
  .menu-title { font-size: 11px; color: var(--muted); font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; padding: 0 4px; }
  .menu-item { display: flex; align-items: center; gap: 14px; padding: 16px; background: var(--card); border: 1px solid var(--border); border-radius: 14px; cursor: pointer; margin-bottom: 8px; transition: all 0.2s; }
  .menu-item:hover { border-color: var(--accent); }
  .menu-icon { font-size: 20px; width: 32px; text-align: center; }
  .menu-label { font-size: 15px; font-weight: 500; flex: 1; }
  .menu-arrow { color: var(--muted); font-size: 16px; }

  .earnings-card { background: linear-gradient(135deg, rgba(255,107,43,0.15), rgba(245,200,66,0.08)); border: 1px solid rgba(255,107,43,0.3); border-radius: var(--radius); padding: 24px; margin-bottom: 20px; }
  .earnings-label { font-size: 12px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
  .earnings-amount { font-family: var(--font-display); font-size: 36px; font-weight: 800; color: var(--accent); margin-bottom: 4px; }
  .earnings-meta { font-size: 13px; color: var(--muted); }
  .earnings-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
  .earnings-stat { background: rgba(0,0,0,0.3); border-radius: 12px; padding: 12px; }
  .earnings-stat-val { font-size: 18px; font-weight: 700; margin-bottom: 2px; }
  .earnings-stat-label { font-size: 11px; color: var(--muted); }
  .req-card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 16px; margin-bottom: 10px; }
  .req-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .req-event { font-size: 15px; font-weight: 700; margin-bottom: 2px; }
  .req-date { font-size: 13px; color: var(--muted); }
  .req-amount { font-size: 16px; font-weight: 800; color: var(--accent); }
  .req-actions { display: flex; gap: 8px; }

  .admin-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px; }
  .admin-stat-card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 16px; }
  .admin-stat-val { font-family: var(--font-display); font-size: 24px; font-weight: 800; margin-bottom: 2px; }
  .admin-stat-label { font-size: 12px; color: var(--muted); }
  .admin-action-btn { display: flex; align-items: center; gap: 12px; background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 14px 16px; cursor: pointer; margin-bottom: 8px; transition: all 0.2s; }
  .admin-action-btn:hover { border-color: var(--accent); }
  .admin-action-icon { font-size: 20px; }
  .admin-action-label { font-size: 14px; font-weight: 600; flex: 1; }
  .admin-action-badge { background: var(--accent); color: #fff; border-radius: 10px; padding: 2px 8px; font-size: 12px; font-weight: 700; }
  .verify-card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 16px; display: flex; gap: 12px; align-items: center; margin-bottom: 10px; }
  .verify-card img { width: 50px; height: 50px; border-radius: 10px; object-fit: cover; }
  .verify-info { flex: 1; }
  .verify-name { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
  .verify-cat { font-size: 12px; color: var(--muted); }
  .verify-actions { display: flex; gap: 6px; }

  .toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 14px 20px; font-size: 14px; font-weight: 600; z-index: 1000; animation: toastIn 0.3s ease; white-space: nowrap; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
  .toast.success { border-color: var(--success); color: var(--success); }
  .toast.error { border-color: var(--danger); color: var(--danger); }
  @keyframes toastIn { from { opacity: 0; top: 0; } to { opacity: 1; top: 20px; } }

  .scroll-content { flex: 1; overflow-y: auto; scrollbar-width: none; }
  .scroll-content::-webkit-scrollbar { display: none; }
  .pb-100 { padding-bottom: 100px; }
  select.form-input { appearance: none; }
  textarea.form-input { resize: none; min-height: 80px; }
`;

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
  if (!msg) return null;
  return <div className={`toast ${type}`}>{msg}</div>;
}

function StarRating({ rating }) {
  return (
    <div className="rating-row">
      {[1,2,3,4,5].map(i => (
        <span key={i} className="rating-star">{i <= Math.round(rating) ? "★" : "☆"}</span>
      ))}
      <span className="rating-val">{rating}</span>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function AriTHEX() {
  const [screen, setScreen] = useState("splash");
  const [role, setRole] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [bookingArtist, setBookingArtist] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({ eventType: "", date: "", venue: "", payment: "advance" });
  const [chatOpen, setChatOpen] = useState(null);
  const [chatMsg, setChatMsg] = useState("");
  const [chatMessages, setChatMessages] = useState(CHAT_DATA);
  const [searchQ, setSearchQ] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const [myBookings, setMyBookings] = useState(BOOKINGS_DATA);
  const [bookingTab, setBookingTab] = useState("upcoming");
  const [adminView, setAdminView] = useState("dashboard");
  const [pendingVerify, setPendingVerify] = useState(ARTISTS.filter(a => !a.verified));
  const [onboardStep, setOnboardStep] = useState(0);
  const [authMode, setAuthMode] = useState("login");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loginRole, setLoginRole] = useState("customer");

  // ── SUPABASE AUTH STATE ──
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    onAuthChange((supabaseUser) => {
      if (supabaseUser) {
        setUser(supabaseUser);
        setRole(supabaseUser.user_metadata?.role || "customer");
        setScreen("main");
        setActiveTab(supabaseUser.user_metadata?.role === "admin" ? "admin" : "home");
      } else {
        setUser(null);
      }
    });
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 2500);
  };

  // Splash auto-advance
  useEffect(() => {
    if (screen === "splash") setTimeout(() => setScreen("onboarding"), 2400);
  }, [screen]);

  // ── SPLASH ──
  if (screen === "splash") return (
    <div className="app">
      <style>{styles}</style>
      <div className="splash">
        <div className="splash-bg" />
        <div className="splash-rings">
          <div className="splash-ring" /><div className="splash-ring" /><div className="splash-ring" />
        </div>
        <div className="splash-logo">Ari<span>THEX</span></div>
        <div className="splash-tagline">Book India's Best Talent</div>
        <div className="splash-loader"><div className="splash-loader-bar" /></div>
      </div>
    </div>
  );

  // ── ONBOARDING ──
  const ONBOARD_SLIDES = [
    { icon: "🎤", title: <>Discover <span>Top Talent</span></>, desc: "Browse thousands of verified artists, bands, DJs, and performers across India." },
    { icon: "📅", title: <>Book <span>Instantly</span></>, desc: "Check availability, set your budget, and confirm bookings in minutes." },
    { icon: "⭐", title: <>Events Made <span>Unforgettable</span></>, desc: "Verified artists, secure payments, and real reviews from real customers." },
  ];
  if (screen === "onboarding") return (
    <div className="app">
      <style>{styles}</style>
      <div className="onboarding">
        <div className="onboard-slide">
          <span className="onboard-icon">{ONBOARD_SLIDES[onboardStep].icon}</span>
          <div className="onboard-title">{ONBOARD_SLIDES[onboardStep].title}</div>
          <div className="onboard-desc">{ONBOARD_SLIDES[onboardStep].desc}</div>
        </div>
        <div className="onboard-dots">
          {ONBOARD_SLIDES.map((_, i) => <div key={i} className={`dot ${i === onboardStep ? "active" : ""}`} />)}
        </div>
        <div className="onboard-actions">
          {onboardStep < 2 ? (
            <>
              <button className="btn btn-primary" onClick={() => setOnboardStep(s => s + 1)}>Continue →</button>
              <button className="btn btn-ghost" onClick={() => setScreen("auth")}>Skip</button>
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={() => setScreen("auth")}>Get Started</button>
              <button className="btn btn-ghost" onClick={() => { setScreen("auth"); setAuthMode("login"); }}>Already have an account? Login</button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // ── AUTH ──
  if (screen === "auth") return (
    <div className="app">
      <style>{styles}</style>
      <div className="auth-screen">
        <div className="auth-header">
          <div className="auth-back" onClick={() => setScreen("onboarding")}>←</div>
          <div className="auth-title">{authMode === "login" ? "Welcome back 👋" : "Create Account"}</div>
          <div className="auth-subtitle">{authMode === "login" ? "Sign in to your AriTHEX account" : "Join AriTHEX today"}</div>
        </div>

        <div className="role-toggle">
          {["customer", "artist", "admin"].map(r => (
            <button key={r} className={`role-btn ${loginRole === r ? "active" : ""}`} onClick={() => setLoginRole(r)}>
              {r === "customer" ? "Customer" : r === "artist" ? "Artist" : "Admin"}
            </button>
          ))}
        </div>

        {authMode === "signup" && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Your name" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@example.com" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData(f => ({ ...f, password: e.target.value }))} />
        </div>

        {/* ── REAL SUPABASE AUTH BUTTON ── */}
        <button
          className="btn btn-primary"
          style={{ marginBottom: 16 }}
          disabled={authLoading}
          onClick={async () => {
            setAuthLoading(true);
            try {
              if (authMode === "login") {
                await logIn(formData.email, formData.password);
                showToast("Welcome back! 🎉");
              } else {
                await signUp(formData.email, formData.password, formData.name, loginRole);
                showToast("Check your email to confirm! 📧");
              }
            } catch (err) {
              showToast(err.message, "error");
            }
            setAuthLoading(false);
          }}>
          {authLoading ? "Please wait..." : authMode === "login" ? "Sign In" : "Create Account"}
        </button>

        <div className="auth-divider"><div className="auth-divider-line" /><span>or</span><div className="auth-divider-line" /></div>

        {/* ── REAL GOOGLE LOGIN ── */}
        <button className="social-btn" onClick={async () => {
          try {
            await googleLogin();
          } catch (err) {
            showToast("Google login failed", "error");
          }
        }}>
          <span>🌐</span> Continue with Google
        </button>

        <button className="social-btn" onClick={() => showToast("OTP coming soon! 📱")}>
          <span>📱</span> Continue with OTP
        </button>

        <div className="auth-footer">
          {authMode === "login"
            ? <>Don't have an account? <span onClick={() => setAuthMode("signup")}>Sign Up</span></>
            : <>Already have an account? <span onClick={() => setAuthMode("login")}>Login</span></>
          }
        </div>
      </div>
    </div>
  );

  // ── ARTIST PROFILE VIEW ──
  if (selectedArtist) {
    const artist = selectedArtist;
    const reviews = REVIEWS_MAP[artist.id] || [];
    return (
      <div className="app">
        <style>{styles}</style>
        <Toast {...toast} />
        <div className="scroll-content">
          <div className="profile-hero">
            <img src={artist.image} alt={artist.name} />
            <div className="profile-hero-overlay" />
            <div className="profile-back-btn" onClick={() => setSelectedArtist(null)}>←</div>
            {artist.verified && <div className="verified-badge" style={{ top: 56, right: 20, position: "absolute" }}>✓ Verified</div>}
            <div className="profile-hero-info">
              <div className="profile-name">{artist.name}</div>
              <div className="profile-meta-row">
                <span className="profile-cat">{CATEGORIES.find(c => c.id === artist.category)?.icon} {CATEGORIES.find(c => c.id === artist.category)?.label}</span>
                <span className="profile-city">📍 {artist.city}</span>
              </div>
            </div>
          </div>
          <div className="profile-body">
            <div className="profile-stats">
              <div className="stat-box"><div className="stat-val">{artist.rating}</div><div className="stat-label">Rating</div></div>
              <div className="stat-box"><div className="stat-val">{artist.bookings}</div><div className="stat-label">Bookings</div></div>
              <div className="stat-box"><div className="stat-val">{artist.experience}yr</div><div className="stat-label">Experience</div></div>
            </div>
            <div className="profile-section">
              <StarRating rating={artist.rating} />
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{artist.reviews} verified reviews</div>
            </div>
            <div className="profile-section">
              <div className="profile-section-title">About</div>
              <div className="profile-bio">{artist.bio}</div>
            </div>
            <div className="profile-section">
              <div className="profile-section-title">Specializations</div>
              <div className="tag-row">{artist.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
            </div>
            {artist.gallery?.length > 0 && (
              <div className="profile-section">
                <div className="profile-section-title">Gallery</div>
                <div className="gallery-scroll">
                  {artist.gallery.map((img, i) => <img key={i} src={img} alt="" className="gallery-img" />)}
                </div>
              </div>
            )}
            <div className="pricing-card">
              <div>
                <div className="pricing-label">Starting from</div>
                <div className="pricing-val">{artist.priceLabel}</div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => { setChatOpen(artist.id); setSelectedArtist(null); setActiveTab("chat"); }}>💬 Chat</button>
            </div>
            {reviews.length > 0 && (
              <div className="profile-section">
                <div className="profile-section-title">Reviews</div>
                {reviews.map((r, i) => (
                  <div key={i} className="review-card">
                    <div className="review-header">
                      <div className="review-user">{r.user}</div>
                      <div className="review-date">{r.date}</div>
                    </div>
                    <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
                      {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= r.rating ? "var(--gold)" : "var(--muted)", fontSize: 12 }}>{s <= r.rating ? "★" : "☆"}</span>)}
                    </div>
                    <div className="review-text">{r.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ padding: "0 20px 32px", background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => {
            setBookingArtist(artist);
            setBookingStep(1);
            setBookingData({ eventType: "", date: "", venue: "", payment: "advance" });
            setSelectedArtist(null);
            setScreen("booking");
          }}>
            🎟 Book {artist.name}
          </button>
        </div>
      </div>
    );
  }

  // ── BOOKING FLOW ──
  if (screen === "booking" && bookingArtist) {
    const totalSteps = 4;
    const calDays = [];
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    for (let i = 0; i < firstDay; i++) calDays.push(null);
    for (let d = 1; d <= 31; d++) {
      const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      if (new Date(dateStr).getMonth() === today.getMonth()) calDays.push({ d, dateStr, avail: bookingArtist.availability?.includes(dateStr) });
    }
    return (
      <div className="app">
        <style>{styles}</style>
        <Toast {...toast} />
        <div className="booking-screen">
          <div className="profile-back-btn" style={{ position: "static", marginBottom: 20, width: 40, height: 40 }} onClick={() => { setScreen("main"); setSelectedArtist(bookingArtist); }}>←</div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${(bookingStep / totalSteps) * 100}%` }} /></div>

          {bookingStep === 1 && (
            <div className="booking-step">
              <div className="booking-title">What's the event?</div>
              <div className="booking-sub">Select your event type</div>
              <div className="event-type-grid">
                {EVENT_TYPES.map(et => (
                  <div key={et} className={`event-type-btn ${bookingData.eventType === et ? "selected" : ""}`} onClick={() => setBookingData(d => ({ ...d, eventType: et }))}>{et}</div>
                ))}
              </div>
              <button className="btn btn-primary" disabled={!bookingData.eventType} onClick={() => setBookingStep(2)}>Next →</button>
            </div>
          )}

          {bookingStep === 2 && (
            <div className="booking-step">
              <div className="booking-title">Pick a Date</div>
              <div className="booking-sub">Green dates = artist available</div>
              <div className="cal-header">{["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} className="cal-day-label">{d}</div>)}</div>
              <div className="calendar-grid">
                {calDays.map((d, i) => d === null ? <div key={i} className="cal-day empty" /> : (
                  <div key={i} className={`cal-day ${d.avail ? "available" : ""} ${bookingData.date === d.dateStr ? "selected" : ""}`}
                    style={d.avail && bookingData.date !== d.dateStr ? { borderColor: "var(--success)", color: "var(--success)" } : {}}
                    onClick={() => d.avail && setBookingData(bd => ({ ...bd, date: d.dateStr }))}>
                    {d.d}
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label className="form-label">Venue / Location</label>
                <input className="form-input" placeholder="e.g. The Grand, Mumbai" value={bookingData.venue} onChange={e => setBookingData(d => ({ ...d, venue: e.target.value }))} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-secondary" onClick={() => setBookingStep(1)}>← Back</button>
                <button className="btn btn-primary" disabled={!bookingData.date || !bookingData.venue} onClick={() => setBookingStep(3)}>Next →</button>
              </div>
            </div>
          )}

          {bookingStep === 3 && (
            <div className="booking-step">
              <div className="booking-title">Payment</div>
              <div className="booking-sub">Choose payment option</div>
              <div className="booking-summary">
                <div className="summary-row"><span className="summary-label">Artist</span><span className="summary-val">{bookingArtist.name}</span></div>
                <div className="summary-row"><span className="summary-label">Event</span><span className="summary-val">{bookingData.eventType}</span></div>
                <div className="summary-row"><span className="summary-label">Date</span><span className="summary-val">{bookingData.date}</span></div>
                <div className="summary-row"><span className="summary-label">Venue</span><span className="summary-val">{bookingData.venue}</span></div>
                <div className="summary-row"><span className="summary-label">Total</span><span className="summary-val summary-total">₹{bookingArtist.price.toLocaleString()}</span></div>
              </div>
              <div className={`payment-option ${bookingData.payment === "advance" ? "selected" : ""}`} onClick={() => setBookingData(d => ({ ...d, payment: "advance" }))}>
                <div><div className="payment-option-label">Advance (50%)</div><div className="payment-option-sub">₹{(bookingArtist.price / 2).toLocaleString()} now, rest on event day</div></div>
                <span>{bookingData.payment === "advance" ? "◉" : "○"}</span>
              </div>
              <div className={`payment-option ${bookingData.payment === "full" ? "selected" : ""}`} onClick={() => setBookingData(d => ({ ...d, payment: "full" }))}>
                <div><div className="payment-option-label">Full Payment</div><div className="payment-option-sub">₹{bookingArtist.price.toLocaleString()} — 5% discount applied</div></div>
                <span>{bookingData.payment === "full" ? "◉" : "○"}</span>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button className="btn btn-secondary" onClick={() => setBookingStep(2)}>← Back</button>
                <button className="btn btn-primary" onClick={() => {
                  setMyBookings(b => [...b, { id: `BK00${b.length + 4}`, artist: bookingArtist, eventType: bookingData.eventType, eventDate: bookingData.date, venue: bookingData.venue, amount: bookingArtist.price, status: "confirmed", paid: true }]);
                  setBookingStep(4);
                }}>Pay & Confirm 🔒</button>
              </div>
            </div>
          )}

          {bookingStep === 4 && (
            <div className="booking-step">
              <div className="confirm-card">
                <div className="confirm-icon">🎉</div>
                <div className="confirm-title">Booking Confirmed!</div>
                <div className="confirm-id">Booking ID: BK00{myBookings.length}</div>
              </div>
              <div className="booking-summary">
                <div className="summary-row"><span className="summary-label">Artist</span><span className="summary-val">{bookingArtist.name}</span></div>
                <div className="summary-row"><span className="summary-label">Event</span><span className="summary-val">{bookingData.eventType}</span></div>
                <div className="summary-row"><span className="summary-label">Date</span><span className="summary-val">{bookingData.date}</span></div>
                <div className="summary-row"><span className="summary-label">Venue</span><span className="summary-val">{bookingData.venue}</span></div>
                <div className="summary-row"><span className="summary-label">Paid</span><span className="summary-val" style={{ color: "var(--success)" }}>✓ ₹{(bookingData.payment === "advance" ? bookingArtist.price / 2 : bookingArtist.price).toLocaleString()}</span></div>
              </div>
              <button className="btn btn-primary" onClick={() => { setScreen("main"); setActiveTab("bookings"); showToast("Booking saved! ✓"); }}>View My Bookings</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── CHAT SCREEN ──
  if (chatOpen && activeTab === "chat" && chatMessages[chatOpen]) {
    const conv = chatMessages[chatOpen];
    return (
      <div className="app">
        <style>{styles}</style>
        <div className="chat-screen">
          <div className="chat-header">
            <span className="chat-header-back" onClick={() => setChatOpen(null)}>←</span>
            <img src={conv.image} alt="" className="chat-header-avatar" />
            <div><div className="chat-header-name">{conv.name}</div><div className="chat-header-status">● Online</div></div>
          </div>
          <div className="chat-messages">
            {conv.messages.map((m, i) => (
              <div key={i} className={`message ${m.from}`}>
                <div className="message-bubble">{m.text}</div>
                <div className="message-time">{m.time}</div>
              </div>
            ))}
          </div>
          <div className="chat-input-row">
            <input className="chat-input" placeholder="Type a message..." value={chatMsg} onChange={e => setChatMsg(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && chatMsg.trim()) {
                  const now = new Date();
                  setChatMessages(cm => ({ ...cm, [chatOpen]: { ...cm[chatOpen], messages: [...cm[chatOpen].messages, { from: "me", text: chatMsg, time: `${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}` }] } }));
                  setChatMsg("");
                }
              }} />
            <button className="chat-send" onClick={() => {
              if (chatMsg.trim()) {
                const now = new Date();
                setChatMessages(cm => ({ ...cm, [chatOpen]: { ...cm[chatOpen], messages: [...cm[chatOpen].messages, { from: "me", text: chatMsg, time: `${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}` }] } }));
                setChatMsg("");
              }
            }}>➤</button>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN SCREENS ──
  const filteredArtists = ARTISTS.filter(a => {
    const matchCat = activeCat === "all" || a.category === activeCat;
    const matchQ = !searchQ || a.name.toLowerCase().includes(searchQ.toLowerCase()) || a.city.toLowerCase().includes(searchQ.toLowerCase()) || a.tags.some(t => t.toLowerCase().includes(searchQ.toLowerCase()));
    return matchCat && matchQ;
  });

  const renderHome = () => (
    <div className="scroll-content pb-100">
      <div className="screen-header">
        <div>
          <div className="header-title">AriTHEX 🎵</div>
          <div className="header-sub">Welcome, {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there"}!</div>
        </div>
        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" alt="" className="avatar" onClick={() => setActiveTab("profile")} />
      </div>
      <div className="search-bar" onClick={() => setActiveTab("search")}>
        <span className="search-icon">🔍</span>
        <input className="search-input" placeholder="Search artists, categories..." readOnly style={{ cursor: "pointer" }} />
      </div>
      <div className="home-banner">
        <div className="home-banner-label">🔥 Trending Now</div>
        <div className="home-banner-title">Book Top Artists for Your Events</div>
        <div className="home-banner-sub">500+ verified performers across India</div>
      </div>
      <div className="section-header"><div className="section-title">Categories</div></div>
      <div className="cats-scroll">
        {[{ id: "all", label: "All", icon: "🎯" }, ...CATEGORIES].map(c => (
          <div key={c.id} className={`cat-chip ${activeCat === c.id ? "active" : ""}`} onClick={() => { setActiveCat(c.id); setActiveTab("search"); }}>
            <span className="cat-icon">{c.icon}</span>
            <span className="cat-label">{c.label}</span>
          </div>
        ))}
      </div>
      <div className="section-header">
        <div className="section-title">🔥 Trending</div>
        <span className="see-all" onClick={() => setActiveTab("search")}>See all</span>
      </div>
      <div className="artists-scroll">
        {ARTISTS.filter(a => a.trending).map(artist => (
          <div key={artist.id} className="artist-card-sm" onClick={() => setSelectedArtist(artist)}>
            {artist.trending && <div className="trending-badge">🔥 Trending</div>}
            {artist.verified && <div className="verified-badge">✓</div>}
            <img src={artist.image} alt={artist.name} />
            <div className="artist-card-sm-info">
              <div className="artist-card-sm-name">{artist.name}</div>
              <div className="artist-card-sm-cat">{CATEGORIES.find(c => c.id === artist.category)?.label} • {artist.city}</div>
              <div className="artist-card-sm-price">{artist.priceLabel}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="section-header">
        <div className="section-title">⭐ Featured</div>
        <span className="see-all" onClick={() => setActiveTab("search")}>See all</span>
      </div>
      <div className="artists-scroll">
        {ARTISTS.filter(a => a.featured).map(artist => (
          <div key={artist.id} className="artist-card-sm" onClick={() => setSelectedArtist(artist)}>
            {artist.verified && <div className="verified-badge">✓</div>}
            <img src={artist.image} alt={artist.name} />
            <div className="artist-card-sm-info">
              <div className="artist-card-sm-name">{artist.name}</div>
              <div className="artist-card-sm-cat">{CATEGORIES.find(c => c.id === artist.category)?.label} • {artist.city}</div>
              <div className="artist-card-sm-price">{artist.priceLabel}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="scroll-content pb-100">
      <div className="screen-header"><div className="header-title">Discover</div></div>
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input className="search-input" placeholder="Search artists, cities, genres..." value={searchQ} onChange={e => setSearchQ(e.target.value)} autoFocus />
      </div>
      <div className="filter-row">
        {[{ id: "all", label: "All" }, ...CATEGORIES].map(c => (
          <div key={c.id} className={`filter-chip ${activeCat === c.id ? "active" : ""}`} onClick={() => setActiveCat(c.id)}>
            {c.icon} {c.label}
          </div>
        ))}
      </div>
      <div style={{ padding: "0 20px", marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>{filteredArtists.length} artists found</span>
      </div>
      <div className="artist-list">
        {filteredArtists.map(artist => (
          <div key={artist.id} className="artist-card-lg" onClick={() => setSelectedArtist(artist)}>
            <img src={artist.image} alt={artist.name} />
            <div className="artist-card-lg-info">
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div className="artist-card-lg-name">{artist.name}</div>
                {artist.verified && <span style={{ color: "var(--success)", fontSize: 12, fontWeight: 700 }}>✓</span>}
              </div>
              <div className="artist-card-lg-meta">{CATEGORIES.find(c => c.id === artist.category)?.label} • {artist.city}</div>
              <StarRating rating={artist.rating} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="tag-row">{artist.tags.slice(0, 2).map(t => <span key={t} className="tag">{t}</span>)}</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent2)" }}>{artist.priceLabel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBookings = () => {
    const upcoming = myBookings.filter(b => b.status !== "completed");
    const past = myBookings.filter(b => b.status === "completed");
    const list = bookingTab === "upcoming" ? upcoming : past;
    return (
      <div className="scroll-content pb-100">
        <div className="screen-header"><div className="header-title">My Bookings</div></div>
        <div className="tabs">
          <button className={`tab ${bookingTab === "upcoming" ? "active" : ""}`} onClick={() => setBookingTab("upcoming")}>Upcoming ({upcoming.length})</button>
          <button className={`tab ${bookingTab === "past" ? "active" : ""}`} onClick={() => setBookingTab("past")}>Past ({past.length})</button>
        </div>
        <div className="bookings-list">
          {list.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
              <div>No {bookingTab} bookings</div>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 16, width: "auto" }} onClick={() => setActiveTab("search")}>Browse Artists</button>
            </div>
          ) : list.map(b => (
            <div key={b.id} className="booking-card">
              <img src={b.artist.image} alt={b.artist.name} />
              <div className="booking-info">
                <div className="booking-artist">{b.artist.name}</div>
                <div className="booking-event">{b.eventType} • {b.eventDate}</div>
                <div className="booking-meta-row">
                  <span className={`status-badge status-${b.status}`}>{b.status}</span>
                  <span className="booking-amount">₹{b.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderChat = () => (
    <div className="scroll-content pb-100">
      <div className="screen-header"><div className="header-title">Messages</div></div>
      <div className="chat-list">
        {Object.entries(chatMessages).map(([id, conv]) => (
          <div key={id} className="chat-item" onClick={() => setChatOpen(Number(id))}>
            <img src={conv.image} alt="" className="chat-avatar" />
            <div className="chat-info">
              <div className="chat-name">{conv.name}</div>
              <div className="chat-preview">{conv.messages[conv.messages.length - 1]?.text?.slice(0, 40)}...</div>
            </div>
            <div className="chat-time">{conv.messages[conv.messages.length - 1]?.time}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="scroll-content pb-100">
      <div className="screen-header"><div className="header-title">Profile</div></div>
      <div style={{ padding: "0 20px" }}>
        <div className="user-card">
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" alt="" className="user-avatar-lg" />
          <div>
            <div className="user-name">{user?.user_metadata?.full_name || "User"}</div>
            <div className="user-email">{user?.email}</div>
            <div style={{ marginTop: 4 }}><span className="status-badge status-confirmed">{role || "Customer"}</span></div>
          </div>
        </div>
        <div className="menu-section">
          <div className="menu-title">Account</div>
          <div className="menu-item"><span className="menu-icon">👤</span><span className="menu-label">Edit Profile</span><span className="menu-arrow">›</span></div>
          <div className="menu-item"><span className="menu-icon">🔔</span><span className="menu-label">Notifications</span><span className="menu-arrow">›</span></div>
          <div className="menu-item"><span className="menu-icon">🔒</span><span className="menu-label">Privacy & Security</span><span className="menu-arrow">›</span></div>
        </div>
        <div className="menu-section">
          <div className="menu-title">Bookings</div>
          <div className="menu-item" onClick={() => setActiveTab("bookings")}><span className="menu-icon">📅</span><span className="menu-label">My Bookings</span><span className="menu-arrow">›</span></div>
          <div className="menu-item"><span className="menu-icon">❤️</span><span className="menu-label">Saved Artists</span><span className="menu-arrow">›</span></div>
          <div className="menu-item"><span className="menu-icon">⭐</span><span className="menu-label">My Reviews</span><span className="menu-arrow">›</span></div>
        </div>
        <div className="menu-section">
          <div className="menu-title">Support</div>
          <div className="menu-item"><span className="menu-icon">❓</span><span className="menu-label">Help Center</span><span className="menu-arrow">›</span></div>
          <div className="menu-item"><span className="menu-icon">📞</span><span className="menu-label">Contact Support</span><span className="menu-arrow">›</span></div>
        </div>

        {/* ── REAL SIGN OUT ── */}
        <button className="btn btn-danger" onClick={async () => {
          await logOut();
          setScreen("auth");
          showToast("Logged out", "error");
        }}>Sign Out</button>
      </div>
    </div>
  );

  const renderArtistDash = () => (
    <div className="scroll-content pb-100">
      <div className="screen-header">
        <div>
          <div className="header-title">Dashboard</div>
          <div className="header-sub">Welcome, {user?.user_metadata?.full_name || "Artist"}!</div>
        </div>
        <img src={ARTISTS[0].image} alt="" className="avatar" />
      </div>
      <div style={{ padding: "0 20px" }}>
        <div className="earnings-card">
          <div className="earnings-label">Total Earnings</div>
          <div className="earnings-amount">₹3,72,500</div>
          <div className="earnings-meta">↑ 18% from last month</div>
          <div className="earnings-stats">
            <div className="earnings-stat"><div className="earnings-stat-val">47</div><div className="earnings-stat-label">Total Bookings</div></div>
            <div className="earnings-stat"><div className="earnings-stat-val">4.9 ⭐</div><div className="earnings-stat-label">Avg Rating</div></div>
          </div>
        </div>
        <div className="section-header" style={{ padding: 0, marginBottom: 14 }}>
          <div className="section-title">New Requests</div>
        </div>
        {[
          { event: "Wedding Reception", client: "Mehta Family", date: "Feb 24, 2024", venue: "Taj Palace, Delhi", amount: 25000 },
          { event: "Corporate Party", client: "TechCorp India", date: "Mar 5, 2024", venue: "ITC Grand, Bangalore", amount: 30000 }
        ].map((req, i) => (
          <div key={i} className="req-card">
            <div className="req-header">
              <div><div className="req-event">{req.event}</div><div className="req-date">📅 {req.date} • {req.venue}</div><div className="req-date" style={{ marginTop: 2 }}>👤 {req.client}</div></div>
              <div className="req-amount">₹{req.amount.toLocaleString()}</div>
            </div>
            <div className="req-actions">
              <button className="btn btn-sm" style={{ background: "rgba(34,197,94,0.15)", color: "var(--success)", border: "1px solid rgba(34,197,94,0.3)", flex: 1, borderRadius: 10 }} onClick={() => showToast("Booking accepted! ✓")}>✓ Accept</button>
              <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => showToast("Booking declined", "error")}>✗ Decline</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAdmin = () => (
    <div className="scroll-content pb-100">
      <div className="screen-header">
        <div><div className="header-title">Admin Panel</div><div className="header-sub">AriTHEX Control Center</div></div>
        <span style={{ fontSize: 24 }}>🛡️</span>
      </div>
      <div style={{ padding: "0 20px" }}>
        <div className="admin-stats-grid">
          <div className="admin-stat-card"><div className="admin-stat-val" style={{ color: "var(--accent)" }}>{ADMIN_STATS.totalUsers.toLocaleString()}</div><div className="admin-stat-label">Total Users</div></div>
          <div className="admin-stat-card"><div className="admin-stat-val" style={{ color: "var(--accent2)" }}>{ADMIN_STATS.totalArtists}</div><div className="admin-stat-label">Artists</div></div>
          <div className="admin-stat-card"><div className="admin-stat-val" style={{ color: "var(--success)" }}>₹{(ADMIN_STATS.revenue / 100000).toFixed(1)}L</div><div className="admin-stat-label">Revenue</div></div>
          <div className="admin-stat-card"><div className="admin-stat-val">{ADMIN_STATS.activeBookings}</div><div className="admin-stat-label">Active Bookings</div></div>
        </div>
        <div className="admin-action-btn" onClick={() => setAdminView(adminView === "verify" ? "dashboard" : "verify")}>
          <span className="admin-action-icon">🔍</span><span className="admin-action-label">Artist Verification</span><span className="admin-action-badge">{pendingVerify.length}</span>
        </div>
        <div className="admin-action-btn" onClick={() => showToast("Booking monitor: 67 active")}>
          <span className="admin-action-icon">📋</span><span className="admin-action-label">Manage Bookings</span><span className="admin-action-badge">{ADMIN_STATS.activeBookings}</span>
        </div>
        <div className="admin-action-btn" onClick={() => showToast("3 disputes in queue", "error")}>
          <span className="admin-action-icon">⚠️</span><span className="admin-action-label">Disputes</span><span className="admin-action-badge" style={{ background: "var(--danger)" }}>{ADMIN_STATS.disputes}</span>
        </div>
        <div className="admin-action-btn"><span className="admin-action-icon">👥</span><span className="admin-action-label">User Management</span><span className="menu-arrow">›</span></div>
        <div className="admin-action-btn"><span className="admin-action-icon">💰</span><span className="admin-action-label">Commission Settings</span><span className="menu-arrow">›</span></div>
        {adminView === "verify" && (
          <div style={{ marginTop: 20 }}>
            <div className="section-title" style={{ marginBottom: 14 }}>Pending Verifications</div>
            {pendingVerify.length === 0 ? (
              <div style={{ textAlign: "center", color: "var(--success)", padding: 20, background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)" }}>✓ All artists verified!</div>
            ) : pendingVerify.map(a => (
              <div key={a.id} className="verify-card">
                <img src={a.image} alt="" />
                <div className="verify-info"><div className="verify-name">{a.name}</div><div className="verify-cat">{CATEGORIES.find(c => c.id === a.category)?.label} • {a.city}</div></div>
                <div className="verify-actions">
                  <button className="btn btn-sm" style={{ background: "rgba(34,197,94,0.15)", color: "var(--success)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 8 }} onClick={() => { setPendingVerify(v => v.filter(x => x.id !== a.id)); showToast(`${a.name} verified! ✓`); }}>✓</button>
                  <button className="btn btn-danger btn-sm" style={{ borderRadius: 8 }} onClick={() => { setPendingVerify(v => v.filter(x => x.id !== a.id)); showToast(`${a.name} rejected`, "error"); }}>✗</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const NAV_ITEMS = role === "admin"
    ? [{ id: "admin", label: "Dashboard", icon: "🛡️" }, { id: "search", label: "Artists", icon: "🎭" }, { id: "profile", label: "Profile", icon: "👤" }]
    : role === "artist"
    ? [{ id: "home", label: "Dashboard", icon: "📊" }, { id: "bookings", label: "Requests", icon: "📋" }, { id: "chat", label: "Messages", icon: "💬" }, { id: "profile", label: "Profile", icon: "👤" }]
    : [{ id: "home", label: "Home", icon: "🏠" }, { id: "search", label: "Search", icon: "🔍" }, { id: "bookings", label: "Bookings", icon: "📅" }, { id: "chat", label: "Chat", icon: "💬" }, { id: "profile", label: "Profile", icon: "👤" }];

  const renderContent = () => {
    if (role === "artist") {
      if (activeTab === "home") return renderArtistDash();
      if (activeTab === "bookings") return renderBookings();
      if (activeTab === "chat") return renderChat();
      if (activeTab === "profile") return renderProfile();
    }
    if (role === "admin") {
      if (activeTab === "admin") return renderAdmin();
      if (activeTab === "search") return renderSearch();
      if (activeTab === "profile") return renderProfile();
    }
    if (activeTab === "home") return renderHome();
    if (activeTab === "search") return renderSearch();
    if (activeTab === "bookings") return renderBookings();
    if (activeTab === "chat") return renderChat();
    if (activeTab === "profile") return renderProfile();
  };

  return (
    <div className="app">
      <style>{styles}</style>
      <Toast {...toast} />
      {renderContent()}
      <nav className="bottom-nav">
        {NAV_ITEMS.map(item => (
          <div key={item.id} className={`nav-item ${activeTab === item.id ? "active" : ""}`} onClick={() => { setActiveTab(item.id); if (item.id === "chat") setChatOpen(null); }}>
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}

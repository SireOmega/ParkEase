# ParkEase — Residential Parking Sharing Prototype

> **Academic Prototype for VTU Classroom Evaluation**  
> *Find a space. Park with ease. Earn from your space.*  
> Bengaluru, India • Strict TypeScript • React 19 • Tailwind CSS v4 • Zero Backend • Offline SVG Map

---

## 🚀 Overview

**ParkEase** is a client-only peer-to-peer residential parking platform tailored for Bengaluru. It features:
1. **Seeker Mobile App**: Centered 390×844 px mobile frame with offline interactive SVG street map, vehicle filters, geolocation fallback, instant booking flow, and booking status tracking.
2. **Provider Portal**: Desktop split dashboard for residential parking hosts (Rohan) with dynamic KPI tracking, monthly/daily earnings charts, live booking accept/reject, and an Add Space wizard.
3. **Presenter Control Bar**: Discreet control bar outside the app viewport for instant mode toggling, one-click runbook shortcuts, and deterministic demo data reset.
4. **Real-Time Cross-Window Sync**: Synchronizes state instantly across side-by-side browser windows via `localStorage` and `window` storage events—no external server or database required.

---

## 🛠️ Tech Stack & Tooling

- **Framework**: React 19 (`react`, `react-dom`)
- **Build Tool**: Vite (`@vitejs/plugin-react`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first theme tokens)
- **Language**: Strict TypeScript 5+ (`strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitAny: true`, zero `any`)
- **Icons**: `lucide-react`
- **Map Engine**: Typed interactive SVG street map (100% offline, Vidhana Soudha / Cubbon Park vicinity)
- **Charts**: Custom typed SVG line and bar charts

---

## 💻 Quick Start

### 1. Start Development Server
```bash
# Using bun
bun run dev

# Or using npm
npm run dev
```

### 2. Build & Validate
```bash
bun run build
# Runs strict typecheck (tsc -b) followed by production vite build
```

---

## 🖥️ Running the 2-Window Live Demo

To experience real-time two-way synchronization without any backend:

1. Open `http://localhost:5173` in two browser windows side by side on your laptop screen.
2. In **Window 1 (Left)**: Keep the default **Parking Seeker App (Mobile View)**.
3. In **Window 2 (Right)**: Switch mode to **Parking Provider Portal (Dashboard View)** using the top presenter bar.
4. Any action in one window (creating a booking, accepting a request, publishing a new parking spot, or resetting data) reflects in the other window in `< 100ms`.

---

## ⏱️ 90-Second VTU Demo Runbook

| Time | Target | Action | Expected Output |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:10** | **Seeker** | Click **Seeker Map** shortcut (or Get Started → Allow) | Enters map view centered on Bengaluru fallback with pulsing user dot and parking pins. |
| **0:10 – 0:20** | **Seeker** | Click **Car** or **Scooty** filter pill | Map filters spaces; preview card highlights **Green View Parking** (350 m • ₹30/hr). |
| **0:20 – 0:30** | **Seeker** | Tap card → Space Details → Keep default **2 hrs** → Click **Book Now** | Shows **Booking Confirmed!** with sequential ID `#PE2510247` and total price ₹60. |
| **0:30 – 0:45** | **Provider** | Switch to Provider window / Click **Provider Dashboard** | Total Earnings shows **₹4,800** (`↑ 20%` badge). Pending Requests shows `#PE2510247`. |
| **0:45 – 1:00** | **Provider** | Click **Accept** on `#PE2510247` | Total Earnings dynamically updates to **₹4,860**; status updates to **Confirmed** in Seeker's My Bookings! |
| **1:00 – 1:15** | **Provider** | Go to **Add New Space** wizard → Fill details → Click **Publish** | New parking space publishes and appears live on the Seeker map immediately. |
| **1:15 – 1:30** | **Presenter** | Click **Reset Demo Data** in the top control bar | All data restores deterministically to baseline seed state (`#PE2510247` ready for next rehearsal). |

---

## 🎨 Design Tokens

- **Primary Green**: `#1E6B43`
- **Mint Accent**: `#E8F5EE`
- **Provider Sidebar**: `#1E3A5F`
- **Background Canvas**: `#F8FAFC`
- **Card**: `#FFFFFF`
- **Dark Text**: `#0F172A`
- **Muted Slate**: `#64748B`
- **Danger Red**: `#DC2626`

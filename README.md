# 🌀 LoopLocal — Offline-First Loyalty Rewards for Local Businesses

[![Mobile Friendly](https://img.shields.io/badge/Mobile%20Friendly-Yes-27ae60?style=flat-square&logo=android)](https://github.com/preston176/looplocal-rewards-mobile)
[![PWA](https://img.shields.io/badge/Progressive%20Web%20App-PWA-blueviolet?logo=pwa&style=flat-square)](https://github.com/preston176/looplocal-rewards-mobile)
<!-- [![License](https://img.shields.io/github/license/preston176/looplocal-rewards-mobile?style=flat-square)](https://github.com/preston176/looplocal-rewards-mobile/blob/main/LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/preston176/looplocal-rewards-mobile/main.yml?style=flat-square)](https://github.com/preston176/looplocal-rewards-mobile/actions) -->
[![Last Commit](https://img.shields.io/github/last-commit/preston176/looplocal-rewards-mobile?style=flat-square)](https://github.com/preston176/looplocal-rewards-mobile/commits)

> A mobile-first, progressive web app (PWA) that empowers salons, barbershops, and eateries with a smart, **offline-friendly** loyalty rewards system — no app installs needed.

---

## 📚 Table of Contents

- [Why LoopLocal?](#-why-looplocal)
- [Key Features](#-features)
- [Product Overview (Screenshots)](#-product-overview)
- [User Journeys](#-user-journeys)
- [App Architecture](#-app-architecture)
- [Onboarding Flows](#-onboarding-flows)
- [Offline-First Logic](#-offline-first-logic)
- [Testing Scenarios](#-testing-scenarios)
- [Tech Stack](#-tech-stack)
- [Development Setup](#-dev-setup-optional)
- [Screenshots](#-screenshots)
- [Localization & Extensibility](#-localization--extensibility)
- [Future Enhancements](#-future-enhancements)
- [Highlight Reel](#highlight-reel)
- [Conclusion](#-conclusion)
- [Contact](#-contact)
- [Back to Top ⏫](#top)

<a name="top"></a>

---

## 🧠 Why LoopLocal?

Local businesses often struggle to retain loyal customers due to:

- Lack of affordable customer tracking tools
- Limited internet access
- Low digital adoption among walk-in clients

**LoopLocal** solves this by combining **WiFi-based check-ins**, **QR/NFC fallback**, and **offline-first data syncing** into a seamless experience.

---

## 🚀 Features

### ✅ For Customers

- Check-in automatically via **WiFi login**, **QR scan**, or **NFC tap**
- Earn loyalty points and streak bonuses
- Enjoy gamified rewards (Spin-the-Wheel, Leaderboard)
- Offline-first access with **PWA support**
- View reward progress, invite friends, and redeem offers

### 🧑‍💼 For Business Owners

- Create and manage a loyalty program
- View real-time check-ins and customer data
- Export analytics (CSV/JSON)
- Works even without internet — auto-syncs later

---

## 🖼️ Product Overview

<p align="center">
  <img src="assets/images/demo/home.jpg" alt="Home Screen" width="270" style="border-radius:1.5rem;box-shadow:0 2px 24px #0002; margin:8px; max-width:100%;">
  <img src="assets/images/demo/business.jpg" alt="Business Sign-up Screen" width="270" style="border-radius:1.5rem;box-shadow:0 2px 24px #0002; margin:8px; max-width:100%;">
  <img src="assets/images/demo/business-setting.jpg" alt="Business Settings Screen" width="270" style="border-radius:1.5rem;box-shadow:0 2px 24px #0002; margin:8px; max-width:100%;">
  <img src="assets/images/demo/customer-home.jpg" alt="Check-In Screen" width="270" style="border-radius:1.5rem;box-shadow:0 2px 24px #0002; margin:8px; max-width:100%;">
</p>

> _All screenshots are from a mobile device for optimal mobile-first preview._

---

## 📲 User Journeys

### 1. Customer Check-In (WiFi)

```mermaid
flowchart LR
    A(Customer) --> B(Connects to business WiFi)
    B --> C(Captive portal appears)
    C --> D(Enters phone number)
    D --> E(Reward points added)
```

---

### 2. Customer Check-In (Offline QR/NFC)

```mermaid
flowchart LR
    A(Customer scans QR / taps NFC)
    A --> B(App logs check-in locally)
    B --> C(Syncs data later)
    C --> D(Points reflect)
```

---

### 3. Business View (Owner)

```mermaid
flowchart LR
    A(Owner logs in)
    A --> B(Views stats, edits reward program)
    B --> C(Data auto-syncs)
    C --> D(Exports reports)
```

---
## 🧱 App Architecture

```mermaid
graph TD
    A[Customer Device] -->|Connects to WiFi| B[Captive Portal / PWA]
    B --> C[Local DB (IndexedDB)]
    C --> D[Sync Engine]
    D -->|When online| E[Cloud API]
    B --> F[Gamified UI]
    E --> G[Admin Dashboard]
    G --> H[Business Analytics & Exports]
```

---

## 🔐 Onboarding Flows

### 🎉 Customer

1. Open app or WiFi portal
2. Enter phone number (simulate OTP)
3. Start earning points on visits

### 🧑‍💼 Business Owner

1. Register business name & category
2. Define reward tiers (e.g., 5 visits = free item)
3. Access dashboard for metrics & customer info

---

## 📡 Offline-First Logic

- All check-in actions are cached locally
- App detects online status via `navigator.onLine`
- Queued actions sync automatically when reconnected
- Admin dashboard updates in real time post-sync

### Edge Case Handling

- Duplicate visits on same day are ignored
- Stale sync requests are time-filtered
- Points are assigned on first valid connection only

---

## 🧪 Testing Scenarios

| Test Case                        | Expected Result                                       |
|----------------------------------|-------------------------------------------------------|
| Offline QR check-in              | Check-in cached and synced later                      |
| Multiple check-ins in a day      | Only 1 rewarded per 24h per venue                     |
| Referral link reuse              | Only unique phone numbers rewarded                    |
| Owner logs in with wrong phone   | Access denied with retry notice                      |
| Data export                      | File is downloadable, correct data in table format    |

---

## 🔧 Tech Stack

| Layer             | Tech                                                                 |
|------------------|----------------------------------------------------------------------|
| Frontend         | PWA (React/Next.js or similar), Tailwind CSS                         |
| Offline Storage  | IndexedDB (via Dexie.js or localStorage fallback)                    |
| Backend (Edge)   | Express.js / SQLite (or local Node.js server on device)              |
| Captive Portal   | Simulated via router route or real via router login page             |
| Notifications    | Twilio / Africa’s Talking / Firebase (simulated in prototype)        |
| QR/NFC Sim       | HTML-based simulation buttons for tap/scan interaction               |

---

## 🛠 Dev Setup (Optional)

> For custom builds

```bash
git clone https://github.com/preston176/looplocal-rewards-mobile.git
cd looplocal-rewards-mobile
npm install
npm start
```

### Using Bun (Recommended for performance)
```bash
bun install
bun start
```

- To simulate offline: disable browser network in DevTools
- To test PWA: install on mobile home screen or use Lighthouse

---

## 🎨 Screenshots

| Customer Home | Owner Dashboard |
|---------------|----------------|
| ![Customer](assets\images\demo\customer-home.jpg) | ![Owner](assets\images\demo\business-setting.jpg) |


---

## 🌍 Localization & Extensibility

- ✅ Multi-business support (franchise model)
- ✅ Custom branding (business logos + color themes)
- ✅ Multi-language support (future roadmap)
- ✅ Webhooks for CRM integration (Zapier, etc.)

---

## 💡 Future Enhancements

- AI-based reward suggestions
- NFC business cards for instant referrals
- Voice-enabled customer kiosk mode
- WhatsApp bot for reward balance checks
- IoT beacons for passive check-ins

---

## 👨‍⚖️ Highlight Reel

> LoopLocal is a scalable, offline-first platform that brings modern loyalty systems to underserved local businesses. It mimics big-tech ecosystems (Apple Pay check-ins, Google WiFi captive portals), yet functions **without dependency on full-time internet** or expensive infrastructure. All while giving users **fun, gamified experiences** they already love.

---

## 🏁 Conclusion

LoopLocal empowers small businesses with tech they can afford, and gives customers rewards they’ll love — even without internet.

> Built with ❤️ to help small businesses stay competitive.

---

## 📬 Contact

Made for [PLP Vibe Coding Hackathon](https://powerlearnprojectafrica.org/) by [Preston Mayieka](https://www.linkedin.com/in/preston-mayieka)  
GitHub: [preston176](https://github.com/preston176)  
Email: [prestonynamweya@example.com](mailto:prestonynamweya@example.com)  
Twitter: [@preston_Mayieka](https://twitter.com/preston_Mayieka)  
LinkedIn: [linkedin.com/in/preston-mayieka](https://www.linkedin.com/in/preston-mayieka)

---

<p align="right">
  <a href="#top">Back to Top ⏫</a>
</p>
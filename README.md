
# 🌀 LoopLocal — Offline-First Loyalty Rewards for Local Businesses

> A mobile-first, progressive web app (PWA) that empowers salons, barbershops, and eateries with a smart, **offline-friendly** loyalty rewards system — no app installs needed.

---

## 🧠 Why LoopLocal?

Local businesses often struggle to retain loyal customers due to:

- Lack of affordable customer tracking tools
- Limited internet access
- Low digital adoption among walk-in clients

**LoopLocal** solves this by combining **WiFi-based check-ins**, **QR/NFC fallback**, and **offline-first data syncing** into a seamless experience.

---

## 🖼️ Product Overview

![LoopLocal Overview](https://i.imgur.com/GDKdvqO.png)

---

## 🚀 Features

### ✅ For Customers:

- Check-in automatically via **WiFi login**, **QR scan**, or **NFC tap**
- Earn loyalty points and streak bonuses
- Enjoy gamified rewards (Spin-the-Wheel, Leaderboard)
- Offline-first access with **PWA support**
- View reward progress, invite friends, and redeem offers

### 🧑‍💼 For Business Owners:

- Create and manage a loyalty program
- View real-time check-ins and customer data
- Export analytics (CSV/JSON)
- Works even without internet — auto-syncs later

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

## 📲 User Journeys

### 1. Customer Check-In (WiFi)

```
Customer → Connects to business WiFi → Captive portal appears → Enters phone number → Reward points added
```

### 2. Customer Check-In (Offline QR/NFC)

```
Customer scans QR / taps NFC → App logs check-in locally → Syncs data later → Points reflect
```

### 3. Business View (Owner)

```
Owner logs in → Views stats, edits reward program → Data auto-syncs → Exports reports
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

### 🎉 Customer:

1. Open app or WiFi portal
2. Enter phone number (simulate OTP)
3. Start earning points on visits

### 🧑‍💼 Business Owner:

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

## 🛠 Dev Setup (Optional)

> For custom builds

```bash
git clone https://github.com//looplocal.git
cd looplocal
npm install
npm run dev
```

- To simulate offline: disable browser network in DevTools
- To test PWA: install on mobile home screen or use Lighthouse

---

## 🎨 Screenshots

| Customer Home | Owner Dashboard |
|---------------|------------------|
| ![Customer](https://i.imgur.com/aGqHKFL.png) | ![Owner](https://i.imgur.com/jBt1YFr.png) |

---

## 📤 Data Export Format

```json
[
  {
    "phone": "+254712345678",
    "visits": 12,
    "lastCheckIn": "2025-05-25T12:30:00Z",
    "referredBy": "+254798765432"
  }
]
```

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

## 👨‍⚖️ Judges’ Highlight Reel

> LoopLocal is a scalable, offline-first platform that brings modern loyalty systems to underserved local businesses. It mimics big-tech ecosystems (Apple Pay check-ins, Google WiFi captive portals), yet functions **without dependency on full-time internet** or expensive infrastructure. All while giving users **fun, gamified experiences** they already love.

---

## 🏁 Conclusion

LoopLocal empowers small businesses with tech they can afford, and gives customers rewards they’ll love — even without internet.

> Built with ❤️ to help small businesses stay competitive.

---

## 📬 Contact

Made for [PLP Vibe Coding Hackathon] by [Preston Mayieka]  
GitHub: [preston176]  
Email: [prestonynamweya@example.com]  
Twitter: [@preston_Mayieka]
LinkedIn: [linkedin.com/in/preston-mayieka](https://www.linkedin.com/in/preston-mayieka)
---

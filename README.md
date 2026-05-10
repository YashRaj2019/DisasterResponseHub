# DisasterLink – Tactical Disaster Intelligence & Response Grid

DisasterLink is a high-fidelity, mission-critical MERN application designed for real-time disaster management and emergency orchestration. It provides a state-of-the-art interface for citizens, field responders, and tactical commanders to coordinate life-saving operations during large-scale crises.

## 🛰️ Advanced Tactical Features

- **Global Response Grid**: Real-time map integration powered by **NASA (EONET)** and **USGS**, featuring live earthquake, wildfire, and flood tracking.
- **Crisis Mode State Engine**: A platform-wide emergency toggle that shifts the entire UI into a high-visibility, priority-response state.
- **Tactical Control Room**: Restricted-access command center featuring live satellite feed simulations and encrypted mission logs.
- **Identity & Verification**: Professional responder onboarding with **Cloudinary-backed** document scanning and QR-based digital identity cards.
- **Global Situation Ticker**: Real-time situational awareness broadcast system for platform-wide alerts.
- **System Telemetry**: Live infrastructure monitoring tracking AI core health, neural grid load, and satellite synchronization.

## 🛠️ Mission-Critical Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS & Framer Motion (High-end animations)
- **State Management**: Redux Toolkit (Persistent Auth & Crisis State)
- **Geospatial**: Leaflet.js with custom risk-zone rendering
- **Communication**: Socket.io Client for real-time telemetry

### Backend
- **Core**: Node.js & Express.js
- **Database**: MongoDB Atlas with Geospatial indexing
- **Storage**: Cloudinary (Secure Media & Credential Storage)
- **Security**: JWT (HttpOnly Cookies), Helmet, Rate Limiting, and Role-Based Guards

## 📦 System Architecture

```
DisasterLink/
├── backend/            # Mission Control (API & Sockets)
│   ├── config/         # Database, Cloudinary & Socket configs
│   ├── controllers/    # Tactical operation logic
│   ├── middleware/     # Auth, Security & Upload filters
│   ├── models/         # Geospatial & User Schemas
│   └── routes/         # Secure API Gateways
└── frontend/           # Field Interface (React)
    ├── src/
    │   ├── utils/      # Centralized API & Logic Utilities
    │   ├── hooks/      # Real-time state hooks (useSocket)
    │   ├── pages/      # Tactical Dashboards & Command Center
    │   └── components/ # High-fidelity UI Modules
```

## ⚙️ Deployment & Deployment Configuration

### 1. Repository Setup
```bash
git clone <repo-url>
cd DisasterLink
```

### 2. Backend Infrastructure (`/backend/.env`)
Configure your server-side environment:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_tactical_encryption_key
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### 3. Frontend Configuration (`/frontend/.env`)
Sync your field interface with the backend:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Initialization
**Terminal 1 (Backend Engine):**
```bash
cd backend && npm install && npm run dev
```

**Terminal 2 (Frontend Interface):**
```bash
cd frontend && npm install && npm run dev
```

## 🌍 Production Readiness

- **CI/CD**: Optimized for seamless deployment on **Render** (Backend) and **Vercel** (Frontend).
- **Security**: Pre-configured with CORS protection and secure cookie handling.
- **Scalability**: Designed to handle high-concurrency real-time updates via WebSocket load balancing.

---
**DisasterLink** – *When every second counts.*

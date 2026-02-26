# 🎓 Smart Campus Services Hub

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> **A unified, premium digital campus experience replacing fragmented communication with a single, high-performance ecosystem.**

Smart Campus Services Hub consolidates all essential non-academic campus services—canteen, maintenance, transport, lost & found, and events—into one responsive platform. Built with a focus on modern aesthetics (Glassmorphism), real-time efficiency, and student-centric design.

---

## ✨ Key Features

### 🍽️ Smart Canteen
- **Pre-order System**: Skip the line by ordering meals ahead of time.
- **Live Kitchen Status**: Real-time updates on kitchen availability and ETA.
- **Cart Management**: Seamlessly add/modify items with automatic price calculation.

### 🔧 Maintenance & Reporting
- **Visual Evidence**: Attach photos directly to your maintenance requests.
- **GPS Pinning**: Precise location tracking using high-accuracy coordinates.
- **Status Dashboard**: Track your repair from 'Pending' to 'Resolved' in real-time.

### 🔍 Lost & Found 2.0
- **Dual Mode**: Easily report either lost or found items.
- **Auto-Matching**: Intelligent system that notifies potential finders of matches.
- **Image Uploads**: High-resolution image support for better identification.

### 🗺️ Interactive Campus Map
- **Live Marker System**: Clickable buildings with facility details.
- **Pathfinding**: Dynamic route calculation with distance and time estimates.
- **You-Are-Here**: Real-time student location tracking on a premium map interface.

### 🚌 Transport Hub
- **Live Tracking**: Real-time status of campus buses and shuttles.
- **Journey Planner**: Select stops to see the next available ride and ETA.
- **Capacity Indicators**: Check passenger loads before heading to the stop.

### 🎉 Event Discovery
- **Department Filters**: Stay updated with workshops and fests relevant to you.
- **Instant Registration**: One-tap registration with capacity tracking.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) + [Three.js](https://threejs.org/)
- **Maps**: [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **State/Routing**: [React Router](https://reactrouter.com/)

### Backend
- **Environment**: [Node.js](https://nodejs.org/)
- **Server**: [Express](https://expressjs.com/)
- **Real-time**: [Socket.IO](https://socket.io/)
- **File Handling**: [Multer](https://github.com/expressjs/multer)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/smart-campus-hub.git
   cd smart-campus-hub
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd ../backend
   npm install
   # Create a .env file with PORT=5000
   npm run start
   ```

---

## 📂 Project Structure

```text
Smart Campus Services Hub/
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, ThreeBackground)
│   │   ├── pages/          # Feature-specific pages (Canteen, Map, etc.)
│   │   ├── styles/         # Page-specific CSS modules
│   │   └── App.jsx         # Main router and configuration
├── backend/                # Node.js + Express server
│   ├── uploads/            # Temporary storage for images
│   ├── server.js           # Server entry & Socket logic
│   └── .env                # Configuration variables
└── README.md               # You are here
```

---

## 🎨 Design Philosophy
The application follows a **"Premium Modern Light"** theme characterized by:
- **Glassmorphism**: Translucent panels with background blur effects.
- **Rich Micro-animations**: Hover effects and transitions powered by Framer Motion.
- **Visual Hierarchy**: Logical information flow with high-contrast typography.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Developed with ❤️ for a Smarter Campus Experience.*

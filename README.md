<div align="center">
  <h1>🍽️ FoodQR</h1>
  <p><strong>Digital Menu & Restaurant Management System</strong></p>

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</div>

<br />

**FoodQR** is a full-stack web application designed to streamline modern restaurant experiences. It allows restaurant owners to generate dynamic QR codes for their tables, manage digital menus, handle customer orders, and view analytics all in one place.

## ✨ Key Features

- **📱 Smart QR Code Menus**: Generate unique, scannable QR codes for specific tables (powered by `qrcode.react`).
- **📋 Digital Menu Management**: Create, update, and manage menu items and categories with [ImageKit](https://imagekit.io/) integration for high-quality food visuals.
- **🛒 Dynamic Ordering System**: Guests can easily scan the QR code to browse the menu and place orders directly.
- **📊 Reports & Analytics**: Built-in visual dashboard with interactive charts (using `Recharts`) to track orders and performance.
- **🔐 Secure Access**: JWT and bcrypt powered authentication for restaurant management and staff.

## 🛠️ Tech Stack

### Frontend
- **Core**: React 19, Vite
- **Styling**: Tailwind CSS v4, Framer Motion
- **Data Visualization**: Recharts
- **Components & APIs**: `react-router-dom`, `qrcode.react`, Axios, `Three.js`

### Backend
- **Core**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT), bcrypt/bcryptjs
- **Media**: ImageKit Node.js SDK

## 🚀 Quick Start

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### 1. Setup Backend
```bash
cd server
npm install
```
*Create a `.env` file in the `server` directory and add your MongoDB URI, JWT Secret, ImageKit credentials, and PORT.*
```bash
npm run dev
```

### 2. Setup Frontend
```bash
cd client
npm install
npm run dev
```

The application will launch on your local environment (usually `http://localhost:5173` for the Vite frontend and `http://localhost:PORT` for the Node backend).

## 📁 Project Structure

- `/client` - React frontend UI, components, and pages.
- `/server` - Node.js backend.
  - `/controllers` - Logic for auth, menus, orders, restaurants, tables, etc.
  - `/models` - MongoDB schema definitions.
  - `/routes` - API endpoint definitions.

---

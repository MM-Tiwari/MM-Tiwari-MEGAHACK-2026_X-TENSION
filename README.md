# 💎 SkillSwap - Production-Ready MVP

The ultimate community-driven knowledge exchange platform. Exchange skills, not currency.

## 🏗️ Clean Modular Architecture

### 🛡️ Backend (Node/Express)
- `server.js`: Main entry point & Socket server.
- `routes/`: Organized API endpoints.
- `controllers/`: Decoupled business logic.
- `models/`: Mongoose schemas.
- `middleware/`: Auth protection & error handling.
- `config/`: System-wide configurations.

### 🎨 Frontend (React/Tailwind)
- `src/pages/`: Feature-complete route components.
- `src/components/`: Reusable pixel-perfect UI elements.
- `src/context/`: Global Auth & State provider.
- `src/utils/`: Generic helpers & API managers.

## 🚀 Deployment Guide

### 📂 Database (MongoDB Atlas)
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get the Connection String.
3. Add it to your `.env` as `MONGO_URI`.

### ☁️ Backend (Render)
1. Push your code to GitHub.
2. Connect your repo to [Render](https://render.com/).
3. Set your environment variables (PORT, MONGO_URI, JWT_SECRET).
4. Build Command: `npm install`
5. Start Command: `node server.js`

### ⚡ Frontend (Vercel)
1. Connect your repo to [Vercel](https://vercel.com/).
2. Set Environment Variable: `VITE_API_BASE_URL` (pointing to your Render URL).
3. Deploy!

## 🧪 Local Setup
1. `npm install` in both folders.
2. Start Backend: `node server.js`
3. Start Frontend: `npm run dev`

---
*Developed by Strategy & Engineering.*

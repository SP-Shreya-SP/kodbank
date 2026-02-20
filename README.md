# 🏦 Kodbank - Premium Digital Banking Experience

Kodbank is a sophisticated, full-stack banking application designed with a premium **Glassmorphism** aesthetic. It provides a secure and ultra-modern interface for digital asset management, featuring real-time balance tracking, transaction history, and a personalized digital bank card.

## ✨ Premium Features

- **🚀 Instant Liquidity**: Add or Withdraw funds instantly with real-time balance updates.
- **✨ Quantum Animations**: Interactive "Party Popper" celebrations for balance verifications.
- **💳 Digital Gold Card**: A personalized, floating financial card showing your unique status.
- **📜 Smart Statement**: A comprehensive, color-coded history of all your credits and activities.
- **🔐 Secure Vault**: JWT-powered authentication with HTTP-only cookie security.
- **💎 Glassmorphism UI**: A stunning, semi-transparent design system built with Vanilla CSS.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Axios, Lucide Icons, Canvas-Confetti.
- **Backend**: Node.js, Express, JWT, Bcrypt, Cookie-Parser.
- **Database**: Aiven MySQL (Cloud-hosted).

---

## 🚀 Quick Start Guide

### 1. Database Setup (Aiven MySQL)
1. Create a free MySQL service on [Aiven.io](https://aiven.io/).
2. Copy your **Host**, **Port**, **User**, and **Password**.
3. Configure your credentials in `backend/.env`.

### 2. Initialize the Vault
In the `backend` directory, run the initialization script to set up the professional schema:
```bash
node init-db.js
```

### 3. Launch the Application
Start both the backend and frontend to begin your banking session:

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## ☁️ Vercel Deployment (100% Free)

To deploy Kodbank to the cloud, follow these steps in the [Vercel](https://vercel.com) dashboard:

### 1. Deploy the Backend (API)
1. In Vercel, click **"Add New"** > **"Project"** and import the GitHub repo.
2. **Project Name**: `kodbank-api`
3. **Root Directory**: Select the **`backend`** folder.
4. **Environment Variables**: Add all variables from your `backend/.env` (e.g., `DB_HOST`, `DB_PASS`, `JWT_SECRET`).
5. Set `CLIENT_URL` to your future frontend URL (e.g., `https://kodbank-frontend.vercel.app`).
6. Click **Deploy**.

### 2. Deploy the Frontend (UI)
1. Import the same repo again.
2. **Project Name**: `kodbank-frontend`
3. **Framework Preset**: **Vite**.
4. **Root Directory**: Select the **`frontend`** folder.
5. **Environment Variable**: Add `VITE_API_URL` and paste your deployed **Backend URL**.
6. Click **Deploy**.

---

## 📸 Usage
1. Open `http://localhost:5173`.
2. **Open Account**: Register with your details (UID is generated automatically).
3. **Login**: Access your secure banking portal.
4. **Manage Funds**: Use the "Add Money" or "Withdraw" tabs to manage your balance.
5. **View Card**: Check the "Account Info" tab to see your premium Kodbank Gold card.

---
Developed with ❤️ by **SP-Shreya-SP**

# 🏥 MediVerse.AI

> All healthcare intelligence. One unified AI platform.

MediVerse.AI is a premium, futuristic full-stack healthcare platform powered by AI. It features a stunning dark-themed landing page with glassmorphism UI, Supabase-powered authentication and database, and an intelligent AI chatbot powered by Google Gemini that provides personalized health guidance.

---

## ✨ Features

### 🌐 Landing Page
- Premium dark theme with purple/blue gradient glows
- Glassmorphism cards with hover animations
- Floating medical/AI icons with CSS animations
- Fully responsive (mobile, tablet, desktop)
- Fixed navbar with smooth navigation

### 🔐 Authentication
- Email/password signup & login via Supabase Auth
- Protected dashboard routes
- Session management with auto-redirect

### 🧑‍⚕️ Dashboard
- **Medical Records**: Upload, view, and manage medical files (stored in Supabase Storage)
- **Medications**: Track current medications with dosage, frequency, and schedule
- **AI Chatbot**: ChatGPT-style interface powered by Google Gemini

### 🤖 AI Chatbot
- Powered by Google Gemini (`gemini-2.0-flash`)
- Context-aware: uses your medical records and medications
- Provides helpful, informational health guidance
- Never gives strict medical diagnoses
- Persistent chat history

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | JavaScript (JSX) |
| Styling | Vanilla CSS (glassmorphism, animations) |
| Auth & DB | Supabase (Auth, PostgreSQL, Storage) |
| AI | Google Gemini API |
| Font | Inter (Google Fonts) |
| Deployment | Vercel-ready |

---

## 📁 Project Structure

```
project/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.js              # Root layout
│   │   ├── page.js                # Landing page
│   │   ├── globals.css            # Design system & global styles
│   │   ├── auth/
│   │   │   ├── login/page.js      # Login page
│   │   │   └── signup/page.js     # Signup page
│   │   ├── dashboard/
│   │   │   ├── layout.js          # Dashboard layout (sidebar)
│   │   │   ├── page.js            # Dashboard home
│   │   │   ├── medical-records/page.js
│   │   │   ├── medications/page.js
│   │   │   └── chatbot/page.js    # AI Chatbot
│   │   └── api/
│   │       ├── chat/route.js      # Gemini AI endpoint
│   │       ├── medical-records/route.js
│   │       └── medications/route.js
│   ├── components/               # Reusable UI components
│   └── lib/                      # Supabase & Gemini clients
├── .env.local                    # Environment variables
├── package.json
└── next.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A [Supabase](https://supabase.com) project
- A [Google Gemini API key](https://aistudio.google.com)

### 1. Clone & Install

```bash
cd project
npm install
```

### 2. Configure Environment

Copy `.env.template` to `.env.local` and fill in your credentials:

```bash
cp .env.template .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
```

### 3. Set Up Supabase Database

Run the SQL from `supabase-schema.sql` in your Supabase SQL Editor to create:
- `profiles` table
- `medical_records` table
- `medications` table
- `chat_history` table
- Row Level Security (RLS) policies
- Storage bucket for medical files

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Schema

### Tables

| Table | Description |
|-------|------------|
| `profiles` | Extended user profile (linked to Supabase Auth) |
| `medical_records` | Uploaded medical files metadata |
| `medications` | User medication tracking |
| `chat_history` | AI chatbot conversation history |

### Storage

| Bucket | Description |
|--------|------------|
| `medical-files` | Medical record file uploads |

All tables have **Row Level Security (RLS)** enabled — users can only access their own data.

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#7C3AED` (purple) |
| Secondary | `#3B82F6` (blue) |
| Background | `#000000` |
| Text | `#FFFFFF` |
| Text Secondary | `#A1A1AA` |
| Border Radius | 16px–24px |
| Glass Effect | `backdrop-filter: blur(20px)` |

---

## 🤖 AI Integration

The chatbot sends structured context to Gemini:

```
Medical Records: [user's records]
Current Medications: [user's medications]
User Query: [their question]
```

**Safety rules enforced:**
- ✅ Helpful and informational
- ✅ References user's medical context
- ✅ Recommends consulting professionals
- ❌ Never provides strict diagnoses

---

## 📱 Responsive Design

| Breakpoint | Behavior |
|-----------|----------|
| Desktop (≥1024px) | Full layout, visible sidebar |
| Tablet (768-1023px) | Collapsible sidebar |
| Mobile (<768px) | Hamburger nav, single column |

---

## 📄 License

MIT License — feel free to use and modify.

---

Built with ❤️ by MediVerse.AI

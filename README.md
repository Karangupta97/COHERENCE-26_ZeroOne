<p align="center">
  <h1 align="center">🧬 CuraMatch AI</h1>
  <p align="center">
    <strong>Intelligent Clinical Trial Matching Platform</strong>
  </p>
  <p align="center">
    AI-powered platform that connects eligible patients with clinical trials while preserving privacy — serving Patients, Doctors, and Clinic Administrators.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Cloudflare-R2-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare R2" />
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Matching Algorithm](#matching-algorithm)
- [Deployment](#deployment)

---

## Overview

**CuraMatch AI** is a full-stack clinical trial matching platform that uses AI to intelligently match patients with appropriate clinical trials based on their medical profiles. The platform supports three distinct user roles — **Patients**, **Doctors**, and **Clinic Administrators** — each with dedicated dashboards and workflows.

Key highlights:

- **AI-Powered Matching** — Weighted scoring algorithm evaluates condition, age, biomarkers, and location
- **Medical Document Analysis** — Upload PDFs/images → OCR + Gemini AI extracts structured medical data
- **Privacy-First Design** — Anonymized patient IDs ensure PII-free data sharing between clinics and doctors
- **AI Chatbot** — Patients can ask questions about trials and eligibility via an LLM-powered assistant

---

## Features

### 🏥 Patient Portal
- Browse and search available clinical trials
- View AI-matched trials with compatibility scores
- Upload medical reports (PDF/JPG/PNG) with automatic data extraction
- Apply to trials and track application status
- AI chatbot for trial Q&A and health insights
- Personalized health score dashboard

### 👨‍⚕️ Doctor Portal
- View and manage patient list with anonymized identifiers
- Refer patients to clinical trials with clinical notes
- Add comprehensive clinical details for trial eligibility
- Track enrollment status through the referral workflow
- AI-assisted patient-trial matching insights

### 🏢 Clinic Portal
- Post and manage clinical trials with multi-step forms (Basic Info → Eligibility → Logistics)
- Review matched candidates with compatibility scores
- Enrollment funnel analytics and trend visualizations
- Candidate workflow management (approve → screen → enroll)
- Monthly/weekly enrollment charts and performance metrics

### 🔐 Authentication & Security
- Role-based access control (RBAC) for all endpoints
- JWT-based session management with bcrypt password hashing
- Rate limiting on authentication routes
- Input validation via express-validator
- Security headers via Helmet

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, React Router 7, Vite 7, ApexCharts, Leaflet, Framer Motion |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB Atlas |
| **AI / LLM** | Google Gemini (medical report extraction), Groq + Llama 3.1 8B (chatbot) |
| **OCR** | Tesseract.js (images), pdf-parse (PDFs) |
| **Storage** | Cloudflare R2 (S3-compatible) |
| **Auth** | JWT, bcrypt |
| **Deployment** | Vercel (frontend), DigitalOcean (backend) |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React SPA)              │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐ │
│  │  Patient  │  │  Doctor  │  │  Clinic Dashboard │ │
│  │  Portal   │  │  Portal  │  │     & Analytics   │ │
│  └────┬─────┘  └────┬─────┘  └────────┬──────────┘ │
│       └──────────────┴─────────────────┘            │
│                      │ REST API                     │
└──────────────────────┼──────────────────────────────┘
                       │
┌──────────────────────┼──────────────────────────────┐
│                   Backend (Express.js)              │
│  ┌────────────┐  ┌───────────┐  ┌───────────────┐  │
│  │    Auth     │  │ Matching  │  │   Reports &   │  │
│  │  & RBAC    │  │  Engine   │  │  AI Extraction │  │
│  └────────────┘  └───────────┘  └───────────────┘  │
│  ┌────────────┐  ┌───────────┐  ┌───────────────┐  │
│  │   Trials   │  │Enrollment │  │   AI Chatbot  │  │
│  │   CRUD     │  │ Workflow  │  │  (Groq/Llama) │  │
│  └────────────┘  └───────────┘  └───────────────┘  │
└───────┬──────────────┬──────────────────┬───────────┘
        │              │                  │
   ┌────┴────┐   ┌─────┴──────┐   ┌──────┴───────┐
   │ MongoDB │   │Cloudflare  │   │ Gemini API / │
   │  Atlas  │   │  R2 Storage│   │   Groq API   │
   └─────────┘   └────────────┘   └──────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **yarn**
- **MongoDB Atlas** account (or local MongoDB instance)
- **Cloudflare R2** bucket for file storage
- API keys for **Google Gemini** and **Groq**

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/COHERENCE-26_ZeroOne.git
cd COHERENCE-26_ZeroOne
```

#### Backend

```bash
cd Backend
npm install

# Set up environment variables (see section below)
cp .env.example .env

# Seed sample clinical trials (optional)
npm run seed:clinic

# Start the development server
npm run dev
```

#### Frontend

```bash
cd Frontend
npm install

# Start the development server
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

---

## Environment Variables

Create a `.env` file in the `Backend/` directory:

```env
# ── Database ──────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>

# ── Server ────────────────────────────────────
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# ── Authentication ────────────────────────────
JWT_SECRET=your_jwt_secret_key

# ── AI Services ───────────────────────────────
GROQ_API_KEY=your_groq_api_key
GOOGLE_GENERATIVE_AI_KEY=your_gemini_api_key

# ── Cloudflare R2 Storage ─────────────────────
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY=your_r2_access_key
R2_SECRET_KEY=your_r2_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://your-r2-public-url
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user (patient / doctor / clinic) |
| POST | `/api/auth/login` | Authenticate and receive JWT |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile/me` | Get current user profile |
| PUT | `/api/profile/me` | Update user profile |
| PUT | `/api/profile/change-password` | Change password |

### Trials
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trials/all` | List all available trials |
| POST | `/api/trials` | Create a trial (clinic only) |
| GET | `/api/trials/my` | Get clinic's own trials |
| GET | `/api/trials/:id` | Get trial details |
| PATCH | `/api/trials/:id` | Update a trial |

### Matching
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/matching/my-matches` | Get patient's matched trials with scores |
| GET | `/api/matching/patient/:anonymizedId` | Get matches for a specific patient |

### Enrollment
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/enrollments` | Doctor refers patient to trial |
| POST | `/api/enrollments/apply` | Patient self-applies to a trial |
| GET | `/api/enrollments/my` | Get doctor's referrals |
| GET | `/api/enrollments/my-applications` | Get patient's applications |
| GET | `/api/enrollments/trial/:trialId` | Get enrollments for a trial |
| PATCH | `/api/enrollments/:id/status` | Update enrollment status |

### Medical Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reports/upload` | Upload & AI-extract medical report |
| GET | `/api/reports/my` | Get user's reports |
| GET | `/api/reports/:id` | Get specific report |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Chat with AI assistant (patient only) |

### Clinical Details
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/clinical-details` | Add clinical details |
| GET | `/api/clinical-details` | Retrieve clinical details |

---

## Matching Algorithm

The patient-trial matching engine uses a **weighted scoring system** (max 100 points):

| Criterion | Weight | Description |
|-----------|--------|-------------|
| **Condition Match** | 40 pts | Primary diagnosis alignment with trial requirements |
| **Age Compatibility** | 25 pts | Patient age within trial's eligible range |
| **Biomarker Match** | 20 pts | Lab values (HbA1c, BP, cholesterol) within thresholds |
| **Location Proximity** | 15 pts | Geographic distance to trial site |

Additional rules:
- **Hard exclusions** — Patients matching any exclusion criterion are automatically disqualified
- **Partial credit** — Overlapping symptoms/conditions earn proportional points
- **Anonymization** — All matching uses anonymized patient identifiers

---

## Deployment

### Frontend (Vercel)

The frontend is deployed on **Vercel** with API rewrites configured in `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://your-backend-url/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Backend (DigitalOcean)

The backend is deployed on **DigitalOcean App Platform** with:
- MongoDB Atlas as the managed database
- Cloudflare R2 for file storage
- Environment variables configured in the app settings

---

## Project Structure

```
COHERENCE-26_ZeroOne/
├── Backend/
│   ├── Server.js                  # Express app entry point
│   ├── src/
│   │   ├── config/db.js           # MongoDB connection
│   │   ├── controllers/           # Route handlers
│   │   ├── middlewares/            # Auth, validation, rate limiting
│   │   ├── models/                # Mongoose schemas
│   │   ├── routes/                # API route definitions
│   │   ├── services/              # Matching engine
│   │   ├── utils/                 # Gemini AI, OCR, R2 storage
│   │   └── validators/            # Request validation schemas
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── App.jsx                # Root component & routing
│   │   ├── Auth/                  # Login & signup pages
│   │   ├── components/            # Role-specific UI components
│   │   │   ├── clinic/            # Clinic dashboard charts & tables
│   │   │   ├── doctor/            # Doctor portal components
│   │   │   ├── patient/           # Patient portal components
│   │   │   └── shared/            # Shared components (sidebar, nav)
│   │   ├── hooks/                 # Custom React hooks per role
│   │   ├── pages/                 # Page-level components
│   │   └── theme.jsx              # Multi-theme system (5 themes)
│   └── package.json
└── README.md
```

---

## Trial Categories

The platform supports clinical trials across a wide range of medical specialties:

Endocrinology · Cardiology · Oncology · Neurology · Metabolic · Nephrology · Pulmonology · Rheumatology · Genetic · Rare Disease · Hematology · Immunology · Gastroenterology · Dermatology · Orthopedics

---

## License

This project was built for the **Coherence** hackathon by **Team ZeroOne**.
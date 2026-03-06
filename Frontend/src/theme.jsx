// ============================================================
//  TrialMatchAI — Shared Theme System
//  Share this file with ALL teammates
//  Import: import { useTheme, ThemeProvider, themes } from './theme'
// ============================================================

import { createContext, useContext, useState, useEffect } from "react";

// ─────────────────────────────────────────────
//  ALL 5 THEMES — DARK + LIGHT VARIANTS
// ─────────────────────────────────────────────

export const themes = {

  // ── THEME 1: Clinical White ──────────────────
  clinical: {
    name: "Clinical White",
    icon: "🤍",
    fonts: {
      heading: "'Satoshi', sans-serif",
      body: "'Satoshi', sans-serif",
      mono: "'Roboto Mono', monospace",
    },
    dark: {
      bg: "#0A0F14",
      surface: "#111820",
      card: "#162030",
      border: "#1E2D3D",
      accent: "#0EA5E9",
      accentGlow: "rgba(14,165,233,0.15)",
      green: "#10B981",
      greenGlow: "rgba(16,185,129,0.15)",
      red: "#EF4444",
      yellow: "#F59E0B",
      textPrimary: "#F0F9FF",
      textSecondary: "#7DB3CC",
      shadow: "0 4px 24px rgba(0,0,0,0.4)",
    },
    light: {
      bg: "#F8FAFC",
      surface: "#FFFFFF",
      card: "#F1F5F9",
      border: "#E2E8F0",
      accent: "#0EA5E9",
      accentGlow: "rgba(14,165,233,0.1)",
      green: "#059669",
      greenGlow: "rgba(5,150,105,0.1)",
      red: "#DC2626",
      yellow: "#D97706",
      textPrimary: "#0F172A",
      textSecondary: "#64748B",
      shadow: "0 4px 24px rgba(0,0,0,0.08)",
    },
  },

  // ── THEME 2: Deep Navy ───────────────────────
  navy: {
    name: "Deep Navy",
    icon: "🌊",
    fonts: {
      heading: "'Satoshi', sans-serif",
      body: "'Satoshi', sans-serif",
      mono: "'Roboto Mono', monospace",
    },
    dark: {
      bg: "#020B18",
      surface: "#051628",
      card: "#0A2540",
      border: "#0E3558",
      accent: "#2563EB",
      accentGlow: "rgba(37,99,235,0.2)",
      green: "#059669",
      greenGlow: "rgba(5,150,105,0.15)",
      red: "#DC2626",
      yellow: "#D97706",
      textPrimary: "#F0F9FF",
      textSecondary: "#7DB3D4",
      shadow: "0 4px 32px rgba(0,0,0,0.5)",
    },
    light: {
      bg: "#EFF6FF",
      surface: "#FFFFFF",
      card: "#DBEAFE",
      border: "#BFDBFE",
      accent: "#1D4ED8",
      accentGlow: "rgba(29,78,216,0.1)",
      green: "#047857",
      greenGlow: "rgba(4,120,87,0.1)",
      red: "#B91C1C",
      yellow: "#B45309",
      textPrimary: "#1E3A5F",
      textSecondary: "#3B6EA5",
      shadow: "0 4px 24px rgba(30,58,95,0.1)",
    },
  },

  // ── THEME 3: Forest Bio ──────────────────────
  forest: {
    name: "Forest Bio",
    icon: "🌿",
    fonts: {
      heading: "'Satoshi', sans-serif",
      body: "'Satoshi', sans-serif",
      mono: "'Roboto Mono', monospace",
    },
    dark: {
      bg: "#0D1F1A",
      surface: "#132920",
      card: "#1A3A2E",
      border: "#1F4A3A",
      accent: "#34D399",
      accentGlow: "rgba(52,211,153,0.15)",
      green: "#6EE7B7",
      greenGlow: "rgba(110,231,183,0.15)",
      red: "#F87171",
      yellow: "#FCD34D",
      textPrimary: "#ECFDF5",
      textSecondary: "#6EE7B7",
      shadow: "0 4px 24px rgba(0,0,0,0.4)",
    },
    light: {
      bg: "#F0FDF4",
      surface: "#FFFFFF",
      card: "#DCFCE7",
      border: "#BBF7D0",
      accent: "#059669",
      accentGlow: "rgba(5,150,105,0.1)",
      green: "#047857",
      greenGlow: "rgba(4,120,87,0.1)",
      red: "#DC2626",
      yellow: "#CA8A04",
      textPrimary: "#052E16",
      textSecondary: "#166534",
      shadow: "0 4px 24px rgba(5,46,22,0.08)",
    },
  },

  // ── THEME 4: Slate Pro ───────────────────────
  slate: {
    name: "Slate Pro",
    icon: "🩶",
    fonts: {
      heading: "'Satoshi', sans-serif",
      body: "'Satoshi', sans-serif",
      mono: "'Roboto Mono', monospace",
    },
    dark: {
      bg: "#0F1117",
      surface: "#16181F",
      card: "#1C1F2A",
      border: "#2A2D3A",
      accent: "#6366F1",
      accentGlow: "rgba(99,102,241,0.15)",
      green: "#22C55E",
      greenGlow: "rgba(34,197,94,0.15)",
      red: "#EF4444",
      yellow: "#EAB308",
      textPrimary: "#F9FAFB",
      textSecondary: "#9CA3AF",
      shadow: "0 4px 24px rgba(0,0,0,0.4)",
    },
    light: {
      bg: "#F9FAFB",
      surface: "#FFFFFF",
      card: "#F3F4F6",
      border: "#E5E7EB",
      accent: "#4F46E5",
      accentGlow: "rgba(79,70,229,0.1)",
      green: "#16A34A",
      greenGlow: "rgba(22,163,74,0.1)",
      red: "#DC2626",
      yellow: "#CA8A04",
      textPrimary: "#111827",
      textSecondary: "#6B7280",
      shadow: "0 4px 24px rgba(0,0,0,0.06)",
    },
  },

  // ── THEME 5: Aurora Medical ──────────────────
  aurora: {
    name: "Aurora Medical",
    icon: "🔵",
    fonts: {
      heading: "'Satoshi', sans-serif",
      body: "'Satoshi', sans-serif",
      mono: "'Roboto Mono', monospace",
    },
    dark: {
      bg: "#04051A",
      surface: "#080C2A",
      card: "#0D1235",
      border: "#151C45",
      accent: "#818CF8",
      accentGlow: "rgba(129,140,248,0.15)",
      green: "#34D399",
      greenGlow: "rgba(52,211,153,0.15)",
      red: "#FB7185",
      yellow: "#FDE68A",
      textPrimary: "#EEF2FF",
      textSecondary: "#818CF8",
      shadow: "0 4px 32px rgba(0,0,0,0.5)",
    },
    light: {
      bg: "#EEF2FF",
      surface: "#FFFFFF",
      card: "#E0E7FF",
      border: "#C7D2FE",
      accent: "#4F46E5",
      accentGlow: "rgba(79,70,229,0.1)",
      green: "#059669",
      greenGlow: "rgba(5,150,105,0.1)",
      red: "#E11D48",
      yellow: "#D97706",
      textPrimary: "#1E1B4B",
      textSecondary: "#4338CA",
      shadow: "0 4px 24px rgba(30,27,75,0.08)",
    },
  },
};

// ─────────────────────────────────────────────
//  GOOGLE FONTS IMPORT STRING
//  Paste this in your index.html <head>
// ─────────────────────────────────────────────

export const GOOGLE_FONTS_URL =
  "https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap";

// ─────────────────────────────────────────────
//  SHARED SPACING & RADIUS TOKENS
//  Use these everywhere — never hardcode values
// ─────────────────────────────────────────────

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px",
};

export const radius = {
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "20px",
  full: "9999px",
};

export const fontSize = {
  xs: "11px",
  sm: "13px",
  base: "15px",
  lg: "18px",
  xl: "22px",
  xxl: "28px",
  hero: "48px",
};

// ─────────────────────────────────────────────
//  THEME CONTEXT — wrap your App with this
// ─────────────────────────────────────────────

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeKey, setThemeKey] = useState("aurora");
  const [mode, setMode] = useState("dark"); // "dark" | "light"

  // Persist to localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("trialMatchTheme");
    const savedMode = localStorage.getItem("trialMatchMode");
    if (savedTheme && themes[savedTheme]) setThemeKey(savedTheme);
    if (savedMode) setMode(savedMode);
  }, []);

  const switchTheme = (key) => {
    setThemeKey(key);
    localStorage.setItem("trialMatchTheme", key);
  };

  const toggleMode = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    localStorage.setItem("trialMatchMode", next);
  };

  const theme = themes[themeKey];
  const colors = theme[mode];
  const fonts = theme.fonts;

  return (
    <ThemeContext.Provider value={{ colors, fonts, mode, themeKey, switchTheme, toggleMode, themes, spacing, radius, fontSize }}>
      <div style={{
        background: colors.bg,
        color: colors.textPrimary,
        fontFamily: fonts.body,
        minHeight: "100vh",
        width: "100%",
        transition: "background 0.3s ease, color 0.3s ease",
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// ─────────────────────────────────────────────
//  useTheme HOOK — use anywhere in your app
//  const { colors, fonts, mode, toggleMode } = useTheme()
// ─────────────────────────────────────────────

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

// ─────────────────────────────────────────────
//  THEME SWITCHER COMPONENT
//  Drop this anywhere in your navbar
//  <ThemeSwitcher />
// ─────────────────────────────────────────────

export function ThemeSwitcher() {
  const { colors, fonts, mode, toggleMode } = useTheme();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {/* Dark/Light toggle */}
      <button
        onClick={toggleMode}
        title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
        style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: radius.full,
          padding: "5px 12px",
          cursor: "pointer",
          color: colors.textSecondary,
          fontFamily: fonts.mono,
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          transition: "all 0.2s ease",
        }}
      >
        {mode === "dark" ? "☀️ Light" : "🌙 Dark"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
//  SHARED MOCK DATA
//  Import this in ALL portals — never duplicate
// ─────────────────────────────────────────────

export const PATIENTS = [
  { id: "PT-0041", anonymizedId: "ANON-7F3A2B1C", age: 52, gender: "F", diagnosis: "Type 2 Diabetes", meds: "Metformin 500mg", location: "Mumbai", hba1c: "8.2%", bmi: "28.4", matches: 3, status: "awaiting" },
  { id: "PT-0039", anonymizedId: "ANON-4D8E9C2F", age: 38, gender: "M", diagnosis: "Hypertension Stage 2", meds: "Lisinopril 10mg", location: "Pune", hba1c: "N/A", bmi: "26.1", matches: 1, status: "referred" },
  { id: "PT-0037", anonymizedId: "ANON-1B5C8D3E", age: 61, gender: "F", diagnosis: "Stage 2 Breast Cancer", meds: "Tamoxifen 20mg", location: "Mumbai", hba1c: "N/A", bmi: "24.8", matches: 2, status: "enrolled" },
  { id: "PT-0035", anonymizedId: "ANON-6A2F4E7B", age: 45, gender: "M", diagnosis: "Type 2 Diabetes", meds: "Metformin 1000mg", location: "Thane", hba1c: "9.1%", bmi: "31.2", matches: 2, status: "awaiting" },
  { id: "PT-0033", anonymizedId: "ANON-9C1D3F8A", age: 55, gender: "F", diagnosis: "Hypertension + Diabetes", meds: "Amlodipine 5mg", location: "Mumbai", hba1c: "7.8%", bmi: "27.9", matches: 4, status: "screening" },
  { id: "PT-0031", anonymizedId: "ANON-2E7B5A4D", age: 49, gender: "M", diagnosis: "Chronic Kidney Disease", meds: "Losartan 50mg", location: "Nashik", hba1c: "N/A", bmi: "25.3", matches: 1, status: "referred" },
];

export const TRIALS = [
  { id: "T-001", name: "GLYCO-ADVANCE", phase: "Phase III", sponsor: "Novo Nordisk", category: "Endocrinology", location: "Mumbai", distance: "4.2km", score: 94, status: "Recruiting", slots: 12, compensation: "₹5,000/visit" },
  { id: "T-002", name: "CARDIO-PROTECT", phase: "Phase II", sponsor: "AstraZeneca", category: "Cardiology", location: "Pune", distance: "148km", score: 81, status: "Recruiting", slots: 6, compensation: "₹3,500/visit" },
  { id: "T-003", name: "META-RESET", phase: "Phase II", sponsor: "Sun Pharma", category: "Metabolic", location: "Navi Mumbai", distance: "22km", score: 73, status: "Enrolling Soon", slots: 20, compensation: "₹2,000/visit" },
  { id: "T-004", name: "NEURO-SHIELD", phase: "Phase I", sponsor: "Cipla Research", category: "Neurology", location: "Mumbai", distance: "11km", score: 68, status: "Recruiting", slots: 8, compensation: "₹4,000/visit" },
  { id: "T-005", name: "ONCO-TARGET", phase: "Phase III", sponsor: "Tata Memorial", category: "Oncology", location: "Mumbai", distance: "6.5km", score: 88, status: "Recruiting", slots: 3, compensation: "₹6,000/visit" },
];

export const STATUS_FLOW = [
  "Data Uploaded",
  "AI Matched",
  "Doctor Reviewing",
  "Doctor Approved",
  "Clinic Accepted",
  "Screening",
  "Enrolled",
  "Trial Active",
];

export const ROUTES = {
  LOGIN: "/login",
  DOCTOR_DASHBOARD: "/doctor/dashboard",
  DOCTOR_PATIENTS: "/doctor/patients",
  DOCTOR_PATIENT_ID: "/doctor/patients/:id",
  DOCTOR_CHAT: "/doctor/chat/:patientId",
  DOCTOR_ALERTS: "/doctor/alerts",
  PATIENT_DASHBOARD: "/patient/dashboard",
  PATIENT_UPLOAD: "/patient/upload",
  PATIENT_TRIALS: "/patient/trials",
  PATIENT_PROGRESS: "/patient/progress",
  PATIENT_CHAT: "/patient/chat",
  CLINIC_DASHBOARD: "/clinic/dashboard",
  CLINIC_POST_TRIAL: "/clinic/post-trial",
  CLINIC_CANDIDATES: "/clinic/candidates",
  CLINIC_ANALYTICS: "/clinic/analytics",
};

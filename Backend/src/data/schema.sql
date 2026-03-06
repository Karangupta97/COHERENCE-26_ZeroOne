-- ============================================================
-- Supabase SQL: Role-Based Auth Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Users table (stores credentials & role)
CREATE TABLE IF NOT EXISTS public.users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'clinic')),
  full_name     TEXT NOT NULL,
  phone         TEXT,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- 2. Profile tables per role (extend as needed)

CREATE TABLE IF NOT EXISTS public.patient_profiles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date_of_birth DATE,
  gender        TEXT,
  blood_group   TEXT,
  address       TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.doctor_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  specialization  TEXT,
  license_number  TEXT,
  experience_years INTEGER,
  clinic_id       UUID REFERENCES public.users(id),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.clinic_profiles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  clinic_name   TEXT NOT NULL,
  address       TEXT,
  license_number TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- 3. Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_profiles ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access (our backend uses service_role key)
CREATE POLICY "Service role full access on users"
  ON public.users FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on patient_profiles"
  ON public.patient_profiles FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on doctor_profiles"
  ON public.doctor_profiles FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on clinic_profiles"
  ON public.clinic_profiles FOR ALL
  USING (true) WITH CHECK (true);

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_patient_profiles_user_id ON public.patient_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_doctor_profiles_user_id ON public.doctor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_clinic_profiles_user_id ON public.clinic_profiles(user_id);

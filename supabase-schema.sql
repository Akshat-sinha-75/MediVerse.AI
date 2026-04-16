-- ===========================
-- MediVerse.AI Database Schema v2
-- Run this in your Supabase SQL Editor
-- ===========================

-- Drop old tables if re-running (CAREFUL in production!)
-- DROP TABLE IF EXISTS public.chat_history CASCADE;
-- DROP TABLE IF EXISTS public.medications CASCADE;
-- DROP TABLE IF EXISTS public.medical_records CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- Profiles (extends Supabase Auth users) — with medical vitals
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  phone TEXT,
  blood_group TEXT CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', NULL)),
  height_cm NUMERIC,
  weight_kg NUMERIC,
  allergies TEXT,
  chronic_conditions TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  profile_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medical Records
CREATE TABLE IF NOT EXISTS public.medical_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  description TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medications
CREATE TABLE IF NOT EXISTS public.medications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  time_of_day TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat History
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================
-- Row Level Security
-- ===========================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Medical Records policies
CREATE POLICY "Users can view own records" ON public.medical_records
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own records" ON public.medical_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own records" ON public.medical_records
  FOR DELETE USING (auth.uid() = user_id);

-- Medications policies
CREATE POLICY "Users can view own medications" ON public.medications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own medications" ON public.medications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own medications" ON public.medications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own medications" ON public.medications
  FOR DELETE USING (auth.uid() = user_id);

-- Chat History policies
CREATE POLICY "Users can view own chat" ON public.chat_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat" ON public.chat_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ===========================
-- Storage Bucket
-- ===========================
-- Create a bucket named 'medical-files' in Supabase Dashboard > Storage
-- Set policies: users can upload/read/delete in their own folder ({user_id}/*)

-- ===========================
-- Auto-create profile on signup (trigger)
-- ===========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================
-- Migration SQL (if updating from v1)
-- Run these ALTER statements if you already have the profiles table
-- ===========================
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS blood_group TEXT;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS height_cm NUMERIC;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS weight_kg NUMERIC;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS allergies TEXT;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS chronic_conditions TEXT;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;

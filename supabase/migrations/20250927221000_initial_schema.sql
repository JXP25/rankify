-- 1. CREATE CUSTOM ENUM TYPES

-- Create a custom type for user roles to ensure data integrity.
CREATE TYPE public.role AS ENUM ('CANDIDATE', 'REVIEWER');

-- Create a custom type for resume statuses.
CREATE TYPE public.resume_status AS ENUM ('PENDING', 'APPROVED', 'NEEDS_REVISION', 'REJECTED');


-- 2. CREATE TABLES

-- Create the profiles table to store public user data.
-- This table is linked one-to-one with the auth.users table.
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    full_name TEXT,
    role public.role NOT NULL DEFAULT 'CANDIDATE'::role
);
COMMENT ON TABLE public.profiles IS 'Public profile information for each user, linked to auth.users.';

-- Create the resumes table to manage submissions.
CREATE TABLE public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    status public.resume_status NOT NULL DEFAULT 'PENDING'::resume_status,
    notes TEXT,
    score INT4,
    reviewed_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.resumes IS 'Stores information and status for each resume submission.';


-- 3. ENABLE ROW-LEVEL SECURITY (RLS)
-- Enable RLS on both tables to protect user data.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;


-- 4. CREATE RLS POLICIES FOR 'profiles' TABLE
CREATE POLICY "Users can view their own profile."
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile."
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);


-- 5. CREATE RLS POLICIES FOR 'resumes' TABLE
CREATE POLICY "Users can view their own resumes."
ON public.resumes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resume."
ON public.resumes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view and update all resumes."
ON public.resumes FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'REVIEWER'::role
) WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'REVIEWER'::role
);


-- 6. SET UP STORAGE BUCKET

-- Insert the 'resumes' bucket into storage.
-- This makes the bucket private by default.
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false);

-- 7. CREATE STORAGE POLICIES
-- Policy: Allow authenticated users to upload files to the 'resumes' bucket.
CREATE POLICY "Authenticated users can upload resumes."
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resumes');

-- Policy: Allow users to view their own uploaded resumes.
-- This policy relies on the file path being in the format: {user_id}/{file_name}.
-- Your frontend code must enforce this structure when uploading.
CREATE POLICY "Users can view their own resumes."
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow admins to view any resume.
CREATE POLICY "Admins can view all resumes."
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'REVIEWER'::role
);

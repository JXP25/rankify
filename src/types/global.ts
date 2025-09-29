// Global types matching the database schema
// These are the main types used across the application

export type Role = "CANDIDATE" | "REVIEWER";

export type ResumeStatus =
  | "PENDING"
  | "APPROVED"
  | "NEEDS_REVISION"
  | "REJECTED";

export type AuthProvider = "email" | "google";

export type LoginMethod = "oauth" | "email";

export interface Profile {
  id: string;
  created_at?: string;
  full_name?: string | null;
  role: Role;
}

export interface Resume {
  id: string;
  user_id: string;
  name: string;
  storage_path: string;
  status: ResumeStatus;
  notes?: string | null;
  score?: number | null;
  reviewed_by?: string | null;
  created_at: string;
  updated_at: string;
}

// Auth user type matching Supabase auth.users table
export interface AuthUser {
  id: string;
  email: string;
  phone?: string;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
}

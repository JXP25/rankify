"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Role } from "@/types/global";

export default function Onboarding() {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<Role>("CANDIDATE");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      // Insert profile
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        full_name: fullName || null,
        role,
      });

      if (insertError) throw insertError;

      // Redirect to appropriate dashboard
      if (role === "CANDIDATE") {
        router.push("/candidate/dashboard");
      } else {
        router.push("/reviewer/dashboard");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create profile";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Complete Your Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="CANDIDATE"
                  checked={role === "CANDIDATE"}
                  onChange={() => setRole("CANDIDATE")}
                  className="mr-2"
                />
                <span>Candidate</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="REVIEWER"
                  checked={role === "REVIEWER"}
                  onChange={() => setRole("REVIEWER")}
                  className="mr-2"
                />
                <span>Reviewer</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Creating Profile..." : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

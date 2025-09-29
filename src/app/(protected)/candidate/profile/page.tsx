"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, Edit2, Save, X, Mail } from "lucide-react";
import { redirect } from "next/navigation";
import { Profile, AuthUser } from "@/types/global";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
  });

  const supabase = createClient();

  const [loginMethod, setLoginMethod] = useState<string>("");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          redirect("/auth/login");
          return;
        }

        // Get user auth data
        setAuthUser({
          id: user.id,
          email: user.email || "",
          phone: user.phone || undefined,
          email_verified: user.email_confirmed_at ? true : false,
          phone_verified: user.phone_confirmed_at ? true : false,
          created_at: user.created_at,
          updated_at: user.updated_at || user.created_at,
          last_sign_in_at: user.last_sign_in_at || undefined,
        });

        // Set login method
        const provider = user.app_metadata?.provider || "email";
        setLoginMethod(provider.charAt(0).toUpperCase() + provider.slice(1));

        // Get profile data from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error loading profile:", profileError);
        } else {
          setProfile(profileData);
          setEditForm({
            full_name: profileData.full_name || "",
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [supabase]);

  const handleSave = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      // Update profile in database
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: editForm.full_name || null,
        })
        .eq("id", profile.id);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        return;
      }

      // Update local state
      setProfile((prev) =>
        prev ? { ...prev, full_name: editForm.full_name || null } : null,
      );

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || "",
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile || !authUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading profile data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">
          Manage your profile information and view account details
        </p>
      </div>

      {/* Profile Details - Editable */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Details
              </CardTitle>
            </div>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="full_name"
                  value={editForm.full_name}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      full_name: e.target.value,
                    }))
                  }
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  {profile.full_name || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <Label>Role</Label>
              <div className="mt-1 flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    profile.role === "CANDIDATE"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {profile.role}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Details - Read Only */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-sm text-gray-900">{authUser.email}</p>
                {authUser.email_verified ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Verified
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Unverified
                  </span>
                )}
              </div>
            </div>

            <div>
              <Label>Phone Number</Label>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-sm text-gray-900">
                  {authUser.phone || "Not provided"}
                </p>
                {authUser.phone &&
                  (authUser.phone_verified ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Verified
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Unverified
                    </span>
                  ))}
              </div>
            </div>

            <div>
              <Label>Login Method</Label>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-sm text-gray-900">{loginMethod}</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    loginMethod === "Google"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {loginMethod === "Google" ? "OAuth" : "Email/Password"}
                </span>
              </div>
            </div>

            <div>
              <Label>Account Created</Label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(authUser.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div>
              <Label>Last Sign In</Label>
              <p className="mt-1 text-sm text-gray-900">
                {authUser.last_sign_in_at
                  ? new Date(authUser.last_sign_in_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )
                  : "Never"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

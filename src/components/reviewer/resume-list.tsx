"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calendar, Star, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Resume } from "@/types/global";

interface ResumeWithProfile extends Resume {
  profiles?: {
    full_name: string | null;
  };
}

interface ReviewerResumeListProps {
  onSelectResume: (resume: ResumeWithProfile) => void;
  selectedResumeId?: string;
}

export const ReviewerResumeList = ({
  onSelectResume,
  selectedResumeId,
}: ReviewerResumeListProps) => {
  const [resumes, setResumes] = useState<ResumeWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const supabase = createClient();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data, error } = await supabase
          .from("resumes")
          .select(
            `
            *,
            profiles!resumes_user_id_fkey (
              full_name
            )
          `,
          )
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching resumes:", error);
        } else {
          setResumes(data || []);
        }
      } catch (error) {
        console.error("Error fetching resumes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();

    // Set up realtime subscription
    const channel = supabase
      .channel("reviewer-resumes-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "resumes",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            // Fetch the new resume with profile data
            supabase
              .from("resumes")
              .select(
                `
                *,
                profiles!resumes_user_id_fkey (
                  full_name
                )
              `,
              )
              .eq("id", payload.new.id)
              .single()
              .then(({ data }) => {
                if (data) {
                  setResumes((prev) => [data, ...prev]);
                }
              });
          } else if (payload.eventType === "UPDATE") {
            // Show loading state for this specific resume
            setUpdatingIds((prev) => new Set(prev).add(payload.new.id));

            // Fetch the updated resume with profile data to ensure we have complete info
            const fetchUpdatedResume = async () => {
              try {
                const { data, error } = await supabase
                  .from("resumes")
                  .select(
                    `
                    *,
                    profiles!resumes_user_id_fkey (
                      full_name
                    )
                  `,
                  )
                  .eq("id", payload.new.id)
                  .single();

                if (error) throw error;

                if (data) {
                  setResumes((prev) =>
                    prev.map((resume) =>
                      resume.id === payload.new.id ? data : resume,
                    ),
                  );
                }
              } catch (error) {
                console.error("Error fetching updated resume:", error);
                // Fallback to basic update if fetch fails
                setResumes((prev) =>
                  prev.map((resume) =>
                    resume.id === payload.new.id
                      ? { ...resume, ...payload.new }
                      : resume,
                  ),
                );
              } finally {
                // Remove loading state for this resume
                setUpdatingIds((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(payload.new.id);
                  return newSet;
                });
              }
            };

            fetchUpdatedResume();
          } else if (payload.eventType === "DELETE") {
            setResumes((prev) =>
              prev.filter((resume) => resume.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Resume Reviews</h2>
        <p className="text-sm text-gray-600">
          Click on a resume to review and provide feedback
        </p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
              <p className="mt-4 text-sm text-gray-500">Loading resumes...</p>
            </div>
          </CardContent>
        </Card>
      ) : resumes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                No resumes to review
              </h3>
              <p className="text-sm text-gray-500">
                New resume submissions will appear here for review.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {resumes.map((resume) => {
            const isUpdating = updatingIds.has(resume.id);
            return (
              <Card
                key={resume.id}
                className={`cursor-pointer transition-all duration-200 hover:bg-gray-100 bg-gray-50 ${
                  selectedResumeId === resume.id
                    ? "border-2 border-blue-500 bg-blue-50/30"
                    : "border border-gray-200"
                } ${isUpdating ? "opacity-70" : ""}`}
                onClick={() => onSelectResume(resume)}
              >
                <CardContent className="pt-6">
                  {isUpdating && (
                    <div className="absolute top-2 right-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <FileText className="h-8 w-8 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {resume.profiles?.full_name || "Unknown User"}
                          </span>
                        </div>
                        <h3 className="text-sm text-gray-700 truncate">
                          {resume.storage_path
                            .split("/")
                            .pop()
                            ?.replace(/^\d+_/, "") || "Resume"}
                        </h3>
                        <div className="flex items-center mt-1 space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(resume.created_at).toLocaleDateString()}
                          </div>
                          {resume.score !== null && (
                            <div className="flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              {resume.score}/100
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          resume.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : resume.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : resume.status === "NEEDS_REVISION"
                                ? "bg-orange-100 text-orange-800"
                                : resume.status === "REJECTED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {resume.status === "NEEDS_REVISION"
                          ? "NEEDS REVISION"
                          : resume.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

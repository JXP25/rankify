"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calendar, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Resume } from "@/types/global";

interface CandidateResumeListProps {
  onSelectResume?: (resume: Resume) => void;
  selectedResumeId?: string;
}

export const CandidateResumeList = ({
  onSelectResume,
  selectedResumeId,
}: CandidateResumeListProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const handleViewResume = async (resume: Resume) => {
    const { data, error } = await supabase.storage
      .from("resumes")
      .createSignedUrl(resume.storage_path, 3600); // 1 hour expiry

    if (error) {
      console.error("Error creating signed URL:", error);
      return;
    }

    window.open(data.signedUrl, "_blank");
  };

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, [supabase.auth]);

  useEffect(() => {
    const fetchResumes = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from("resumes")
          .select("*")
          .eq("user_id", userId)
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

    if (userId) {
      const channel = supabase
        .channel("resumes-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "resumes",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setResumes((prev) => [payload.new as Resume, ...prev]);
            } else if (payload.eventType === "UPDATE") {
              setResumes((prev) =>
                prev.map((resume) =>
                  resume.id === payload.new.id
                    ? (payload.new as Resume)
                    : resume,
                ),
              );
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
    }
  }, [userId, supabase]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Your Resume History
        </h2>
        <p className="text-sm text-gray-600">
          Track your uploaded resumes and their review status
        </p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
              <p className="mt-4 text-sm text-gray-500">
                Loading your resumes...
              </p>
            </div>
          </CardContent>
        </Card>
      ) : resumes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                No resumes uploaded yet
              </h3>
              <p className="text-sm text-gray-500">
                Upload your first resume to get started with the review process.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {resumes.map((resume) => (
            <Card
              key={resume.id}
              className={`cursor-pointer transition-all duration-200 hover:bg-gray-100 bg-gray-50 ${
                selectedResumeId === resume.id
                  ? "border-2 border-blue-500 bg-blue-50/30"
                  : "border border-gray-200"
              }`}
              onClick={() => onSelectResume?.(resume)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewResume(resume);
                      }}
                      className="flex-shrink-0 p-1 hover:bg-blue-100 rounded transition-colors"
                      title="View Resume"
                    >
                      <FileText className="h-8 w-8 text-blue-500" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {resume.name}
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
                      {resume.notes && (
                        <p className="mt-2 text-sm text-gray-600">
                          {resume.notes}
                        </p>
                      )}
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
          ))}
        </div>
      )}
    </div>
  );
};

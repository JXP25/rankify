"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Save, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { Resume, ResumeStatus } from "@/types/global";

interface ResumeWithProfile extends Resume {
  profiles?: {
    full_name: string | null;
  };
}

interface ResumeReviewProps {
  resume: ResumeWithProfile;
  onReviewUpdated: (updatedResume: ResumeWithProfile) => void;
}

export const ResumeReview = ({
  resume,
  onReviewUpdated,
}: ResumeReviewProps) => {
  const [score, setScore] = useState<string>(resume.score?.toString() || "");
  const [notes, setNotes] = useState(resume.notes || "");
  const [status, setStatus] = useState(resume.status);
  const [saving, setSaving] = useState(false);
  const [reviewerId, setReviewerId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getReviewer = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setReviewerId(user.id);
      }
    };
    getReviewer();
  }, [supabase]);

  useEffect(() => {
    setScore(resume.score?.toString() || "");
    setNotes(resume.notes || "");
    setStatus(resume.status);
  }, [resume]);

  const handleSave = async () => {
    if (!reviewerId) return;

    setSaving(true);
    try {
      const scoreValue = score ? parseInt(score) : null;

      // Validate score
      if (scoreValue !== null && (scoreValue < 0 || scoreValue > 100)) {
        alert("Score must be between 0 and 100");
        setSaving(false);
        return;
      }

      const { data, error } = await supabase
        .from("resumes")
        .update({
          score: scoreValue,
          notes: notes || null,
          status,
          reviewed_by: reviewerId,
        })
        .eq("id", resume.id)
        .select(
          `
          *,
          profiles!resumes_user_id_fkey (
            full_name
          )
        `,
        )
        .single();

      if (error) {
        console.error("Error updating resume:", error);
        alert("Failed to save review");
      } else if (data) {
        onReviewUpdated(data);
        alert("Review saved successfully!");
      }
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Failed to save review");
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("resumes")
        .download(resume.storage_path);

      if (error) {
        console.error("Error downloading file:", error);
        alert("Failed to download resume");
        return;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = resume.storage_path.split("/").pop() || "resume.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading resume:", error);
      alert("Failed to download resume");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Review Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resume Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">
              {resume.profiles?.full_name || "Unknown User"}
            </h3>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            {resume.storage_path.split("/").pop()?.replace(/^\d+_/, "") ||
              "Resume"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Submitted: {new Date(resume.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Review Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="score">Score (0-100)</Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="Enter score"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value: string) =>
                  setStatus(value as ResumeStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="NEEDS_REVISION">Needs Revision</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Review Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your feedback and comments..."
              rows={4}
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Review"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

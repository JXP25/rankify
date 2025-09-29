"use client";

import { useState } from "react";
import { ReviewerResumeList } from "@/components/reviewer/resume-list";
import { ResumeReview } from "@/components/reviewer/resume-review";
import { Resume } from "@/types/global";

interface ResumeWithProfile extends Resume {
  profiles?: {
    full_name: string | null;
  };
}

export default function Dashboard() {
  const [selectedResume, setSelectedResume] =
    useState<ResumeWithProfile | null>(null);

  const handleResumeSelect = (resume: ResumeWithProfile) => {
    setSelectedResume(resume);
  };

  const handleReviewUpdated = (updatedResume: ResumeWithProfile) => {
    setSelectedResume(updatedResume);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left half - Resume List */}
        <div className="order-1">
          <ReviewerResumeList
            onSelectResume={handleResumeSelect}
            selectedResumeId={selectedResume?.id}
          />
        </div>

        {/* Right half - Resume Review */}
        <div className="order-2">
          {selectedResume ? (
            <ResumeReview
              resume={selectedResume}
              onReviewUpdated={handleReviewUpdated}
            />
          ) : (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">
                Select a resume to start reviewing
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

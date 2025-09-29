"use client";

import { useState } from "react";
import { ResumeUploadSection } from "@/components/uploads/resume-upload-section";
import { CandidateResumeList } from "@/components/candidate/resume-list";
import { PDFPreview } from "@/components/reviewer/pdf-preview";
import { FilePreview } from "@/components/candidate/file-preview";
import { Resume } from "@/types/global";

export const CandidateDashboardLayout = () => {
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const handleResumeSelect = (resume: Resume) => {
    setPreviewFile(null);
    setSelectedResume(resume);
  };

  const handleFilePreview = (file: File | null) => {
    setSelectedResume(null);
    setPreviewFile(file);
  };

  return (
    <div className="max-w-[95rem] mx-auto px-4 py-8">
      <div
        className={`grid gap-8 ${
          selectedResume || previewFile
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-1"
        }`}
      >
        {/* Left side - Upload + Resume List */}
        <div className="order-1 space-y-8">
          <ResumeUploadSection onFilePreview={handleFilePreview} />
          <CandidateResumeList
            onSelectResume={handleResumeSelect}
            selectedResumeId={selectedResume?.id}
          />
        </div>

        {/* Right side - PDF Preview */}
        {(selectedResume || previewFile) && (
          <div className="order-2">
            {selectedResume ? (
              <PDFPreview
                storagePath={selectedResume.storage_path}
                fileName={selectedResume.name}
                submittedDate={new Date(
                  selectedResume.created_at,
                ).toLocaleDateString()}
              />
            ) : previewFile ? (
              <FilePreview file={previewFile} fileName={previewFile.name} />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

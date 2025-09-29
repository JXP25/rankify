"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Maximize2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilePreviewProps {
  file: File;
  fileName: string;
}

export const FilePreview = ({ file, fileName }: FilePreviewProps) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (file && file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setLoading(false);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setError("Only PDF files are supported");
      setLoading(false);
    }
  }, [file]);

  const openInNewTab = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  const openFullscreen = () => {
    const iframe = document.getElementById(
      "file-preview-iframe",
    ) as HTMLIFrameElement;
    if (iframe && iframe.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2 text-gray-600">Loading PDF...</span>
      </div>
    );
  }

  if (error || !fileUrl) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <span className="text-red-600">{error || "Failed to load PDF"}</span>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
      {/* Header with controls */}
      <div className="flex items-center justify-between p-3 bg-blue-50 border-b">
        <div className="flex items-center space-x-2">
          <Upload className="h-4 w-4 text-blue-600" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">{fileName}</h3>
            <p className="text-xs text-blue-600">Preview - Ready to upload</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={openFullscreen}
            title="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={openInNewTab}
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF iframe */}
      <div className="relative bg-gray-100">
        <iframe
          id="file-preview-iframe"
          src={fileUrl}
          className="w-full h-[700px] border-0"
          title="File Preview"
          loading="lazy"
        />
        <div className="absolute inset-0 pointer-events-none border border-gray-200/50 rounded-b-lg" />
      </div>
    </div>
  );
};

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ExternalLink, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFPreviewProps {
  storagePath: string;
  fileName: string;
  submittedDate: string;
}

export const PDFPreview = ({
  storagePath,
  fileName,
  submittedDate,
}: PDFPreviewProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const { data, error } = await supabase.storage
          .from("resumes")
          .createSignedUrl(storagePath, 3600);

        if (error) {
          setError("Failed to load PDF");
          return;
        }

        setPdfUrl(data.signedUrl);
      } catch (err) {
        setError("Failed to load PDF");
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, [storagePath, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2 text-gray-600">Loading PDF...</span>
      </div>
    );
  }

  if (error || !pdfUrl) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <span className="text-red-600">{error || "Failed to load PDF"}</span>
      </div>
    );
  }

  const openInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  const openFullscreen = () => {
    const iframe = document.getElementById("pdf-iframe") as HTMLIFrameElement;
    if (iframe && iframe.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  return (
    <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
      {/* Header with controls */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{fileName}</h3>
          <p className="text-xs text-gray-500">Submitted: {submittedDate}</p>
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
          id="pdf-iframe"
          src={pdfUrl}
          className="w-full h-[700px] border-0"
          title="Resume Preview"
          loading="lazy"
        />

        <div className="absolute inset-0 pointer-events-none border border-gray-200/50 rounded-b-lg" />
      </div>
    </div>
  );
};

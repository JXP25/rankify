"use client";

import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/uploads/dropzone";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useRef, useCallback } from "react";

interface ResumeUploadSectionProps {
  onFilePreview?: (file: File | null) => void;
}

export function ResumeUploadSection({
  onFilePreview,
}: ResumeUploadSectionProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();
  const previousFilesLength = useRef(0);
  const lastProcessedSuccess = useRef<string | null>(null);

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

  const handleUploadSuccess = useCallback(
    async (fileName: string, uploadPath: string) => {
      if (!userId) return;

      try {
        const { error } = await supabase.from("resumes").insert({
          user_id: userId,
          name: fileName,
          storage_path: uploadPath,
          status: "PENDING",
        });

        if (error) {
          console.error("Error saving resume metadata:", error);
        }
      } catch (error) {
        console.error("Error handling upload success:", error);
      }
    },
    [userId, supabase],
  );

  const props = useSupabaseUpload({
    bucketName: "resumes",
    path: userId ? `candidate-uploads/${userId}` : "candidate-uploads",
    allowedMimeTypes: ["application/pdf"],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 2, // 2MB,
  });

  useEffect(() => {
    if (props.files.length > 0) {
      const file = props.files[0];
      if (file.errors.length === 0) {
        onFilePreview?.(file);
      } else {
        onFilePreview?.(null);
      }
    } else if (previousFilesLength.current > 0) {
      onFilePreview?.(null);
    }

    previousFilesLength.current = props.files.length;
  }, [props.files, onFilePreview]);

  // Handle successful upload
  useEffect(() => {
    if (props.isSuccess && props.successes.length > 0) {
      const currentSuccess = props.successes[0];

      if (currentSuccess !== lastProcessedSuccess.current) {
        lastProcessedSuccess.current = currentSuccess;
        const successData = JSON.parse(currentSuccess);
        handleUploadSuccess(successData.name, successData.uploadPath);
        onFilePreview?.(null);
      }
    }
  }, [props.isSuccess, props.successes, handleUploadSuccess, onFilePreview]);

  useEffect(() => {
    if (!props.isSuccess && props.successes.length === 0) {
      lastProcessedSuccess.current = null;
    }
  }, [props.isSuccess, props.successes]);

  return (
    <Dropzone {...props}>
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  );
}

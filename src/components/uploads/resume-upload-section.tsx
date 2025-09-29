"use client";

import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/uploads/dropzone";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function ResumeUploadSection() {
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

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

  const handleUploadSuccess = async (fileName: string) => {
    if (!userId) return;

    try {
      const storagePath = `candidate-uploads/${userId}/${fileName}`;

      const { error } = await supabase.from("resumes").insert({
        user_id: userId,
        storage_path: storagePath,
        status: "PENDING",
      });

      if (error) {
        console.error("Error saving resume metadata:", error);
      }
    } catch (error) {
      console.error("Error handling upload success:", error);
    }
  };

  const props = useSupabaseUpload({
    bucketName: "resumes",
    path: userId ? `candidate-uploads/${userId}` : "candidate-uploads",
    allowedMimeTypes: ["application/pdf"],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 2, // 2MB,
  });

  useEffect(() => {
    if (props.isSuccess && props.successes.length > 0) {
      const fileName = props.successes[0];
      handleUploadSuccess(fileName);
    }
  }, [props.isSuccess, props.successes, userId, handleUploadSuccess]);

  return (
    <Dropzone {...props}>
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  );
}

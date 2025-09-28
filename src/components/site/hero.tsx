"use client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/uploads/dropzone";
import Image from "next/image";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  const props = useSupabaseUpload({
    bucketName: "resumes",
    path: "test",
    allowedMimeTypes: ["*"],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 2, // 10MB,
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-28">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <p className="text-xs font-medium text-accent">
            {"Introducing Rankify"}
          </p>
          <h1 className="text-balance text-4xl font-semibold sm:text-5xl lg:text-6xl">
            {"Where Resumes Get Noticed."}
          </h1>
          <p className="text-pretty text-muted-foreground">
            {
              "Rankify provides a transparent path from submission to review. Candidates track their application status in real-time, while hiring teams get a powerful toolkit to efficiently score, manage, and discover top talent."
            }
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up" aria-label="Get started">
                Get started
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features" aria-label="Explore features">
                How it works
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 text-sm text-muted-foreground sm:grid-cols-4">
            <div>
              <span className="block text-foreground font-semibold">100%</span>{" "}
              Application Transparency
            </div>
            <div>
              <span className="block text-foreground font-semibold">85%</span>{" "}
              Faster Review Cycles
            </div>
            <div>
              <span className="block text-foreground font-semibold">
                Top 5%
              </span>{" "}
              Candidates Surfaced
            </div>
            <div>
              <span className="block text-foreground font-semibold">
                Instant
              </span>{" "}
              Status Updates
            </div>
          </div>
        </div>
        <div className=" flex flex-col items-center">
          <Image src="/resume.png" alt="Hero" width={350} height={350} />
          <div className="w-[500px] rounded-xl border bg-card p-4 md:p-6">
            <Dropzone {...props}>
              <DropzoneEmptyState />
              <DropzoneContent />
            </Dropzone>
          </div>
        </div>
      </div>
    </section>
  );
}

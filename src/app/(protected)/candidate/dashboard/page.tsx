import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResumeUploadSection } from "@/components/uploads/resume-upload-section";
import { CandidateResumeList } from "@/components/candidate/resume-list";
export default async function Dashboard() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      <ResumeUploadSection />
      <CandidateResumeList />
    </div>
  );
}

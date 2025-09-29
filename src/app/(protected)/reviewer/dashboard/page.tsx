import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReviewerDashboardLayout } from "@/components/reviewer/dashboard-layout";

export default async function Dashboard() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return <ReviewerDashboardLayout />;
}

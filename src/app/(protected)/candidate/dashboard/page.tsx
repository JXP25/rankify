import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/ui/logout-button";
import { createClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {"Candidate Dashboard"}
      <p>
        Hello <span>{data.claims.email}</span>
      </p>

      <LogoutButton />
    </div>
  );
}

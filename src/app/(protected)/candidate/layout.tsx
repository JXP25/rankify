import { RoleHeader } from "@/components/candidate/header";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <RoleHeader />
      <main>{children}</main>
    </div>
  );
}

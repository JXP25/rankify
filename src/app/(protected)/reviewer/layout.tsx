import { RoleHeader } from "@/components/reviewer/header";

export default function ReviewerLayout({
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

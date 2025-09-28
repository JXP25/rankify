import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function IconBolt() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
    </svg>
  );
}
function IconPlug() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9 2v6H7a5 5 0 000 10h2v4h2v-4h2a5 5 0 000-10h-2V2H9z" />
    </svg>
  );
}
function IconGraph() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4 20h16v2H2V2h2v18zm3-4h3V8H7v8zm5 0h3V4h-3v12zm5 0h3v-6h-3v6z" />
    </svg>
  );
}

export function Features() {
  const items = [
    {
      title: "Real-Time Status Tracking",
      desc: "No more guessing games. Submit your resume and track its status instantly as it moves from 'Pending' to 'Approved', with clear feedback along the way.",
      icon: IconBolt, // Represents speed and instant updates
    },
    {
      title: "Secure & Simple Access",
      desc: "Log in instantly with passwordless magic links sent to your email. Your submissions and data are protected by enterprise-grade security.",
      icon: IconShield, // Represents security
    },
    {
      title: "Streamlined Dashboard",
      desc: "For reviewers, a powerful and intuitive dashboard to view, score, and add notes to applications, helping you identify top talent faster than ever.",
      icon: IconPlug, // Represents the admin panel/list view
    },
    {
      title: "Data-Driven Leaderboard",
      desc: "Go beyond subjective reviews. A scoring system allows for objective ranking, with top performers showcased on a public leaderboard to foster healthy competition.",
      icon: IconGraph, // Represents scoring and analytics
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="mb-10 space-y-3">
        <h2 className="text-balance text-3xl font-semibold sm:text-4xl">
          A Better Experience for Everyone
        </h2>
        <p className="text-muted-foreground">
          Designed from the ground up to make the resume review process
          transparent for candidates and efficient for hiring teams.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <Card key={it.title} className="h-full bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="rounded-md bg-secondary p-2 text-primary">
                  <it.icon />
                </span>
                <CardTitle className="text-lg">{it.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{it.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

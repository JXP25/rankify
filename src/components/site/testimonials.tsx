import { Card, CardContent } from "@/components/ui/card";

export function Testimonials() {
  const quotes = [
    {
      quote:
        "Rankify has transformed our hiring workflow. We can now review and score candidates in a fraction of the time, allowing us to focus on the best talent.",
      name: "Lead Recruiter",
      company: "Innovate Inc.",
    },
    {
      quote:
        "The transparency is incredible. For the first time, I wasn't left wondering about my application status. Seeing the direct feedback was a huge plus.",
      name: "Software Engineer Candidate",
      company: "Tech Industry Applicant",
    },
    {
      quote:
        "The scoring and leaderboard system brought much-needed objectivity to our process. It's now easier than ever to identify and prioritize top applicants.",
      name: "Hiring Manager",
      company: "Momentum Labs",
    },
  ];

  return (
    <section
      id="testimonials"
      className="mx-auto max-w-6xl px-4 py-16 sm:py-24"
    >
      <div className="mb-10 space-y-3">
        <h2 className="text-balance text-3xl font-semibold sm:text-4xl">
          Loved by modern teams
        </h2>
        <p className="text-muted-foreground">
          Customer stories from companies shipping faster with Rankify.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {quotes.map((q, i) => (
          <Card key={i} className="h-full border bg-card">
            <CardContent className="space-y-4 p-6">
              <p className="text-pretty text-lg leading-relaxed">“{q.quote}”</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{q.name}</span> —{" "}
                {q.company}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

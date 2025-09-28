import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="rounded-xl border bg-card p-8 md:p-12">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">
            {"Ready to Find Your Next Opportunity?"}
          </h2>
          <p className="text-muted-foreground">
            {
              "Whether you're submitting your resume or building a top-tier team, Rankify streamlines the entire process. Get started for free today."
            }
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">Create account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">See how it works</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { SiteHeader } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Features } from "@/components/site/features";
import { Testimonials } from "@/components/site/testimonials";
import { FinalCTA } from "@/components/site/final-cta";
import { SiteFooter } from "@/components/site/footer";

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <div className="flex justify-start">
        <div className="bg-gradient-to-br from-primary to-indigo-600 w-[400px] h-[300px] absolute -translate-y-8 rounded-full opacity-60 blur-[200px]"></div>
      </div>
      <Hero />
      <div className="flex justify-end">
        <div className="bg-gradient-to-br from-primary to-indigo-600 w-[400px] h-[300px] absolute -translate-y-8 rounded-full opacity-60 blur-[150px]"></div>
      </div>
      <Features />
      <div className="flex justify-start">
        <div className="bg-gradient-to-br from-primary to-indigo-600 w-[100px] h-[200px] absolute -translate-y-8 rounded-full opacity-60 blur-[100px]"></div>
      </div>
      <Testimonials />
      <div className="flex justify-end">
        <div className="bg-gradient-to-br from-primary to-indigo-600 w-[400px] h-[300px] absolute translate-y-14 rounded-full opacity-50 blur-[200px]"></div>
      </div>
      <FinalCTA />
      <SiteFooter />
    </main>
  );
}

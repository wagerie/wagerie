"use client";

import { trustMechanisms } from "@/components/landing/landing-page-data";

export function TrustMechanismsSection() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {trustMechanisms.map(([Icon, title, description]) => (
        <div
          key={title}
          className="rounded-3xl border border-border bg-card p-5 shadow-lg"
        >
          <Icon className="h-5 w-5 text-blue-500" />
          <h2 className="mt-4 text-sm font-bold text-foreground">{title}</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      ))}
    </section>
  );
}
